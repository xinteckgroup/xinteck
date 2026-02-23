"use server";

import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma"; // Direct access for queries only
import { NotificationService } from "@/lib/services/notification-service";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Fetch notifications for the current user.
 * Optimization: Unread + recent Read (Limit strategy).
 */
export async function getNotifications() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Fetch unread
    const unread = await prisma.notification.findMany({
        where: {
            userId: user.id,
            isRead: false,
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 50
    });

    // Fetch recent read (only if unread count is low, or fixed window)
    const read = await prisma.notification.findMany({
        where: {
            userId: user.id,
            isRead: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10 // Show last 10 read messages
    });

    return {
        unread,
        read,
        totalUnread: unread.length
    };
}

export async function markNotificationRead(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Verify ownership
    const notification = await prisma.notification.findUnique({
        where: { id }
    });

    if (!notification || notification.userId !== user.id) {
        throw new Error("Unauthorized");
    }

    await NotificationService.markAsRead(id);

    // We don't revalidatePath here strictly because the UI uses local state + polling, 
    // but good practice for server rendered pages.
    revalidatePath("/admin");
    return { success: true };
}

export async function markAllNotificationsRead() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    await NotificationService.markAllAsRead(user.id);

    revalidatePath("/admin");
    return { success: true };
}

export async function deleteNotification(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Verify ownership
    const notification = await prisma.notification.findUnique({
        where: { id }
    });

    if (!notification || notification.userId !== user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.notification.delete({
        where: { id }
    });

    revalidatePath("/admin");
    return { success: true };
}

export async function deleteAllReadNotifications() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    await prisma.notification.deleteMany({
        where: {
            userId: user.id,
            isRead: true
        }
    });

    revalidatePath("/admin");
    return { success: true };
}
