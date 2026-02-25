"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { CampaignAudience, CampaignStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createPaginatedResult, getPaginationParams, PaginatedResponse, PaginationParams } from "@/lib/pagination";

import { z } from "zod";

// ─── Validation ───

const campaignSchema = z.object({
    subject: z.string().min(1, "Subject is required").max(200),
    previewText: z.string().max(300).optional(),
    content: z.string().min(1, "Content is required"),
    audience: z.enum(["ALL", "ACTIVE_ONLY"]).default("ACTIVE_ONLY"),
});

// ─── Types ───

export type CampaignFilter = PaginationParams & {
    status?: string;
    search?: string;
};

// ─── Queries ───

export async function getCampaigns(params: CampaignFilter = {}): Promise<PaginatedResponse<any>> {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { search, status } = params;

    const where: any = {};

    if (search) {
        where.subject = { contains: search, mode: "insensitive" };
    }

    if (status && status !== "all") {
        where.status = status.toUpperCase();
    }

    const [campaigns, total] = await Promise.all([
        prisma.newsletterCampaign.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.newsletterCampaign.count({ where }),
    ]);

    return createPaginatedResult(campaigns, total, page, limit);
}

export async function getCampaign(id: string) {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    return prisma.newsletterCampaign.findUnique({
        where: { id },
    });
}

export async function getCampaignStats() {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const [totalCampaigns, sentCampaigns, totalEmailsSent] = await Promise.all([
        prisma.newsletterCampaign.count(),
        prisma.newsletterCampaign.count({ where: { status: CampaignStatus.SENT } }),
        prisma.newsletterCampaign.aggregate({
            _sum: { sentCount: true },
        }),
    ]);

    return {
        totalCampaigns,
        sentCampaigns,
        totalEmailsSent: totalEmailsSent._sum.sentCount || 0,
    };
}

// ─── Quota Tracking ───

/**
 * Get current Resend usage for the day and month.
 * Tracks sends from our campaign table to enforce Free Plan limits.
 * Free Plan: 100/day, 3000/month, 100/batch.
 */
export async function getResendQuota() {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [dailyUsage, monthlyUsage, activeSubscribers, totalSubscribers] = await Promise.all([
        prisma.newsletterCampaign.aggregate({
            where: {
                sentAt: { gte: startOfDay },
                status: { in: [CampaignStatus.SENT, CampaignStatus.SENDING] },
            },
            _sum: { sentCount: true },
        }),
        prisma.newsletterCampaign.aggregate({
            where: {
                sentAt: { gte: startOfMonth },
                status: { in: [CampaignStatus.SENT, CampaignStatus.SENDING] },
            },
            _sum: { sentCount: true },
        }),
        prisma.newsletterSubscriber.count({ where: { isActive: true, deletedAt: null } }),
        prisma.newsletterSubscriber.count({ where: { deletedAt: null } }),
    ]);

    const dailySent = dailyUsage._sum.sentCount || 0;
    const monthlySent = monthlyUsage._sum.sentCount || 0;

    return {
        daily: { used: dailySent, limit: 100, remaining: Math.max(0, 100 - dailySent) },
        monthly: { used: monthlySent, limit: 3000, remaining: Math.max(0, 3000 - monthlySent) },
        batch: { limit: 100 },
        subscribers: { active: activeSubscribers, total: totalSubscribers },
        // The maximum emails that can be sent right now (respecting both daily + monthly)
        maxSendable: Math.min(Math.max(0, 100 - dailySent), Math.max(0, 3000 - monthlySent)),
    };
}

// ─── Mutations ───

export async function createCampaign(data: z.infer<typeof campaignSchema>) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const parsed = campaignSchema.parse(data);

    const campaign = await prisma.newsletterCampaign.create({
        data: {
            subject: parsed.subject,
            previewText: parsed.previewText || null,
            content: parsed.content,
            audience: parsed.audience as CampaignAudience,
            createdById: user.id,
        },
    });

    await logAudit({
        action: "newsletter.campaign.create",
        entity: "NewsletterCampaign",
        entityId: campaign.id,
        userId: user.id,
        metadata: { subject: campaign.subject },
    });

    revalidatePath("/admin/newsletter");
    return { success: true, id: campaign.id };
}

export async function updateCampaign(id: string, data: Partial<z.infer<typeof campaignSchema>>) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const existing = await prisma.newsletterCampaign.findUnique({ where: { id } });
    if (!existing) throw new Error("Campaign not found");
    if (existing.status !== CampaignStatus.DRAFT) throw new Error("Only draft campaigns can be edited");

    const campaign = await prisma.newsletterCampaign.update({
        where: { id },
        data: {
            ...(data.subject !== undefined ? { subject: data.subject } : {}),
            ...(data.previewText !== undefined ? { previewText: data.previewText } : {}),
            ...(data.content !== undefined ? { content: data.content } : {}),
            ...(data.audience !== undefined ? { audience: data.audience as CampaignAudience } : {}),
        },
    });

    await logAudit({
        action: "newsletter.campaign.update",
        entity: "NewsletterCampaign",
        entityId: campaign.id,
        userId: user.id,
        metadata: { subject: campaign.subject },
    });

    revalidatePath("/admin/newsletter");
    return { success: true, id: campaign.id };
}

export async function deleteCampaign(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const existing = await prisma.newsletterCampaign.findUnique({ where: { id } });
    if (!existing) throw new Error("Campaign not found");
    if (existing.status !== CampaignStatus.DRAFT) throw new Error("Only draft campaigns can be deleted");

    await prisma.newsletterCampaign.delete({ where: { id } });

    await logAudit({
        action: "newsletter.campaign.delete",
        entity: "NewsletterCampaign",
        entityId: id,
        userId: user.id,
        metadata: { subject: existing.subject },
    });

    revalidatePath("/admin/newsletter");
    return { success: true };
}
