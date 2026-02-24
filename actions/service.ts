"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations";
import { ContentStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createPaginatedResult, getPaginationParams, PaginatedResponse } from "@/lib/pagination";
import { PaginationParams } from "@/types/pagination";

export type ServiceFilter = PaginationParams & {
    search?: string;
};

export async function getServices(params: ServiceFilter = {}): Promise<PaginatedResponse<any>> {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { search } = params;

    const where: any = { deletedAt: null }; // Exclude soft-deleted items
    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: 'insensitive' } }
        ];
    }

    const [services, total] = await Promise.all([
        prisma.service.findMany({
            where,
            orderBy: { sortOrder: 'asc' },
            skip,
            take: limit
        }),
        prisma.service.count({ where })
    ]);

    return createPaginatedResult(services, total, page, limit);
}

import { uuidSchema } from "@/lib/validations";

export async function getService(identifier: string) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    // First, try to find by ID (CUID or UUID)
    // CUIDs typically start with 'c' and are ~25 chars. UUIDs are 36 chars.
    // We'll trust the database to find it by ID first.
    const serviceById = await prisma.service.findUnique({
        where: { id: identifier }
    });

    if (serviceById) {
        return serviceById;
    }

    // If not found by ID, try generic slug lookup
    // This allows /admin/services/[slug] to work
    return await prisma.service.findUnique({
        where: { slug: identifier }
    });
}

export async function createService(data: any) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const parsed = serviceSchema.parse(data);

    let finalStatus = parseStatus(data.status);
    if (finalStatus === ContentStatus.PUBLISHED && user.role !== Role.SUPER_ADMIN) {
        finalStatus = ContentStatus.IN_REVIEW;
    }

    const service = await prisma.service.create({
        data: {
            ...parsed as any,
            status: finalStatus,
            sortOrder: 0
        }
    });

    await logAudit({
        action: "service.create",
        entity: "Service",
        entityId: service.id,
        userId: user.id
    });

    revalidatePath("/admin/services");
    revalidatePath("/services");
    return service;
}

export async function updateService(id: string, data: any) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);
    const parsed = serviceSchema.partial().parse(data);

    const { themeColor, status, ...restParsed } = parsed as any;

    let finalStatus = status ? parseStatus(status) : undefined;
    if (finalStatus === ContentStatus.PUBLISHED && user.role !== Role.SUPER_ADMIN) {
        finalStatus = ContentStatus.IN_REVIEW;
    }

    // Optimistic locking (Phase 3)
    const currentVersion = data.version;

    try {
        const service = await prisma.service.update({
            where: {
                id: validatedId,
                ...(typeof currentVersion === 'number' ? { version: currentVersion } : {})
            },
            data: {
                ...restParsed,
                ...(finalStatus ? { status: finalStatus } : {}),
                version: { increment: 1 }
            }
        });

        await logAudit({
            action: "service.update",
            entity: "Service",
            entityId: service.id,
            userId: user.id,
            metadata: {}
        });

        revalidatePath("/admin/services");
        revalidatePath(`/services/${service.slug}`);
        return service;
    } catch (error: any) {
        if (error.code === 'P2025') {
            throw new Error("Concurrency conflict: This service has been modified by another user. Please refresh and try again.");
        }
        throw error;
    }
}

export async function deleteService(id: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    const timestamp = Date.now();
    const service = await prisma.service.update({
        where: { id: validatedId },
        data: {
            status: ContentStatus.ARCHIVED,
            // @ts-ignore
            deletedAt: new Date(),
            slug: `${validatedId.slice(0, 8)}-deleted-${timestamp}` // Rename slug to free it up
        }
    });

    await logAudit({
        action: "service.delete",
        entity: "Service",
        entityId: service.id,
        userId: user.id,
        metadata: { originalSlug: service.slug }
    });

    revalidatePath("/admin/services");
    return { success: true };
}

export async function updateServiceStatus(id: string, status: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    let finalStatus = parseStatus(status);
    if (finalStatus === ContentStatus.PUBLISHED && user.role !== Role.SUPER_ADMIN) {
        finalStatus = ContentStatus.IN_REVIEW;
    }

    const service = await prisma.service.update({
        where: { id: validatedId },
        data: { status: finalStatus }
    });

    await logAudit({
        action: "service.status_change",
        entity: "Service",
        entityId: service.id,
        userId: user.id,
        metadata: { status: finalStatus }
    });

    revalidatePath("/admin/services");
    revalidatePath("/services");
    return service;
}

// Helpers
function parseStatus(status: string): ContentStatus {
    if (status === "Published") return ContentStatus.PUBLISHED;
    if (status === "Draft") return ContentStatus.DRAFT;
    if (status === "In Review") return ContentStatus.IN_REVIEW;
    if (status === "Archived") return ContentStatus.ARCHIVED;
    return ContentStatus.DRAFT;
}

export async function updateServiceOrder(items: { id: string; sortOrder: number }[]) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    try {
        await prisma.$transaction(
            items.map((item) =>
                prisma.service.update({
                    where: { id: item.id },
                    data: { sortOrder: item.sortOrder }
                })
            )
        );

        await logAudit({
            action: "service.reorder",
            entity: "Service",
            entityId: "batch",
            userId: user.id,
            metadata: { count: items.length }
        });

        revalidatePath("/admin/services");
        revalidatePath("/services");
        return { success: true };
    } catch (error) {
        console.error("Failed to reorder services:", error);
        throw new Error("Failed to update service order");
    }
}
