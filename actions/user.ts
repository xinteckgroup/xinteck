"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { StaffInviteEmail } from "@/components/emails/StaffInviteEmail";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification-service";
import { inviteStaffSchema, uuidSchema } from "@/lib/validations";
import { NotificationPriority, NotificationType, Role, UserStatus } from "@prisma/client";
import { render } from "@react-email/render";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export async function getUsers() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const users = await prisma.user.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
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

    return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: mapRoleToLabel(u.role),
        status: mapStatusToLabel(u.status),
        lastActive: u.lastActiveAt ? formatLastActive(u.lastActiveAt) : "Never",
        avatar: u.avatar || u.name.charAt(0)
    }));
}

export async function inviteUser(data: { name: string; email: string; role: string }) {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);
    const parsed = inviteStaffSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    let newUser;

    const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });

    // Set a predictable default password as advertised in the UI
    const tempPassword = "xinteck123";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    if (existingUser) {
        if (existingUser.deletedAt !== null) {
            // Revive soft-deleted ghost user
            newUser = await prisma.user.update({
                where: { email: parsed.data.email },
                data: {
                    name: parsed.data.name,
                    passwordHash: hashedPassword,
                    role: mapLabelToRole(parsed.data.role),
                    status: UserStatus.ACTIVE,
                    deletedAt: null // Resurrection!
                }
            });
        } else {
            return { error: "User with this email already exists" };
        }
    } else {
        // Create brand new
        newUser = await prisma.user.create({
            data: {
                name: parsed.data.name,
                email: parsed.data.email,
                passwordHash: hashedPassword,
                role: mapLabelToRole(parsed.data.role),
                status: UserStatus.ACTIVE,
            }
        });
    }

    let warningMessage: string | undefined;

    // Send invite email via Resend
    try {
        const apiKey = await INTERNAL_getSecret("RESEND_API_KEY");
        const fromEmail = await INTERNAL_getSecret("RESEND_FROM_EMAIL");

        if (apiKey && fromEmail) {
            const resend = new Resend(apiKey);
            const htmlContent = await render(
                StaffInviteEmail({
                    name: parsed.data.name,
                    email: parsed.data.email,
                    role: parsed.data.role,
                    tempPassword
                }) as React.ReactElement
            );

            await resend.emails.send({
                from: fromEmail,
                to: [parsed.data.email],
                subject: "You've been invited to Xinteck Admin",
                html: htmlContent
            });
        } else {
            warningMessage = "User created, but email failed: Missing Resend configuration in Settings.";
        }
    } catch (e: any) {
        console.error("Failed to send invite email:", e);
        warningMessage = `User created, but email failed: ${e.message}`;
    }

    await logAudit({
        action: "user.invite",
        entity: "User",
        entityId: newUser.id,
        userId: currentUser.id,
        metadata: { email: newUser.email, role: parsed.data.role }
    });

    // Notification
    try {
        await NotificationService.broadcastToRoles({
            roles: [Role.SUPER_ADMIN],
            title: "Staff Invited",
            message: `${currentUser.name} invited ${parsed.data.name} as ${parsed.data.role}.`,
            type: NotificationType.INFO,

            priority: NotificationPriority.NORMAL,
            link: "/admin/staff",
            metadata: { invitedBy: currentUser.name, newUserId: newUser.id }
        });
    } catch (e) {
        console.error("Notification failed", e);
    }

    revalidatePath("/admin/staff", "page");
    return warningMessage ? { success: true, warning: warningMessage } : { success: true };
}

export async function updateUserRole(id: string, newRoleLabel: string) {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    if (validatedId === currentUser.id) {
        throw new Error("Cannot change your own role");
    }

    const user = await prisma.user.update({
        where: { id: validatedId },
        data: { role: mapLabelToRole(newRoleLabel) }
    });

    await logAudit({
        action: "user.update",
        entity: "User",
        entityId: user.id,
        userId: currentUser.id,
        metadata: { newRole: newRoleLabel }
    });

    // Notification
    try {
        // Notify the user themselves
        await NotificationService.create({
            userId: user.id,
            title: "Role Updated",
            message: `Your role has been updated to ${newRoleLabel}.`,
            type: NotificationType.INFO,
            priority: NotificationPriority.HIGH,
            link: "/admin/profile"
        });
    } catch (e) { console.error(e); }

    revalidatePath("/admin/staff", "page");
    return { success: true };
}

