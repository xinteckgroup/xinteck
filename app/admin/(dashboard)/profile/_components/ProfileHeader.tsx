"use client";

import { useRole } from "@/components/admin/RoleContext";
import { User } from "lucide-react";

export function ProfileHeader() {
    const { userName, userRole, userAvatar, userId } = useRole();

    return (
        <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 mb-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[var(--admin-border)] shadow-xl overflow-hidden relative shrink-0 admin-surface-input flex items-center justify-center">
                 {userName && userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                ) : userName ? (
                    <span className="font-bold text-4xl text-gold">{userName.charAt(0).toUpperCase()}</span>
                ) : (
                    <User size={48} className="text-[var(--admin-muted)]/20" />
                )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left space-y-1 md:space-y-2 flex-1 relative z-10">
                <div>
                    <h1 className="text-lg md:text-3xl font-bold text-[var(--admin-text)] mb-0.5 md:mb-1">{userName || "User"}</h1>
                    <p className="text-[var(--admin-text)] text-[10px] md:text-sm font-mono">{userId}</p>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3">
                    <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-gold/10 text-gold border border-gold/20 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        {userRole || "STAFF"}
                    </span>
                    <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 md:gap-1.5">
                        <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Active
                    </span>
                </div>
            </div>
        </div>
    );
}
