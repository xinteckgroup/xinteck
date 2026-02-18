"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { InvitationStatus, Role } from "@prisma/client";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";

const inviteSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.nativeEnum(Role)
});

/*
Purpose: Initiate a new user invitation flow.
Decision: We check for existing users and pending invites to prevent duplicates and spam.
*/
export async function inviteUser(data: { email: string; role: Role }) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const parsed = inviteSchema.parse(data);

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existingUser) {
        return { success: false, message: "User with this email already exists." };
    }

    // Check pending invite
    const pendingInvite = await prisma.invitation.findFirst({
        where: {
            email: parsed.email,
            status: InvitationStatus.PENDING,
            expiresAt: { gt: new Date() }
        }
    });

    if (pendingInvite) {
        return { success: false, message: "A pending invitation already exists for this email." };
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days

    const invitation = await prisma.invitation.create({
        data: {
            email: parsed.email,
            role: parsed.role,
            token,
            expiresAt,
            status: InvitationStatus.PENDING,
            invitedById: admin.id
        }
    });

    // Send Email
    await sendInvitationEmail(parsed.email, token);

    await logAudit({
        action: "team.invite_user",
        entity: "Invitation",
        entityId: invitation.id,
        userId: admin.id,
        metadata: { email: parsed.email, role: parsed.role }
    });

    revalidatePath("/admin/settings/team");
    return { success: true, message: "Invitation sent successfully." };
}

/*
Purpose: Invalidate a pending invitation.
Decision: We mark it as REVOKED rather than deleting it to maintain an audit trail of administrative actions.
*/
export async function revokeInvitation(id: string) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const invitation = await prisma.invitation.update({
        where: { id },
        data: { status: InvitationStatus.REVOKED }
    });

    await logAudit({
        action: "team.revoke_invitation",
        entity: "Invitation",
        entityId: invitation.id,
        userId: admin.id,
        metadata: { email: invitation.email }
    });

    revalidatePath("/admin/settings/team");
    return { success: true };
}

/*
Purpose: Re-issue an invitation if the previous one expired or was lost.
Decision: We regenerate the token to invalidate the old link immediately, ensuring only the newest link is valid.
*/
export async function resendInvitation(id: string) {
    const admin = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const oldInvite = await prisma.invitation.findUnique({ where: { id } });
    if (!oldInvite) return { success: false, message: "Invitation not found" };

    if (oldInvite.status === InvitationStatus.ACCEPTED) {
        return { success: false, message: "Cannot resend accepted invitation" };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Reset expiry

    const invitation = await prisma.invitation.update({
        where: { id },
        data: {
            token,
            expiresAt,
            status: InvitationStatus.PENDING
        }
    });

    await sendInvitationEmail(invitation.email, token);

    await logAudit({
        action: "team.resend_invitation",
        entity: "Invitation",
        entityId: invitation.id,
        userId: admin.id,
        metadata: { email: invitation.email }
    });

    revalidatePath("/admin/settings/team");
    return { success: true, message: "Invitation resent." };
}

/*
Purpose: Fetch all system users for admin management.
Decision: Restricted to Admins to protect user privacy.
*/
export async function getUsers() {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            lastActiveAt: true,
            avatar: true
        }
    });
}

/*
Purpose: Fetch all invitations for tracking.
Decision: Includes the 'invitedBy' relation to show audit context in the UI.
*/
export async function getInvitations() {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    return prisma.invitation.findMany({
        orderBy: { createdAt: "desc" },
        include: { invitedBy: { select: { name: true, email: true } } }
    });
}

// Purpose: Helper to abstract email delivery logic and ensure consistent formatting.
async function sendInvitationEmail(email: string, token: string) {
    const resendApiKey = await INTERNAL_getSecret("RESEND_API_KEY");
    const fromEmail = await INTERNAL_getSecret("RESEND_FROM_EMAIL");

    if (!resendApiKey) {
        console.warn("Resend API Key missing. Invitation created but email not sent. Check System Settings.");
        if (process.env.NODE_ENV === "production") throw new Error("Email service not configured");
        return;
    }

    const resend = new Resend(resendApiKey);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/admin/register?token=${token}`;

    try {
        await resend.emails.send({
            from: fromEmail || "onboarding@resend.dev",
            to: email,
            subject: "You've been invited to Xinteck",
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>You've been invited!</h1>
                    <p>You have been invited to join the Xinteck Admin Dashboard.</p>
                    <p>Click the link below to create your account:</p>
                    <a href="${inviteLink}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
                    <p>This link expires in 7 days.</p>
                </div>
            `
        });
    } catch (e) {
        console.error("Failed to send invitation email", e);
        throw new Error("Failed to send email.");
    }
}
