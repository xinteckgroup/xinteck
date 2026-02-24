"use client";

import { InvitationList } from "@/components/admin/team/InvitationList";
import { InviteUserModal } from "@/components/admin/team/InviteUserModal";
import { Button } from "@/components/admin/ui/Button";
import { PageContainer } from "@/components/admin/ui/PageContainer";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { InvitationStatus, Role, UserStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Plus, Shield, User as UserIcon } from "lucide-react";
import { useState } from "react";

type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    lastActiveAt: Date | null;
    avatar: string | null;
};

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
Purpose: Client-side orchestrator for the Team Management view.
Decision: We accept initial data as props (SSR) to ensure SEO and fast initial load, then manage modal state locally for interactivity.
*/
export function TeamManagementClient({ users, invitations }: { users: User[]; invitations: InvitationWithInviter[] }) {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    return (
        <PageContainer>
            <PageHeader 
                title="Team Management" 
                subtitle="Manage access, roles, and invitations."
                actions={
                    <Button onClick={() => setIsInviteModalOpen(true)} icon={<Plus size={16} />}>
                        Invite Member
                    </Button>
                }
            />

            <InviteUserModal 
                open={isInviteModalOpen} 
                onClose={() => setIsInviteModalOpen(false)} 
            />

            <div className="flex flex-col gap-8 mt-8">
                {/* 
                Purpose: Display active team members.
                Decision: Separated from invitations to cleanly distinguish between current access and pending access.
                */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--admin-text)] mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-gold" />
                        Active Members ({users.length})
                    </h3>
                    <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-[var(--admin-text)]">
                                <thead className="bg-[var(--admin-text)]/5 text-[10px] uppercase font-black tracking-widest text-[var(--admin-text)] border-b border-[var(--admin-border)]">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--admin-border)]">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-[var(--admin-text)]/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full admin-surface-input flex items-center justify-center text-[var(--admin-text)] font-bold overflow-hidden border border-[var(--admin-border)]">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserIcon size={14} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-[var(--admin-text)]">{user.name}</div>
                                                        <div className="text-xs text-[var(--admin-text)]">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyles[user.status]}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-[var(--admin-text)]">
                                                {user.lastActiveAt ? formatDistanceToNow(new Date(user.lastActiveAt), { addSuffix: true }) : "Never"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 
                Purpose: Display pending and historical invitations.
                Decision: This section provides audit visibility into who has been invited and the status of those links.
                */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--admin-text)] mb-4 flex items-center gap-2">
                        <MailIcon />
                        Invitations ({invitations.filter(i => i.status === "PENDING").length} Pending)
                    </h3>
                    <InvitationList invitations={invitations} />
                </section>
            </div>
        </PageContainer>
    );
}

function RoleBadge({ role }: { role: Role }) {
    const styles = {
        SUPER_ADMIN: "bg-gold/40 text-gold border-gold/30",
        ADMIN: "bg-[var(--admin-text)]/40 text-[var(--admin-text)] border-[var(--admin-border)]",
        SUPPORT_STAFF: "bg-[var(--admin-text)]/5 text-[var(--admin-muted)] border-[var(--admin-border)]/50",
    };
    return (
        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-black uppercase tracking-wider border ${styles[role]}`}>
            {role.replace("_", " ")}
        </span>
    );
}

const statusStyles = {
    ACTIVE: "bg-green-500/40 text-green-400 border-green-500/20",
    SUSPENDED: "bg-red-500/40 text-red-400 border-red-500/20",
    AWAY: "bg-orange-500/40 text-orange-400 border-orange-500/20",
    DELETED: "bg-[var(--admin-text)]/40 text-[var(--admin-muted)] border-[var(--admin-border)]",
};

function MailIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    );
}
