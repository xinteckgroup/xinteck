import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { getCurrentUser } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification-service";
import { CampaignStatus, NotificationPriority, NotificationType, Role } from "@prisma/client";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { NewsletterEmail } from "@/components/emails/NewsletterEmail";

/**
 * POST /api/newsletter/send
 * Send a newsletter campaign to subscribers.
 * Enforces Resend Free Plan limits: 100/day, 3000/month, 100/batch.
 * 
 * Body: { campaignId: string, sendLimit?: number }
 * sendLimit: optional cap on how many emails to send (respecting quota)
 */
export async function POST(req: Request) {
    try {
        // Auth
        const user = await getCurrentUser();
        if (!user || (user.role !== Role.SUPER_ADMIN && user.role !== Role.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { campaignId, sendLimit } = await req.json();
        if (!campaignId) {
            return NextResponse.json({ error: "campaignId is required" }, { status: 400 });
        }

        // Fetch campaign
        const campaign = await prisma.newsletterCampaign.findUnique({ where: { id: campaignId } });
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }
        if (campaign.status !== CampaignStatus.DRAFT) {
            return NextResponse.json({ error: "Only draft campaigns can be sent" }, { status: 400 });
        }

        // Calculate quota
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [dailyUsage, monthlyUsage] = await Promise.all([
            prisma.newsletterCampaign.aggregate({
                where: { sentAt: { gte: startOfDay }, status: { in: [CampaignStatus.SENT, CampaignStatus.SENDING] } },
                _sum: { sentCount: true },
            }),
            prisma.newsletterCampaign.aggregate({
                where: { sentAt: { gte: startOfMonth }, status: { in: [CampaignStatus.SENT, CampaignStatus.SENDING] } },
                _sum: { sentCount: true },
            }),
        ]);

        const dailyRemaining = Math.max(0, 100 - (dailyUsage._sum.sentCount || 0));
        const monthlyRemaining = Math.max(0, 3000 - (monthlyUsage._sum.sentCount || 0));
        const maxSendable = Math.min(dailyRemaining, monthlyRemaining);

        if (maxSendable === 0) {
            return NextResponse.json({
                error: "Daily or monthly email quota exhausted. Please try again later.",
                dailyRemaining,
                monthlyRemaining,
            }, { status: 429 });
        }

        // Fetch subscribers based on audience
        const subscriberWhere: any = { deletedAt: null };
        if (campaign.audience === "ACTIVE_ONLY") {
            subscriberWhere.isActive = true;
        }

        const allSubscribers = await prisma.newsletterSubscriber.findMany({
            where: subscriberWhere,
            select: { email: true },
            orderBy: { createdAt: "asc" },
        });

        if (allSubscribers.length === 0) {
            return NextResponse.json({ error: "No subscribers found for this audience" }, { status: 400 });
        }

        // Apply send limit (user-chosen cap, then quota cap, then batch cap of 100)
        const effectiveLimit = Math.min(
            sendLimit || allSubscribers.length,
            maxSendable,
            allSubscribers.length
        );

        const targetSubscribers = allSubscribers.slice(0, effectiveLimit);

        // Mark campaign as SENDING
        await prisma.newsletterCampaign.update({
            where: { id: campaignId },
            data: {
                status: CampaignStatus.SENDING,
                recipientCount: targetSubscribers.length,
                sentAt: now,
            },
        });

        // Get Resend credentials
        const apiKey = await INTERNAL_getSecret("RESEND_API_KEY");
        const fromEmail = await INTERNAL_getSecret("RESEND_FROM_EMAIL");

        if (!apiKey) {
            await prisma.newsletterCampaign.update({
                where: { id: campaignId },
                data: { status: CampaignStatus.FAILED },
            });
            return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
        }

        const resend = new Resend(apiKey);
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xinteck.co.ke";

        // Send in batches of 50 (well within Resend's 100 batch limit)
        const BATCH_SIZE = 50;
        let sentCount = 0;
        let failedCount = 0;

        for (let i = 0; i < targetSubscribers.length; i += BATCH_SIZE) {
            const batch = targetSubscribers.slice(i, i + BATCH_SIZE);

            const sendPromises = batch.map(async (sub) => {
                try {
                    const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?email=${Buffer.from(sub.email).toString("base64")}`;

                    const emailHtml = await render(
                        NewsletterEmail({
                            subject: campaign.subject,
                            content: campaign.content,
                            previewText: campaign.previewText || undefined,
                            unsubscribeUrl,
                        })
                    );

                    await resend.emails.send({
                        from: fromEmail || "onboarding@resend.dev",
                        to: sub.email,
                        subject: campaign.subject,
                        html: emailHtml,
                        headers: {
                            "List-Unsubscribe": `<${unsubscribeUrl}>`,
                            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                        },
                    });

                    sentCount++;
                } catch (err) {
                    console.error(`Failed to send to ${sub.email}:`, err);
                    failedCount++;
                }
            });

            await Promise.all(sendPromises);

            // Rate limiting: wait 600ms between batches (2 req/s limit)
            if (i + BATCH_SIZE < targetSubscribers.length) {
                await new Promise((r) => setTimeout(r, 600));
            }
        }

        // Update campaign stats
        const finalStatus = failedCount === targetSubscribers.length ? CampaignStatus.FAILED : CampaignStatus.SENT;

        await prisma.newsletterCampaign.update({
            where: { id: campaignId },
            data: {
                status: finalStatus,
                sentCount,
                failedCount,
            },
        });

        await logAudit({
            action: "newsletter.campaign.send",
            entity: "NewsletterCampaign",
            entityId: campaignId,
            userId: user.id,
            metadata: { subject: campaign.subject, sentCount, failedCount, recipientCount: targetSubscribers.length },
        });

        // Notify admins
        await NotificationService.broadcastToRoles({
            roles: [Role.SUPER_ADMIN, Role.ADMIN],
            title: "Newsletter Sent",
            message: `"${campaign.subject}" sent to ${sentCount} subscribers.${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
            type: NotificationType.SUCCESS,
            priority: NotificationPriority.NORMAL,
            link: "/admin/newsletter/campaigns",
        });

        return NextResponse.json({
            success: true,
            sentCount,
            failedCount,
            recipientCount: targetSubscribers.length,
        });

    } catch (error: any) {
        console.error("Newsletter Send Error:", error);
        return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
    }
}
