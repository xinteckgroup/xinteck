import { resendInvitation, revokeInvitation } from "@/actions/team";
import { Button } from "@/components/admin/ui/Button";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { useToast } from "@/components/admin/ui/Toast";
import { InvitationStatus, Role } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Ban, RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";

type InvitationWithInviter = {
    id: string;
    email: string;
    role: Role;
    status: InvitationStatus;
    createdAt: Date;
    expiresAt: Date;
    token: string;
    invitedBy: {
        name: string;
        email: string;
    };
};

/*
Purpose: Render the list of invitations with management actions.
Decision: We handle the 'empty state' explicitly here to provide better UX than an empty table.
*/
export function InvitationList({ invitations }: { invitations: InvitationWithInviter[] }) {
    if (invitations.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed border-[var(--admin-border)] rounded-[10px] admin-surface-primary">
                <p className="text-[var(--admin-muted)] text-sm italic">No pending or past invitations found.</p>
            </div>
        );
    }

    return (
        <div className="border border-[var(--admin-border)] rounded-[10px] overflow-hidden admin-surface-primary shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[var(--admin-text)]/80">
                    <thead className="bg-[var(--admin-text)]/5 text-[10px] uppercase font-black tracking-widest text-[var(--admin-text)]/60 border-b border-[var(--admin-border)]">
                        <tr>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Sent</th>
                            <th className="px-4 py-3">Expires</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--admin-border)]">
                        {invitations.map((invite) => (
                            <InvitationRow key={invite.id} invite={invite} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function InvitationRow({ invite }: { invite: InvitationWithInviter }) {
    // Purpose: useTransition allows for non-blocking UI updates while Server Actions execute.
    const [isPending, startTransition] = useTransition();
    const { success, error } = useToast();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const isExpired = new Date(invite.expiresAt) < new Date() && invite.status === "PENDING";
    const status = isExpired ? "EXPIRED" : invite.status;

    // Purpose: Confirm before revoking to prevent accidental access removal.
    const handleRevoke = () => {
        setIsConfirmOpen(false);
        startTransition(async () => {
            const res = await revokeInvitation(invite.id);
            if (res.success) success("Invitation revoked");
            else error("Failed to revoke");
        });
    };

    // Purpose: Resend logic triggers a token regeneration on the server.
    const handleResend = () => {
        startTransition(async () => {
            const res = await resendInvitation(invite.id);
            if (res.success) success(res.message || "Invitation resent");
            else error(res.message || "Failed to resend");
        });
    };

    return (
            <tr className="hover:bg-[var(--admin-text)]/5 transition-colors">
            <td className="px-4 py-3 font-medium text-[var(--admin-text)]">{invite.email}</td>
            <td className="px-4 py-3">
                <span className="bg-[var(--admin-text)]/10 px-2 py-0.5 rounded text-xs text-[var(--admin-text)]/80">{invite.role}</span>
            </td>
            <td className="px-4 py-3">
                <StatusBadge status={status} />
            </td>
            <td className="px-4 py-3 text-xs text-[var(--admin-muted)]">
                {formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true })}
                <div className="text-[10px] opacity-70">by {invite.invitedBy.name}</div>
            </td>
            <td className="px-4 py-3 text-xs">
                {status === "PENDING" && formatDistanceToNow(new Date(invite.expiresAt), { addSuffix: true })}
                {status !== "PENDING" && "-"}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                    {(status === "PENDING" || status === "EXPIRED" || status === "REVOKED") && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleResend} 
                            disabled={isPending}
                            title="Resend Invitation"
                            className="bg-transparent hover:bg-[var(--admin-text)]/10 text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                        >
                            <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
                        </Button>
                    )}
                    {status === "PENDING" && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={isPending}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Revoke Invitation"
                        >
                            <Ban size={14} />
                        </Button>
                    )}
                    {status === "ACCEPTED" && (
                        <span className="text-xs text-green-400 flex items-center gap-1 justify-end">
                             Active
                        </span>
                    )}
                </div>
            </td>

            {isConfirmOpen && (
                 <ConfirmModal
                 isOpen={isConfirmOpen}
                 onClose={() => setIsConfirmOpen(false)}
                 onConfirm={handleRevoke}
                 title="Revoke Invitation"
                 description="Are you sure you want to revoke this invitation? The link will immediately expire."
                 confirmText="Revoke"
                 isDestructive={true}
                 />
            )}
        </tr>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        ACCEPTED: "bg-green-500/10 text-green-400 border-green-500/20",
        EXPIRED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        REVOKED: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-black uppercase tracking-wider border ${styles[status] || "bg-[var(--admin-text)]/10 text-[var(--admin-muted)] border-[var(--admin-border)]"}`}>
            {status}
        </span>
    );
}
