"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import * as OTPAuth from "otpauth";

export async function generate2FASecret() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    const secret = new OTPAuth.Secret({ size: 20 });

    const totp = new OTPAuth.TOTP({
        issuer: "Xinteck Admin",
        label: user.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret
    });

    const otpauthUrl = totp.toString();

    return { success: true, secret: secret.base32, otpauthUrl };
}

export async function verifyAndEnable2FA(token: string, secret: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    const totp = new OTPAuth.TOTP({
        issuer: "Xinteck Admin",
        label: user.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret)
    });

    const delta = totp.validate({ token, window: 1 });
    const isValid = delta !== null;

    if (!isValid) {
        return { success: false, message: "Invalid 2FA code. Please try again." };
    }

    // Save to DB
    await prisma.user.update({
        where: { id: user.id },
        data: {
            twoFactorSecret: secret,
            twoFactorEnabled: true
        }
    });

    // Also mark current session as verified so they don't get kicked out immediately
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
        await prisma.session.updateMany({
            where: { token: sessionToken },
            data: { twoFactorVerified: true }
        });
    }

    await logAudit({
        action: "user.enabled_2fa",
        entity: "User",
        entityId: user.id,
        userId: user.id
    });

    return { success: true };
}

export async function disable2FA(password: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Verify password first
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser || !dbUser.passwordHash) {
        return { success: false, message: "User not found or password not set." };
    }

    const validPassword = await bcrypt.compare(password, dbUser.passwordHash);
    if (!validPassword) {
        return { success: false, message: "Incorrect password." };
    }

    // Disable 2FA
    await prisma.user.update({
        where: { id: user.id },
        data: {
            twoFactorSecret: null,
            twoFactorEnabled: false
        }
    });

    await logAudit({
        action: "user.disabled_2fa",
        entity: "User",
        entityId: user.id,
        userId: user.id
    });

    return { success: true };
}
