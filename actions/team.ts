"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { TeamInviteEmail } from "@/components/emails/TeamInviteEmail";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { InvitationStatus, Role } from "@prisma/client";
import { render } from "@react-email/render";
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
        if (existingUser.deletedAt !== null) {
            // User is soft-deleted. We allow re-invitation to resurrect the account.
        } else {
            return { success: false, message: "User with this email already exists." };
        }
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

    // Role Capacity Enforcement (1-4-5)
    if (parsed.role === Role.SUPER_ADMIN) {
        return { success: false, message: "Only 1 SUPER_ADMIN is allowed in the system." };
    }

    const { activeCount, pendingCount } = await getRoleCapacity(parsed.role);

    if (parsed.role === Role.ADMIN && (activeCount + pendingCount) >= 4) {
        return { success: false, message: "Capacity Reached: Maximum of 4 ADMIN accounts allowed." };
    }

    if (parsed.role === Role.SUPPORT_STAFF && (activeCount + pendingCount) >= 5) {
        return { success: false, message: "Capacity Reached: Maximum of 5 SUPPORT_STAFF accounts allowed." };
    }

    // Verify email config BEFORE creating the DB record
    const resendApiKey = await INTERNAL_getSecret("RESEND_API_KEY");
    if (!resendApiKey) {
        return { success: false, message: "Email Service is not configured. Ask a Super Admin to set the Resend API Key in Settings." };
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days

    // Create Invitation
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
    try {
        await sendInvitationEmail(parsed.email, token, parsed.role, admin.role);
    } catch (e: any) {
        // If the email fails to deliver, rollback the invitation to prevent an orphaned pending state
        await prisma.invitation.delete({ where: { id: invitation.id } });
        console.error("Email Delivery Failed:", e.message);
        return { success: false, message: "Failed to deliver the invitation email. Please check your Resend configuration and sender domain." };
    }

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

    try {
        await sendInvitationEmail(invitation.email, token, invitation.role, admin.role);
    } catch (e: any) {
        // Rollback update status
        await prisma.invitation.update({
            where: { id },
            data: {
                token: oldInvite.token, // restore
                expiresAt: oldInvite.expiresAt,
                status: oldInvite.status
            }
        });
        return { success: false, message: "Failed to dispatch email. Please check the Resend API configuration." };
    }

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
async function sendInvitationEmail(email: string, token: string, role: string, invitedBy: string) {
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
        const htmlContent = await render(TeamInviteEmail({ inviteLink, role, invitedBy }) as React.ReactElement);

        await resend.emails.send({
            from: fromEmail || "onboarding@resend.dev",
            to: email,
            subject: "You've been invited to Xinteck",
            html: htmlContent
        });
    } catch (e) {
        console.error("Failed to send invitation email", e);
        throw new Error("Failed to send email.");
    }
}

// Purpose: Helper to check DB capacity for limits
async function getRoleCapacity(role: Role) {
    const [activeCount, pendingCount] = await Promise.all([
        prisma.user.count({
            where: {
                role,
                status: { in: ["ACTIVE", "AWAY"] },
                deletedAt: null
            }
        }),
        prisma.invitation.count({
            where: {
                role,
                status: "PENDING",
                expiresAt: { gt: new Date() }
            }
        })
    ]);
    return { activeCount, pendingCount };
}
