"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { createPaginatedResult, getPaginationParams, PaginatedResponse } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { CareerPosition, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Validation ───

const careerPositionSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    department: z.string().min(1, "Department is required"),
    type: z.string().min(1, "Employment type is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().optional(),
    requirements: z.array(z.string()).default([]),
    salaryRange: z.string().optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().default(0),
});

type CareerPositionInput = z.infer<typeof careerPositionSchema>;

// ─── Admin Actions (Authenticated) ───

export async function getCareerPositions(params?: {
    search?: string;
    department?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}): Promise<PaginatedResponse<CareerPosition>> {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const { skip, take } = getPaginationParams({ page: params?.page, pageSize: params?.pageSize });

    const where: any = {
        deletedAt: null,
    };

    if (params?.search) {
        where.OR = [
            { title: { contains: params.search, mode: "insensitive" } },
            { department: { contains: params.search, mode: "insensitive" } },
            { location: { contains: params.search, mode: "insensitive" } },
        ];
    }

    if (params?.department && params.department !== "all") {
        where.department = params.department;
    }

    if (params?.status && params.status !== "all") {
        if (params.status === "active") {
            where.isActive = true;
        } else if (params.status === "inactive") {
            where.isActive = false;
        }
    }

    const [items, total] = await Promise.all([
        prisma.careerPosition.findMany({
            where,
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            skip,
            take,
        }),
        prisma.careerPosition.count({ where }),
    ]);

    return createPaginatedResult(items, total, params?.page || 1, params?.pageSize || 12);
}

export async function getCareerPosition(id: string) {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const position = await prisma.careerPosition.findUnique({ where: { id } });
    if (!position || position.deletedAt) {
        throw new Error("Position not found");
    }

    return position;
}

export async function createCareerPosition(data: CareerPositionInput) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const parsed = careerPositionSchema.parse(data);

    const position = await prisma.careerPosition.create({
        data: parsed,
    });

    await logAudit({
        action: "careers.create",
        entity: "CareerPosition",
        entityId: position.id,
        userId: admin.id,
        metadata: { title: parsed.title, department: parsed.department },
    });

    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return { success: true, position };
}

export async function updateCareerPosition(id: string, data: CareerPositionInput) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const parsed = careerPositionSchema.parse(data);

    const position = await prisma.careerPosition.update({
        where: { id },
        data: parsed,
    });

    await logAudit({
        action: "careers.update",
        entity: "CareerPosition",
        entityId: position.id,
        userId: admin.id,
        metadata: { title: parsed.title },
    });

    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return { success: true, position };
}

export async function deleteCareerPosition(id: string) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const position = await prisma.careerPosition.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    await logAudit({
        action: "careers.delete",
        entity: "CareerPosition",
        entityId: id,
        userId: admin.id,
        metadata: { title: position.title },
    });

    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return { success: true };
}

export async function toggleCareerPosition(id: string) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const existing = await prisma.careerPosition.findUnique({ where: { id } });
    if (!existing) throw new Error("Position not found");

    const position = await prisma.careerPosition.update({
        where: { id },
        data: { isActive: !existing.isActive },
    });

    await logAudit({
        action: "careers.toggle",
        entity: "CareerPosition",
        entityId: id,
        userId: admin.id,
        metadata: { isActive: position.isActive },
    });

    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return { success: true, isActive: position.isActive };
}

// ─── Public Action (No Auth) ───

export async function getActiveCareerPositions(): Promise<CareerPosition[]> {
    return prisma.careerPosition.findMany({
        where: {
            isActive: true,
            deletedAt: null,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
}

export async function getCareerDepartments(): Promise<string[]> {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const results = await prisma.careerPosition.findMany({
        where: { deletedAt: null },
        select: { department: true },
        distinct: ["department"],
        orderBy: { department: "asc" },
    });

    return results.map((r: { department: string }) => r.department);
}
