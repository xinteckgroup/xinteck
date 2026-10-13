"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Announcement, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Validation ───

const announcementSchema = z.object({
    text: z.string().min(3, "Text must be at least 3 characters"),
    icon: z.string().default("Zap"),
    highlight: z.boolean().default(false),
    link: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().default(0),
});

type AnnouncementInput = z.infer<typeof announcementSchema>;

// ─── Admin Actions (Authenticated) ───

export async function getAnnouncements(): Promise<Announcement[]> {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    return prisma.announcement.findMany({
        where: { deletedAt: null },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
}

export async function createAnnouncement(data: AnnouncementInput) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const parsed = announcementSchema.parse(data);

    const announcement = await prisma.announcement.create({
        data: {
            ...parsed,
            link: parsed.link || null,
        },
    });

    await logAudit({
        action: "announcement.create",
        entity: "Announcement",
        entityId: announcement.id,
        userId: admin.id,
        metadata: { text: parsed.text },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/");

    return { success: true, announcement };
}

export async function updateAnnouncement(id: string, data: AnnouncementInput) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const parsed = announcementSchema.parse(data);

    const announcement = await prisma.announcement.update({
        where: { id },
        data: {
            ...parsed,
            link: parsed.link || null,
        },
    });

    await logAudit({
        action: "announcement.update",
        entity: "Announcement",
        entityId: announcement.id,
        userId: admin.id,
        metadata: { text: parsed.text },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/");

    return { success: true, announcement };
}

export async function deleteAnnouncement(id: string) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const announcement = await prisma.announcement.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    await logAudit({
        action: "announcement.delete",
        entity: "Announcement",
        entityId: id,
        userId: admin.id,
        metadata: { text: announcement.text },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/");

    return { success: true };
}

export async function toggleAnnouncementActive(id: string) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw new Error("Announcement not found");

    const announcement = await prisma.announcement.update({
        where: { id },
        data: { isActive: !existing.isActive },
    });

    await logAudit({
        action: "announcement.update",
        entity: "Announcement",
        entityId: id,
        userId: admin.id,
        metadata: { toggled: announcement.isActive ? "active" : "inactive" },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/");

    return { success: true, isActive: announcement.isActive };
}

export async function reorderAnnouncements(orderedIds: string[]) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    await prisma.$transaction(
        orderedIds.map((id, index) =>
            prisma.announcement.update({
                where: { id },
                data: { sortOrder: index },
            })
        )
    );

    await logAudit({
        action: "announcement.update",
        entity: "Announcement",
        userId: admin.id,
        metadata: { action: "reorder", count: orderedIds.length },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/");

    return { success: true };
}

// ─── Public Action (No Auth) ───

export async function getActiveAnnouncements(): Promise<Announcement[]> {
    return prisma.announcement.findMany({
        where: {
            isActive: true,
            deletedAt: null,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
}
