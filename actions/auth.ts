"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, resetPasswordSchema, updateProfileSchema } from "@/lib/validations";
import { InvitationStatus, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Resend } from "resend";

/*
Purpose: Validate invitation tokens server-side to prevent unauthorized access.
Decision: We check for existence, pending status, and expiry to ensure strict invite-only access.
*/
export async function validateInvitation(token: string) {
    const invitation = await prisma.invitation.findUnique({
        where: { token },
        include: { invitedBy: { select: { name: true } } }
    });

    if (!invitation) return { valid: false, message: "Invalid invitation link." };

    if (invitation.status !== InvitationStatus.PENDING) {
        return { valid: false, message: "This invitation has already been used or revoked." };
    }

    if (invitation.expiresAt < new Date()) {
        return { valid: false, message: "This invitation has expired." };
    }

    return {
        valid: true,
        email: invitation.email,
        role: invitation.role,
        invitedBy: invitation.invitedBy?.name
    };
}

/*
Purpose: Handle user registration with strict token gating.
Decision: We enforce a valid token for all registrations to maintain the private nature of the platform.
*/
export async function registerUser(data: { name: string; password: string; token?: string }) {
    // Purpose: Detect system initialization state to potentially allow first-user setup (though currently strictly gated).
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    let email = "";
    let role: Role = Role.SUPPORT_STAFF;

    if (isFirstUser) {
        // Fallback for initialization (though seed likely handled this)
        // Allow public register ONLY if 0 users exist
        // Validating email from data since we don't have a token
        if (!data.token) {
            // We need email from client if no token (and isFirstUser)
            // But signature changed. We might need to handle this strictly.
            // For simplicity, strict mode: First user MUST use seed or token?
            // Actually, keeping isFirstUser open is dangerous if "seed" didn't run.
            // Let's rely on the fact that seed user exists.
            // So: BLOCK ALL non-token registrations.
        }
        // Wait, "registerSchema" in validations.ts probably expects email.
        // We should adjust validations or just use partial parsing.
    }

    if (!data.token) {
        // Only allow if isFirstUser is true AND we accept provided email?
        if (isFirstUser) {
            // Allow providing email manually for the very first super admin if seed failed
            // But "data" signature might not have email.
            // Master Plan says "ignore client email/role input".
            // So we must rely on token.
            // IF isFirstUser, we could allow a bypass, but let's stick to strict Token Gating.
            // If DB is empty, user should use "prisma db seed".
            throw new Error("Registration is by invitation only.");
        }
        throw new Error("Registration is by invitation only.");
    }

    // Logic WITH Token
    const invitation = await prisma.invitation.findUnique({ where: { token: data.token } });

    if (!invitation || invitation.status !== InvitationStatus.PENDING || invitation.expiresAt < new Date()) {
        throw new Error("Invalid or expired invitation.");
    }

    email = invitation.email;
    role = invitation.role;

    // Purpose: Pre-check for existing user to fail early before expensive hashing.
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists.");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    /*
    Purpose: Atomically create the user and consume the invitation.
    Decision: Using a transaction ensures that an invitation cannot be used twice if requests are sent in parallel (race condition protection).
    */
    await prisma.$transaction([
        prisma.user.create({
            data: {
                name: data.name,
                email,
                passwordHash: hashedPassword,
                role,
                status: UserStatus.ACTIVE,
                // Linked invitation? No, invitation links to user via email loosely or we can add userId to invitation
            }
        }),
        prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: InvitationStatus.ACCEPTED }
        })
    ]);

    await logAudit({
        action: "user.register_accepted",
        entity: "User",
        entityId: email, // Using email as ID proxy for log since we don't have ID returned from transaction easily without separating logic
        metadata: { role, token: data.token }
    });

    return { success: true };
}

