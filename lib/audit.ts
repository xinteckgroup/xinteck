import { prisma } from "@/lib/prisma";

export type AuditAction =
    | "user.login"
    | "user.logout"
    | "contact.submission"
    | "contact.archive"
    | "contact.delete"
    | "contact.mark_read"
    | "contact.mark_unread"
    | "contact.star"
    | "contact.unstar"
    | "contact.reply"
    | "contact.assign"
    | "newsletter.subscribe"
    | "newsletter.unsubscribe"
    | "newsletter.delete"
    | "post.create"
    | "post.update"
    | "post.delete"
    | "project.create"
    | "project.update"
    | "project.delete"
    | "setting.update"
    | "setting.delete"
    | "user.invite"
    | "user.update"
    | "user.delete"
    | "media.upload"
    | "media.delete"
    | "media.folder_create"
    | "media.folder_delete"
    | "service.create"
    | "service.update"
    | "service.delete"
    | "service.status_change"
    | "user.register"
    | "user.update_profile"
    | "auth.forgot_password_request"
    | "auth.reset_password"
    | "auth.change_password"
    | "auth.session_revoked"
    | "auth.all_other_sessions_revoked"
    | "user.update_notification_prefs"
    | "user.bulk_delete"
    | "service.restore"
    | "newsletter.restore"
    | "contact.restore"
    | "service.reorder"
    | "secret_update"
    | "team.invite_user"
    | "team.revoke_invitation"
    | "team.resend_invitation"
    | "user.register_accepted"
    | "careers.create"
    | "careers.update"
    | "careers.delete"
    | "careers.status_change"
    | "user.enabled_2fa"
    | "user.disabled_2fa"
    | "user.login_2fa"
    | "lead.note.create"
    | "lead.note.delete"
    | "newsletter.campaign.create"
    | "newsletter.campaign.update"
    | "newsletter.campaign.delete"
    | "newsletter.campaign.send"
    | "newsletter.unsubscribe.self";

interface AuditLogParams {
    action: AuditAction;
    entity: string;
    entityId?: string;
    userId?: string;
    metadata?: Record<string, any>;
}

/*
Purpose: Centralized audit logging mechanism to track critical system actions for security and compliance.
Decision: We use a fire-and-forget approach (silent failure) to prevent non-critical logging errors from blocking main user flows (e.g., login should work even if logger is down).
*/
export async function logAudit({ action, entity, entityId, userId, metadata }: AuditLogParams) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                userId,
                metadata,
            },
        });
    } catch (error) {
        // Purpose: Fail silently to ensure the primary business logic is never interrupted by logging failures.
        console.error("Audit Log Failure:", error);
    }
}
