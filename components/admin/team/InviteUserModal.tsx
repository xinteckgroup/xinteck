"use client";

import { inviteUser } from "@/actions/team";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Modal } from "@/components/admin/ui/Modal";
import { Select } from "@/components/admin/ui/Select";
import { useToast } from "@/components/admin/ui/Toast";
import { Role } from "@prisma/client";
import { Mail, UserCog } from "lucide-react";
import { useState, useTransition } from "react";
import { z } from "zod";

const inviteSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.nativeEnum(Role)
});

/*
Purpose: specific modal for sending new team invitations.
Decision: We separate this form to keep the main TeamPage clean and focused on display.
*/
export function InviteUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<Role>(Role.SUPPORT_STAFF);
    const [isPending, startTransition] = useTransition();
    const { success, error } = useToast();
    const [errors, setErrors] = useState<{ email?: string; role?: string }>({});

    const handleSubmit = () => {
        // Purpose: Validate form data against Zod schema before attempting server action.
        const validation = inviteSchema.safeParse({ email, role });
        if (!validation.success) {
            const errs: Record<string, string> = {};
            validation.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    errs[issue.path[0].toString()] = issue.message;
                }
            });
            setErrors(errs);
            return;
        }

        setErrors({});
        startTransition(async () => {
            try {
                const result = await inviteUser({ email, role });
                if (result.success) {
                    success(result.message || "Invitation sent successfully");
                    onClose();
                    setEmail("");
                    setRole(Role.SUPPORT_STAFF);
                } else {
                    error(result.message || "Failed to send invitation");
                }
            } catch (e) {
                error("An unexpected error occurred");
            }
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Invite Team Member"
            subtitle="Send an invitation link via email."
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} loading={isPending}>
                        Send Invitation
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <Input
                    label="Email Address"
                    placeholder="colleague@xinteck.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={16} />}
                    error={errors.email}
                />
                <Select
                    label="Role"
                    options={[
                        { value: Role.SUPPORT_STAFF, label: "Support Staff" },
                        { value: Role.ADMIN, label: "Admin" },
                        { value: Role.SUPER_ADMIN, label: "Super Admin" },
                    ]}
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    error={errors.role}
                />
                
                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-[10px] text-xs text-blue-400 flex gap-2 items-start mt-2">
                    <UserCog size={14} className="mt-0.5 shrink-0" />
                    <p className="font-medium">
                        The user will receive an email with a secure link to create their account. 
                        The link expires in 7 days.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
