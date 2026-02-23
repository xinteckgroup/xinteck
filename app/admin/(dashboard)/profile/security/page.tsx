"use client";

import { changePassword } from "@/actions/auth";
import { useRole } from "@/components/admin/RoleContext";
import { Button } from "@/components/admin/ui";
import { PasswordInput } from "@/components/admin/ui/PasswordInput";
import { Lock, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";

export default function SecurityPage() {
    const { userRole } = useRole();
    const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
    const [passLoading, setPassLoading] = useState(false);
    const [passMsg, setPassMsg] = useState("");

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassMsg("");
        
        if (passData.new !== passData.confirm) {
            setPassMsg("Error: New passwords do not match.");
            return;
        }

        setPassLoading(true);
        try {
            const res = await changePassword(passData.old, passData.new);
            if (!res.success) throw new Error(res.message);
            setPassMsg("Success: Password updated successfully.");
            setPassData({ old: "", new: "", confirm: "" });
        } catch (e: any) {
            setPassMsg(`Error: ${e.message}`);
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                {/* Password Change Section */}
                <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 space-y-6 w-full">
                    <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--admin-text)]">Change Password</h3>
                            <p className="text-xs text-[var(--admin-text)]/80">Ensure your account uses a strong password.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {passMsg && (
                            <div className={`p-3 rounded-[8px] text-sm ${passMsg.startsWith("Success") ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"}`}>
                                {passMsg.replace(/^(Success|Error): /, "")}
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold text-[var(--admin-text)]/80 uppercase tracking-wider">Current Password</label>
                            <PasswordInput 
                                value={passData.old}
                                onChange={e => setPassData({...passData, old: e.target.value})}
                                className="admin-surface-input px-2 mt-1 text-[var(--admin-text)]"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--admin-text)]/80 uppercase tracking-wider">New Password</label>
                            <PasswordInput 
                                value={passData.new}
                                onChange={e => setPassData({...passData, new: e.target.value})}
                                className="admin-surface-input px-2 mt-1 text-[var(--admin-text)]"
                                required
                            />
                        </div>
                         <div>
                            <label className="text-xs font-bold text-[var(--admin-text)]/80 uppercase tracking-wider">Confirm New Password</label>
                            <PasswordInput 
                                value={passData.confirm}
                                onChange={e => setPassData({...passData, confirm: e.target.value})}
                                className="admin-surface-input px-2 mt-1 text-[var(--admin-text)]"
                                required
                            />
                        </div>

                        <Button 
                            type="submit"
                            disabled={passLoading}
                            variant="primary"
                            className="w-full"
                        >
                            {passLoading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </div>

                {/* MFA / 2FA Placeholder */}
                <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 space-y-6 relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--admin-text)]">Two-Factor Authentication</h3>
                            <p className="text-xs text-[var(--admin-text)]/80">Add an extra layer of security.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <Smartphone size={48} className="text-[var(--admin-text)]/50" />
                        <p className="text-lg font-medium text-white">Two-factor authentication is currently disabled by system policy.</p>
                        {userRole === "SUPER_ADMIN" && (
                            <p className="text-sm text-white">As a Super Admin, you can configure this in System Settings.</p>
                        )}
                    </div>
                     <Button 
                        disabled
                        variant="secondary"
                        className="w-full opacity-50 cursor-not-allowed"
                    >
                        Enable 2FA
                    </Button>
                </div>
            </div>
        </div>
    );
}
