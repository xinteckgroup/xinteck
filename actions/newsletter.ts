"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createPaginatedResult, getPaginationParams, PaginatedResponse, PaginationParams } from "@/lib/pagination";

export type NewsletterFilter = PaginationParams & {
    filter?: "all" | "active" | "unsubscribed";
    search?: string;
};

export async function getNewsletterSubscribers(params: NewsletterFilter = {}): Promise<PaginatedResponse<any>> {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { search, filter } = params;

    const where: any = { deletedAt: null };
    if (search) {
        where.email = { contains: search, mode: 'insensitive' };
    }

    if (filter === "active") {
        where.isActive = true;
    } else if (filter === "unsubscribed") {
        where.isActive = false;
    }

    const [subscribers, total] = await Promise.all([
        prisma.newsletterSubscriber.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.newsletterSubscriber.count({ where })
    ]);

    const data = subscribers.map(s => ({
        id: s.id,
        email: s.email,
        isActive: s.isActive,
        source: s.source || "Website",
        subscribedAt: s.createdAt.toLocaleDateString(),
        unsubscribedAt: s.unsubscribedAt?.toLocaleDateString() || null
    }));

    return createPaginatedResult(data, total, page, limit);
}

export async function getNewsletterStats() {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const [total, active, unsubscribed] = await Promise.all([
        prisma.newsletterSubscriber.count({ where: { deletedAt: null } }),
        prisma.newsletterSubscriber.count({ where: { isActive: true, deletedAt: null } }),
        prisma.newsletterSubscriber.count({ where: { isActive: false, deletedAt: null } })
    ]);

    return { total, active, unsubscribed };
}

import { uuidSchema } from "@/lib/validations";

export async function unsubscribeSubscriber(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const validatedId = uuidSchema.parse(id);

    await prisma.newsletterSubscriber.update({
        where: { id: validatedId },
        data: { isActive: false, unsubscribedAt: new Date() }
    });

    await logAudit({
        action: "newsletter.unsubscribe",
        entity: "NewsletterSubscriber",
        entityId: validatedId,
        userId: user.id
    });

    revalidatePath("/admin/newsletter");
    return { success: true };
}

export async function resubscribeSubscriber(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const validatedId = uuidSchema.parse(id);

    await prisma.newsletterSubscriber.update({
        where: { id: validatedId },
        data: { isActive: true, unsubscribedAt: null }
    });

    await logAudit({
        action: "newsletter.subscribe",
        entity: "NewsletterSubscriber",
        entityId: id,
        userId: user.id
    });

    revalidatePath("/admin/newsletter");
    return { success: true };
}

export async function deleteSubscriber(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    const sub = await prisma.newsletterSubscriber.findUnique({ where: { id: validatedId } });
    if (!sub) throw new Error("Subscriber not found");

    await prisma.newsletterSubscriber.update({
        where: { id: validatedId },
        data: { isActive: false, deletedAt: new Date() }
    });

    await logAudit({
        action: "newsletter.delete",
        entity: "NewsletterSubscriber",
        entityId: validatedId,
        userId: user.id,
        metadata: { email: sub.email }
    });

    revalidatePath("/admin/newsletter");
    return { success: true };
}

export async function restoreSubscriber(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    await prisma.newsletterSubscriber.update({
        where: { id: validatedId },
        data: { deletedAt: null }
    });

    await logAudit({
        action: "newsletter.restore",
        entity: "NewsletterSubscriber",
        entityId: validatedId,
        userId: user.id
    });

    revalidatePath("/admin/newsletter");
    return { success: true };
}