export async function deleteUser(id: string) {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    if (validatedId === currentUser.id) {
        throw new Error("Cannot delete yourself");
    }

    const targetUser = await prisma.user.findUnique({ where: { id: validatedId } });
    if (!targetUser) throw new Error("User not found");
    // CRITICAL SECURITY CONSTRAINT: Protect SUPER_ADMIN
    if (targetUser.role === Role.SUPER_ADMIN) {
        throw new Error("Action Forbidden: SUPER_ADMIN accounts cannot be deleted. You must demote them to another role first.");
    }

    // Soft delete
    const user = await prisma.user.update({
        where: { id: validatedId },
        data: {
            deletedAt: new Date(),
            status: UserStatus.DELETED
        }
    });

    await logAudit({
        action: "user.delete",
        entity: "User",
        entityId: user.id,
        userId: currentUser.id
    });

    revalidatePath("/admin/staff");
    return { success: true };
}

export async function deleteUsers(ids: string[]) {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);
    // Validate all IDs
    const validatedIds = ids.map(id => uuidSchema.parse(id));

    if (validatedIds.includes(currentUser.id)) {
        throw new Error("Cannot delete yourself");
    }

    // CRITICAL SECURITY CONSTRAINT: Protect ALL SUPER_ADMINs
    const targetUsers = await prisma.user.findMany({ where: { id: { in: validatedIds } } });
    const containsSuperAdmin = targetUsers.some(user => user.role === Role.SUPER_ADMIN);
    if (containsSuperAdmin) {
        throw new Error("Action Forbidden: Bulk deletion aborted because one or more selected users are SUPER_ADMINs. Please unselect them to proceed.");
    }

    // Soft delete
    await prisma.user.updateMany({
        where: { id: { in: validatedIds } },
        data: {
            deletedAt: new Date(),
            status: UserStatus.DELETED
        }
    });

    // Log for one (or generic bulk log)
    await logAudit({
        action: "user.bulk_delete",
        entity: "User",
        entityId: "bulk",
        userId: currentUser.id,
        metadata: { count: ids.length, ids }
    });

    revalidatePath("/admin/staff", "page");
    return { success: true };
}

export async function suspendUser(id: string) {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    if (validatedId === currentUser.id) {
        throw new Error("Cannot suspend yourself");
    }

    const user = await prisma.user.update({
        where: { id: validatedId },
        data: { status: UserStatus.SUSPENDED }
    });

    // Invalidate all sessions for suspended user
    await prisma.session.deleteMany({ where: { userId: validatedId } });

    await logAudit({
        action: "user.update",
        entity: "User",
        entityId: user.id,
        userId: currentUser.id,
        metadata: { action: "suspend" }
    });

    // Notification to Super Admins
    try {
        const { NotificationService } = await import("@/lib/services/notification-service");
        const { Role, NotificationType, NotificationPriority } = await import("@prisma/client");

        await NotificationService.broadcastToRoles({
            roles: [Role.SUPER_ADMIN],
            title: "User Suspended",
            message: `${user.name} was suspended by ${currentUser.name}.`,
            type: NotificationType.WARNING,
            priority: NotificationPriority.HIGH,
            link: "/admin/staff",
            metadata: { suspendedUserId: user.id, suspendedBy: currentUser.id }
        });
    } catch (e) { console.error(e); }

    revalidatePath("/admin/staff", "page");
    return { success: true };
}

export async function reactivateUser(id: string) {
    const currentUser = await requireRole([Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    const user = await prisma.user.update({
        where: { id: validatedId },
        data: { status: UserStatus.ACTIVE }
    });

    await logAudit({
        action: "user.update",
        entity: "User",
        entityId: user.id,
        userId: currentUser.id,
        metadata: { action: "reactivate" }
    });

    revalidatePath("/admin/staff", "page");
    return { success: true };
}


// Helpers
// Helpers
function mapRoleToLabel(role: Role) {
    if (role === Role.SUPER_ADMIN) return "Super Admin";
    if (role === Role.ADMIN) return "Admin";
    if (role === Role.SUPPORT_STAFF) return "Support Staff";
    return "Support Staff";
}

function mapLabelToRole(label: string): Role {
    if (label === "Super Admin") return Role.SUPER_ADMIN;
    if (label === "Admin") return Role.ADMIN;
    if (label === "Support Staff") return Role.SUPPORT_STAFF;
    return Role.SUPPORT_STAFF;
}

function mapStatusToLabel(status: UserStatus) {
    if (status === UserStatus.ACTIVE) return "Active";
    if (status === UserStatus.AWAY) return "Away";
    if (status === UserStatus.SUSPENDED) return "Suspended";
    return "Inactive";
}

function formatLastActive(date: Date) {
    // Simple relative time
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}
