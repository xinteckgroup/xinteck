"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getSiteSettings(category?: string) {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const where: any = {};
    if (category && category !== "all") {
        where.category = category;
    }

    const settings = await prisma.siteSetting.findMany({
        where,
        orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    return settings;
}

export async function getSiteSettingCategories() {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const categories = await prisma.siteSetting.findMany({
        distinct: ["category"],
        select: { category: true },
    });

    return categories.map(c => c.category);
}

import { siteSettingSchema } from "@/lib/validations";

export async function upsertSiteSetting(data: {
    key: string;
    value: string;
    type?: string;
    category?: string;
    isPublic?: boolean;
    description?: string;
}) {
    const user = await requireRole([Role.SUPER_ADMIN]);
    // Uses the updated strict schema
    const parsed = siteSettingSchema.parse(data);

    const setting = await prisma.siteSetting.upsert({
        where: { key: data.key },
        update: {
            value: data.value,
            ...(data.type && { type: data.type as any }),
            ...(data.category && { category: data.category }),
            ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
            ...(data.description !== undefined && { description: data.description }),
            updatedById: user.id,
        },
        create: {
            key: data.key,
            value: data.value,
            type: (data.type as any) || "STRING",
            category: data.category || "general",
            isPublic: data.isPublic || false,
            description: data.description || null,
            updatedById: user.id,
        },
    });

    await logAudit({
        action: "setting.update",
        entity: "SiteSetting",
        entityId: setting.id,
        userId: user.id,
        metadata: { key: data.key },
    });

    revalidatePath("/admin/settings", "page");
    return { success: true };
}

export async function deleteSiteSetting(key: string) {
    const user = await requireRole([Role.SUPER_ADMIN]);

    const setting = await prisma.siteSetting.delete({
        where: { key },
    });

    await logAudit({
        action: "setting.delete",
        entity: "SiteSetting",
        entityId: setting.id,
        userId: user.id,
        metadata: { key },
    });

    revalidatePath("/admin/settings", "page");
    return { success: true };
}

// Public helper — fetch public settings for frontend (no auth required)
export async function getPublicSiteSettings() {
    const settings = await prisma.siteSetting.findMany({
        where: { isPublic: true },
        select: { key: true, value: true, type: true },
    });

    return Object.fromEntries(settings.map(s => [s.key, s.value]));
}
