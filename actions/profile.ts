"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

// Zod schema for notification preferences — only allow known boolean toggles
const notificationPrefsSchema = z.object({
    security: z.boolean(),
    updates: z.boolean(),
    comments: z.boolean(),
    marketing: z.boolean(),
}).strict(); // .strict() rejects any extra keys

// FETCH ACTIVITY
export async function getUserActivity(page = 1, limit = 10, search?: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    const skip = (page - 1) * limit;

    const where: any = { userId: user.id };

    if (search) {
        where.OR = [
            { action: { contains: search, mode: "insensitive" } },
            { entity: { contains: search, mode: "insensitive" } },
        ];
    }

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            select: {
                id: true,
                action: true,
                createdAt: true,
                metadata: true
            }
        }),
        prisma.auditLog.count({ where })
    ]);

    return {
        data: logs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

export async function exportUserActivityCsv() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    const logs = await prisma.auditLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        // Reasonable upper limit for a direct string return
        take: 5000,
        select: {
            action: true,
            createdAt: true,
            metadata: true
        }
    });

    const header = "Date,Action,Metadata";
    const rows = logs.map(log => {
        const date = log.createdAt.toISOString();
        const action = log.action;
        const metadata = log.metadata ? JSON.stringify(log.metadata).replace(/"/g, '""') : "";
        return `"${date}","${action}","${metadata}"`;
    });

    return [header, ...rows].join("\n");
}

// UPDATE NOTIFICATIONS
export async function getNotificationPreferences() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Return default prefs if null
    return (user.notificationPreferences as any) || {
        security: true,
        updates: true,
        comments: false,
        marketing: false
    };
}

export async function updateNotificationPreferences(prefs: any) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Validate preferences structure before writing to DB
    const parsed = notificationPrefsSchema.parse(prefs);

    await prisma.user.update({
        where: { id: user.id },
        data: { notificationPreferences: parsed }
    });

    await logAudit({
        action: "user.update_notification_prefs",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        metadata: parsed
    });

    return { success: true };
}
