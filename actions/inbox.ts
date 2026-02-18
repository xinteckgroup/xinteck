"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification-service";
import { replySchema } from "@/lib/validations";
import { MessageStatus, NotificationType, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createPaginatedResult, getPaginationParams, PaginatedResponse, PaginationParams } from "@/lib/pagination";

export type InboxFilter = PaginationParams & {
    filter?: "all" | "unread" | "starred" | "archived";
    search?: string;
};

export async function getMessages(params: InboxFilter = {}): Promise<PaginatedResponse<any>> {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { filter, search } = params;

    const where: any = {
        deletedAt: null
    };

    if (filter === "unread") {
        where.status = "UNREAD";
        where.isArchived = false;
    } else if (filter === "starred") {
        where.isStarred = true;
        where.isArchived = false;
    } else if (filter === "archived") {
        where.isArchived = true;
    } else {
        where.isArchived = false;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { message: { contains: search, mode: 'insensitive' } }
        ];
    }

    const [messages, total] = await Promise.all([
        prisma.contactSubmission.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                replies: {
                    orderBy: { sentAt: 'desc' },
                    take: 1
                }
            }
        }),
        prisma.contactSubmission.count({ where })
    ]);

    const data = messages.map(m => ({
        id: m.id,
        sender: m.name,
        email: m.email,
        subject: `Inquiry from ${m.name}`,
        preview: m.message.substring(0, 100) + "...",
        message: m.message,
        date: formatDate(m.createdAt),
        unread: m.status === MessageStatus.UNREAD,
        starred: m.isStarred,
        archived: m.isArchived,
        replied: m.status === MessageStatus.REPLIED,
        color: "bg-blue-500",
        avatar: m.name.charAt(0).toUpperCase()
    }));

    return createPaginatedResult(data, total, page, limit);
}

export async function markAsRead(id: string, isRead: boolean) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    await prisma.contactSubmission.update({
        where: { id },
        data: { status: isRead ? MessageStatus.READ : MessageStatus.UNREAD }
    });

    await logAudit({
        action: isRead ? "contact.mark_read" : "contact.mark_unread",
        entity: "ContactSubmission",
        entityId: id,
        userId: user.id
    });

    revalidatePath("/admin/inbox");
}

export async function toggleStar(id: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const msg = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!msg) return;

    await prisma.contactSubmission.update({
        where: { id },
        data: { isStarred: !msg.isStarred }
    });

    await logAudit({
        action: msg.isStarred ? "contact.unstar" : "contact.star",
        entity: "ContactSubmission",
        entityId: id,
        userId: user.id
    });

    revalidatePath("/admin/inbox");
}

export async function archiveMessage(id: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    await prisma.contactSubmission.update({
        where: { id },
        data: { isArchived: true, status: MessageStatus.ARCHIVED }
    });

    await logAudit({
        action: "contact.archive",
        entity: "ContactSubmission",
        entityId: id,
        userId: user.id
    });

    revalidatePath("/admin/inbox");
}

export async function deleteMessage(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN]);

    await prisma.contactSubmission.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    await logAudit({
        action: "contact.delete",
        entity: "ContactSubmission",
        entityId: id,
        userId: user.id
    });

    revalidatePath("/admin/inbox");
}

export async function replyToMessage(id: string, content: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);
    const parsed = replySchema.parse({ content });

    const submission = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!submission) throw new Error("Message not found");

    // Create reply record
    await prisma.contactReply.create({
        data: {
            submissionId: id,
            content,
            sentBy: user.name
        }
    });

    // Update status to REPLIED
    await prisma.contactSubmission.update({
        where: { id },
        data: { status: MessageStatus.REPLIED }
    });

    // Send email via Resend
    try {
        const apiKey = await INTERNAL_getSecret("RESEND_API_KEY");
        const fromEmail = await INTERNAL_getSecret("RESEND_FROM_EMAIL");

        if (apiKey && fromEmail) {
            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: fromEmail,
                    to: submission.email,
                    subject: `Re: Your inquiry - ${submission.name}`,
                    html: `<div style="font-family: sans-serif; max-width: 600px;">
                        <p>${content.replace(/\n/g, '<br />')}</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="color: #888; font-size: 12px;">This is a reply to your inquiry submitted via our website.</p>
                    </div>`
                })
            });
        }
    } catch (e) {
        console.error("Failed to send reply email:", e);
    }

    await logAudit({
        action: "contact.reply",
        entity: "ContactSubmission",
        entityId: id,
        userId: user.id,
        metadata: { recipient: submission.email, contentPreview: content.substring(0, 100) }
    });

    // Notification to team
    try {
        await NotificationService.broadcastToRoles({
            roles: [Role.SUPER_ADMIN, Role.ADMIN], // Notify admins that someone replied
            title: "Reply Sent",
            message: `${user.name} replied to ${submission.name}.`,
            type: NotificationType.INFO,
            link: `/admin/inbox/${id}`,
            metadata: { repliedBy: user.name, inquiryId: id }
        });
    } catch (e) { console.error(e); }

    revalidatePath("/admin/inbox");
    return { success: true };
}

function formatDate(date: Date) {
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

export async function restoreMessage(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN]);

    await prisma.contactSubmission.update({
        where: { id },
        data: { deletedAt: null }
    });

    await logAudit({
        action: "contact.restore",
        entity: "ContactSubmission",
        entityId: id,
        userId: user.id
    });

    revalidatePath("/admin/inbox");
    return { success: true };
}


