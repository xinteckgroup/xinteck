"use server";

import { requireRole } from "@/lib/auth-check";
import { parseUtcEnd, parseUtcStart } from "@/lib/date-utils";
import { prisma } from "@/lib/prisma";
import { AuditLog, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Define return type for UI usage
export type AuditLogWithUser = AuditLog & {
    user: { name: string; email: string; avatar: string | null } | null;
};

interface GetAuditLogsParams {
    page?: number;
    limit?: number;
    action?: string;
    userId?: string;
    entity?: string;
    dateFrom?: string;
    dateTo?: string;
}

export async function getAuditLogs({
    page = 1,
    limit = 20,
    action,
    userId,
    entity,
    dateFrom,
    dateTo,
}: GetAuditLogsParams = {}) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const skip = (page - 1) * limit;

    const where: any = {};
    if (action && action !== "all") {
        if (["create", "update", "delete", "login"].includes(action)) {
            where.action = { contains: action, mode: 'insensitive' };
        } else {
            where.action = action;
        }
    }
    if (userId) {
        where.userId = userId;
    }
    if (entity && entity !== "all") {
        where.entity = entity;
    }
    if (dateFrom) {
        where.createdAt = { ...where.createdAt, gte: parseUtcStart(dateFrom) };
    }
    if (dateTo) {
        where.createdAt = { ...where.createdAt, lte: parseUtcEnd(dateTo) };
    }

    const [data, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { name: true, email: true, avatar: true },
                },
            },
        }),
        prisma.auditLog.count({ where }),
    ]);

    return {
        data: data as AuditLogWithUser[],
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
}

export async function getAuditEntities() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const entities = await prisma.auditLog.findMany({
        distinct: ["entity"],
        select: { entity: true },
        where: { entity: { not: null } },
    });

    return entities.map(e => e.entity).filter(Boolean) as string[];
}

export async function exportAuditLogsCsv(params: Omit<GetAuditLogsParams, "page" | "limit"> = {}) {
    await requireRole([Role.SUPER_ADMIN]);

    const where: any = {};
    if (params.action && params.action !== "all") {
        if (["create", "update", "delete", "login"].includes(params.action)) {
            where.action = { contains: params.action, mode: 'insensitive' };
        } else {
            where.action = params.action;
        }
    }
    if (params.userId) where.userId = params.userId;
    if (params.entity && params.entity !== "all") where.entity = params.entity;
    if (params.dateFrom) where.createdAt = { ...where.createdAt, gte: parseUtcStart(params.dateFrom) };
    if (params.dateTo) {
        where.createdAt = { ...where.createdAt, lte: parseUtcEnd(params.dateTo) };
    }

    const logs = await prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 5000,
        include: {
            user: { select: { name: true, email: true } },
        },
    });

    const header = "Date,Action,Entity,Entity ID,User,Metadata";
    const rows = logs.map(log => {
        const date = log.createdAt.toISOString();
        const user = log.user?.name || log.user?.email || "System";
        const metadata = log.metadata ? JSON.stringify(log.metadata).replace(/"/g, '""') : "";
        return `"${date}","${log.action}","${log.entity || ""}","${log.entityId || ""}","${user}","${metadata}"`;
    });

    return [header, ...rows].join("\n");
}

export async function deleteAuditLog(id: string) {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);

    await prisma.auditLog.delete({
        where: { id }
    });

    // We shouldn't necessarily audit the deletion of an audit log to prevent infinite loops,
    // but we can log a generic system event if needed. Currently, omit to prevent noise.

    revalidatePath("/admin/audit");
    return { success: true };
}

export async function deleteAuditLogs(ids: string[]) {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);

    if (!ids || ids.length === 0) return { success: false, message: "No IDs provided" };

    await prisma.auditLog.deleteMany({
        where: { id: { in: ids } }
    });

    revalidatePath("/admin/audit");
    return { success: true };
}

export async function clearAllAuditLogs() {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);

    // Nuke the entire table
    await prisma.auditLog.deleteMany({});

    revalidatePath("/admin/audit");
    return { success: true };
}