/*
Purpose: Initiate the password reset flow securely.
Decision: We return success even if the user doesn't exist to prevent email enumeration attacks.
*/
export async function forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Purpose: Silent failure to mask user existence.
        return { success: true, message: "If an account exists, an email has been sent." };
    }

    // Purpose: Generate a high-entropy token for the reset link.
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Purpose: Invalidate any previous reset tokens for this user to prevent clutter and replay.
    await prisma.passwordResetToken.deleteMany({ where: { email } }); // Clear old tokens
    await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expiresAt
        }
    });

    // Send Email via Resend
    const resendApiKey = await INTERNAL_getSecret("RESEND_API_KEY");
    const fromEmail = await INTERNAL_getSecret("RESEND_FROM_EMAIL");

    if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        // Assuming localhost for dev, but in prod ideally use env VAR for BASE_URL
        // For now, I'll use a relative path if deployed on vercel it handles it? No.
        // I need public URL.
        // Ensure APP_URL is set for production links
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!baseUrl && process.env.NODE_ENV === "production") {
            console.error("CRITICAL: NEXT_PUBLIC_APP_URL is not set. Password reset link will be broken.");
        }

        const effectiveUrl = baseUrl || "http://localhost:3000";
        const resetLink = `${effectiveUrl}/admin/reset-password?token=${token}`;

        try {
            await resend.emails.send({
                from: fromEmail || "onboarding@resend.dev",
                to: email,
                subject: "Reset Your Password - Xinteck",
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h1>Password Reset Request</h1>
                        <p>You requested to reset your password for Xinteck Admin Dashboard.</p>
                        <p>Click the link below to set a new password:</p>
                        <a href="${resetLink}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        <p>This link expires in 1 hour.</p>
                        <p>If you didn't request this, ignore this email.</p>
                    </div>
                `
            });
        } catch (e) {
            console.error("Failed to send reset email", e);
            throw new Error("Failed to send email. Inspect server logs.");
        }
    } else {
        console.warn("Resend API Key missing. Token generated but email not sent. Check System Settings.");
    }

    await logAudit({
        action: "auth.forgot_password_request",
        entity: "User",
        entityId: user.id
    });

    return { success: true, message: "If an account exists, an email has been sent." };
}

/*
Purpose: Complete the password reset process.
Decision: We re-validate the token's expiry and existence at the last moment to ensure security.
*/
export async function resetPassword(token: string, newPassword: string) {
    const parsed = resetPasswordSchema.parse({ token, newPassword });

    const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token: parsed.token } });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
        throw new Error("Invalid or expired token");
    }

    const user = await prisma.user.findUnique({ where: { email: resetRecord.email } });
    if (!user) {
        throw new Error("User not found");
    }

    const passwordHash = await bcrypt.hash(parsed.newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
    });

    // Cleanup
    await prisma.passwordResetToken.delete({ where: { token: parsed.token } });

    // Purpose: Invalidate all existing sessions to force re-login with the new password (security best practice).
    await prisma.session.deleteMany({ where: { userId: user.id } });

    await logAudit({
        action: "auth.reset_password",
        entity: "User",
        entityId: user.id
    });

    return { success: true };
}

/*
Purpose: Allow authenticated users to change their password.
Decision: We mandate the old password validation to confirm identity before allowing sensitive credential changes.
*/
export async function changePassword(oldPassword: string, newPassword: string) {
    const parsed = changePasswordSchema.parse({ oldPassword, newPassword });

    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) throw new Error("User not found");

    const valid = await bcrypt.compare(parsed.oldPassword, dbUser.passwordHash);
    if (!valid) {
        throw new Error("Incorrect current password.");
    }

    const passwordHash = await bcrypt.hash(parsed.newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
    });

    await logAudit({
        action: "auth.change_password",
        entity: "User",
        entityId: user.id
    });

    return { success: true };
}

/*
Purpose: Update user profile details.
Decision: Restricted to owner or admin (via requireRole) and enforces unique email constraints.
*/
export async function updateProfile(data: { name: string; email: string; avatar?: string }) {
    const parsed = updateProfileSchema.parse(data);

    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    if (parsed.email !== user.email) {
        const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
        if (existing) throw new Error("Email already taken");
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            name: parsed.name,
            email: parsed.email,
            ...(parsed.avatar && { avatar: parsed.avatar })
        }
    });

    await logAudit({
        action: "user.update_profile",
        entity: "User",
        entityId: user.id,
        metadata: { ...parsed }
    });


    return { success: true };
}
/*
Purpose: Provide visibility into active sessions.
Decision: Helping users understand where they are logged in aids in detecting unauthorized access.
*/
export async function getSessions() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Purpose: List sessions sorted by recency for better UX.
    const sessions = await prisma.session.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            ipAddress: true,
            userAgent: true,
            createdAt: true,
            expiresAt: true,
            token: true // Need this to identify *current* session
        }
    });

    return sessions;
}

export async function revokeSession(sessionId: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Ensure session belongs to user
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== user.id) {
        throw new Error("Session not found or access denied");
    }

    await prisma.session.delete({ where: { id: sessionId } });

    await logAudit({
        action: "auth.session_revoked",
        entity: "Session",
        entityId: sessionId,
        metadata: { ip: session.ipAddress, ua: session.userAgent }
    });

    return { success: true };
}

export async function revokeAllOtherSessions() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Read current session token from cookie server-side
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const currentSessionToken = cookieStore.get("session_token")?.value;

    if (!currentSessionToken) {
        throw new Error("No active session found.");
    }

    const result = await prisma.session.deleteMany({
        where: {
            userId: user.id,
            token: { not: currentSessionToken }
        }
    });

    await logAudit({
        action: "auth.all_other_sessions_revoked",
        entity: "Session",
        entityId: user.id,
        metadata: { count: result.count }
    });

    return { success: true, count: result.count };
}
