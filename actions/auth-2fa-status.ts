"use server";

import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function get2FAStatus() {
    const sessionUser = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Fetch fresh from DB
    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { twoFactorEnabled: true }
    });

    if (!user) return { success: false, enabled: false };

    return { success: true, enabled: user.twoFactorEnabled };
}
