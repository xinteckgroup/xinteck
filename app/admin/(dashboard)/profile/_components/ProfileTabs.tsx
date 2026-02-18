"use client";

import { cn } from "@/lib/utils";
import { Activity, Bell, Lock, TabletSmartphone, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
    { label: "General", href: "/admin/profile", icon: User },
    { label: "Security", href: "/admin/profile/security", icon: Lock },
    { label: "Sessions", href: "/admin/profile/sessions", icon: TabletSmartphone },
    { label: "Notifications", href: "/admin/profile/notifications", icon: Bell },
    { label: "Activity", href: "/admin/profile/activity", icon: Activity },
];

export function ProfileTabs() {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-none mb-6">
            {TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-sm font-bold transition-all whitespace-nowrap border",
                            isActive 
                                ? "bg-gold text-primary-foreground border-gold shadow-lg shadow-gold/20" 
                                : "admin-surface-primary text-[var(--admin-text)] border-[var(--admin-border)] hover:bg-[var(--admin-text)]/5 hover:text-gold backdrop-blur-xs"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
