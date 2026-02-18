"use client";

import { updateProfile } from "@/actions/auth";
import { AvatarPicker } from "@/components/admin/AvatarPicker";
import { useRole } from "@/components/admin/RoleContext";
import { Button } from "@/components/admin/ui";
import { Save, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { userName, userId, setUserAvatar, setUserName } = useRole();

    // Profile form state
    const [profileData, setProfileData] = useState<{ name: string, email: string, avatar?: string }>({ name: "", email: "" });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState("");

    // Fetch current user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data.user) {
                    setProfileData({ 
                        name: data.user.name || "", 
                        email: data.user.email || "",
                        avatar: data.user.avatar || ""
                    });
                }
            } catch {
                // Silently fail — user can still type
            }
        };
        fetchUser();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMsg("");
        setProfileLoading(true);
        try {
            await updateProfile(profileData);
            setUserName(profileData.name);
            if (profileData.avatar) setUserAvatar(profileData.avatar);
            setProfileMsg("Success: Profile updated successfully.");
        } catch (e: any) {
            setProfileMsg(`Error: ${e.message}`);
        } finally {
            setProfileLoading(false);
        }
    };
    return (
        <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-4 md:p-6 space-y-4 md:space-y-6 w-full">
            <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-3 md:pb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                    <User size={14} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div>
                    <h3 className="font-bold text-base md:text-lg text-[var(--admin-text)]">Personal Info</h3>
                    <p className="text-[10px] md:text-xs text-[var(--admin-text)]">Update your name, email, and avatar.</p>
                </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4 md:space-y-6">
                {profileMsg && (
                    <div className={`p-3 rounded-[8px] text-[10px] md:text-sm ${profileMsg.startsWith("Success") ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"}`}>
                        {profileMsg.replace(/^(Success|Error): /, "")}
                    </div>
                )}
                
                {/* Avatar Section */}
                <div className="space-y-3 md:space-y-4 pt-1 md:pt-2">
                        <div className="flex flex-col items-center justify-center p-4 md:p-6 admin-surface-input rounded-xl border border-[var(--admin-border)] mb-3 md:mb-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[var(--admin-border)] shadow-xl relative mb-2 md:mb-3">
                            {profileData.avatar ? (
                                <Image 
                                    src={profileData.avatar} 
                                    alt="Current Avatar" 
                                    fill 
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gold/5 flex items-center justify-center text-gold/50">
                                    <User size={24} className="md:w-[32px] md:h-[32px]" />
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] md:text-xs text-[var(--admin-text)]">Current Avatar</p>
                        </div>

                        <AvatarPicker 
                        currentAvatar={profileData.avatar}
                        seedName={profileData.name}
                        onSelect={(url) => setProfileData(prev => ({ ...prev, avatar: url }))}
                        />
                </div>

                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                        <label className="text-[10px] md:text-xs font-bold text-[var(--admin-text)] uppercase tracking-wider">Full Name</label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full admin-surface-input border-none rounded-[8px] p-2.5 md:p-3 mt-1 text-[var(--admin-text)] placeholder:text-[var(--admin-text)]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all text-xs md:text-sm"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] md:text-xs font-bold text-[var(--admin-text)] uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full admin-surface-input border-none rounded-[8px] p-2.5 md:p-3 mt-1 text-[var(--admin-text)] placeholder:text-[var(--admin-text)]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all text-xs md:text-sm"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                </div>

                <Button 
                    type="submit"
                    disabled={profileLoading}
                    variant="primary"
                    className="w-full text-xs md:text-sm backdrop-blur-xs"
                >
                    {profileLoading ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={14} />
                            Save Profile Changes
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
