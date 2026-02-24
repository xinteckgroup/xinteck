"use client";

import { changePassword } from "@/actions/auth";
import { disable2FA, generate2FASecret, verifyAndEnable2FA } from "@/actions/auth-2fa";
import { get2FAStatus } from "@/actions/auth-2fa-status";
import { useRole } from "@/components/admin/RoleContext";
import { Button, Modal } from "@/components/admin/ui";
import { PasswordInput } from "@/components/admin/ui/PasswordInput";
import { AlertCircle, CheckCircle2, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function SecurityPage() {
    const { userRole } = useRole();
    const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
    const [passLoading, setPassLoading] = useState(false);
    const [passMsg, setPassMsg] = useState("");

    // 2FA State
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [tempSecret, setTempSecret] = useState("");
    const [totpCode, setTotpCode] = useState("");
    const [tfaLoading, setTfaLoading] = useState(false);
    const [tfaError, setTfaError] = useState("");
    const [tfaSuccess, setTfaSuccess] = useState("");
    
    // Disable 2FA Modal State
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [disablePassword, setDisablePassword] = useState("");

    useEffect(() => {
        get2FAStatus().then(res => {
            if (res.success && res.enabled !== undefined) {
                setIs2FAEnabled(res.enabled);
            }
        });
    }, []);

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

    const handleStart2FASetup = async () => {
        setTfaLoading(true);
        setTfaError("");
        try {
            const res = await generate2FASecret();
            if (res.success && res.otpauthUrl && res.secret) {
                setQrCodeUrl(res.otpauthUrl);
                setTempSecret(res.secret);
                setIsSettingUp2FA(true);
            } else {
                setTfaError("Failed to generate 2FA secret.");
            }
        } catch (e: any) {
            setTfaError(e.message || "An error occurred.");
        } finally {
            setTfaLoading(false);
        }
    };

    const handleVerifyAndEnable2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setTfaLoading(true);
        setTfaError("");
        
        try {
            const res = await verifyAndEnable2FA(totpCode, tempSecret);
            if (res.success) {
                setTfaSuccess("Two-Factor Authentication successfully enabled.");
                setIs2FAEnabled(true);
                setIsSettingUp2FA(false);
                setTotpCode("");
            } else {
                setTfaError(res.message || "Invalid code. Please try again.");
            }
        } catch (e: any) {
             setTfaError(e.message || "An error occurred during verification.");
        } finally {
             setTfaLoading(false);
        }
    };

    const handleDisable2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setTfaLoading(true);
        setTfaError("");

        try {
             const res = await disable2FA(disablePassword);
             if (res.success) {
                 setIs2FAEnabled(false);
                 setShowDisableModal(false);
                 setDisablePassword("");
                 setTfaSuccess("Two-Factor Authentication has been disabled.");
             } else {
                 setTfaError(res.message || "Failed to disable 2FA. Please check your password.");
             }
        } catch (e: any) {
             setTfaError(e.message || "An error occurred while disabling 2FA.");
        } finally {
             setTfaLoading(false);
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

                {/* MFA / 2FA Section */}
                <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 space-y-6 relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--admin-text)]">Two-Factor Authentication</h3>
                            <p className="text-xs text-[var(--admin-text)]/80">Add an extra layer of security to your account.</p>
                        </div>
                        {is2FAEnabled && (
                            <div className="ml-auto bg-green-500/20 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                <CheckCircle2 size={14} /> Enabled
                            </div>
                        )}
                    </div>

                    {tfaSuccess && !isSettingUp2FA && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-[8px] p-4 flex items-center gap-3 text-green-400 text-sm">
                            <CheckCircle2 size={18} />
                            {tfaSuccess}
                        </div>
                    )}

                    {!is2FAEnabled && !isSettingUp2FA && (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <Smartphone size={48} className="text-[var(--admin-text)]/50" />
                            <div className="space-y-2 max-w-md">
                                <p className="text-sm font-medium text-[var(--admin-text)]">Two-factor authentication is currently disabled.</p>
                                <p className="text-xs text-[var(--admin-text)]/70">Protect your account from unauthorized access by requiring a second authentication method in addition to your password.</p>
                            </div>
                            <Button 
                                onClick={handleStart2FASetup}
                                disabled={tfaLoading}
                                variant="primary"
                                className="w-full max-w-xs mt-4"
                            >
                                {tfaLoading ? "Loading..." : "Setup 2FA"}
                            </Button>
                        </div>
                    )}

                    {!is2FAEnabled && isSettingUp2FA && (
                         <div className="space-y-6">
                            <div className="bg-[var(--admin-accent)]/10 border border-[var(--admin-border)] rounded-[12px] p-6 text-center space-y-4">
                                <h4 className="font-bold text-sm text-[var(--admin-text)]">1. Scan the QR Code</h4>
                                <p className="text-xs text-[var(--admin-text)]/70">Use an authenticator app like Google Authenticator or Authy to scan this QR code.</p>
                                <div className="bg-white p-4 rounded-xl inline-block">
                                    <QRCodeSVG value={qrCodeUrl} size={180} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-[var(--admin-text)]/50">Manual Setup Key:</p>
                                    <code className="bg-black/30 px-3 py-2 rounded-lg text-xs font-mono tracking-widest text-gold selection:bg-gold/30">
                                        {tempSecret}
                                    </code>
                                </div>
                            </div>
                            
                            <form onSubmit={handleVerifyAndEnable2FA} className="space-y-4 max-w-sm mx-auto">
                                <div className="text-center space-y-2">
                                    <h4 className="font-bold text-sm text-[var(--admin-text)]">2. Verify Token</h4>
                                    <p className="text-xs text-[var(--admin-text)]/70">Enter the 6-digit code generated by your app.</p>
                                </div>
                                
                                {tfaError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-[8px] p-3 flex items-center gap-2 text-red-400 text-xs">
                                        <AlertCircle size={14} />
                                        {tfaError}
                                    </div>
                                )}

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text)]/50" size={16} />
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={totpCode}
                                        onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="000000"
                                        className="w-full bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[8px] pl-10 pr-4 py-3 text-[var(--admin-text)] focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-center tracking-widest font-mono text-lg"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        className="w-1/3"
                                        onClick={() => { setIsSettingUp2FA(false); setTfaError(""); setTotpCode(""); }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        disabled={tfaLoading || totpCode.length !== 6}
                                        variant="primary"
                                        className="w-2/3"
                                    >
                                        {tfaLoading ? "Verifying..." : "Verify & Enable"}
                                    </Button>
                                </div>
                            </form>
                         </div>
                    )}

                    {is2FAEnabled && (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                            <ShieldCheck size={48} className="text-green-500/80" />
                            <div className="space-y-2 max-w-md">
                                <p className="text-sm font-medium text-[var(--admin-text)]">Two-factor authentication is active.</p>
                                <p className="text-xs text-[var(--admin-text)]/70">Your account is secured with 2FA. You will be prompted for a token every time you log in.</p>
                            </div>
                            <Button 
                                onClick={() => setShowDisableModal(true)}
                                variant="destructive"
                                className="w-full max-w-xs mt-4"
                            >
                                Disable 2FA
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Disable 2FA Modal */}
            <Modal
                open={showDisableModal}
                onClose={() => { setShowDisableModal(false); setTfaError(""); setDisablePassword(""); }}
                title="Disable Two-Factor Authentication"
                subtitle="Please enter your password to confirm disabling 2FA."
            >
                <form onSubmit={handleDisable2FA} className="space-y-4 pt-4">
                    {tfaError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-[8px] p-3 flex items-center gap-2 text-red-400 text-xs text-left">
                            <AlertCircle size={14} />
                            {tfaError}
                        </div>
                    )}
                    <div>
                        <PasswordInput 
                            value={disablePassword}
                            onChange={(e) => setDisablePassword(e.target.value)}
                            className="bg-[var(--admin-surface)] border border-[var(--admin-border)]"
                            placeholder="Enter your current password"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => { setShowDisableModal(false); setTfaError(""); setDisablePassword(""); }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="destructive"
                            disabled={tfaLoading || !disablePassword}
                        >
                            {tfaLoading ? "Disabling..." : "Confirm Disable"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
