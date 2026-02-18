"use client";

import { useAdminSidebar } from "@/components/admin/AdminSidebarContext";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { useRole } from "@/components/admin/RoleContext";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import Link from "next/link";

export function AdminTopbar() {
  const { toggleMobileSidebar, isMobileOpen } = useAdminSidebar();
  const { userName, userRole, userAvatar } = useRole();

  return (
    <header 
      className="h-16 md:h-20 p-[2px] md:px-8 md:py-0 flex items-center justify-between admin-surface-primary backdrop-blur-xs shrink-0 z-40 m-[5px] rounded-[10px] text-[var(--admin-text)] gap-4"
    >
      <div className="flex flex-1 items-center gap-2 md:gap-4 min-w-0">
          {/* Mobile Toggle Icon */}
          <button 
            onClick={toggleMobileSidebar}
            className="p-2 ml-[5px] rounded-lg text-[var(--admin-text)] opacity-80 hover:opacity-100 hover:bg-[var(--admin-text)]/5 transition-all md:hidden shrink-0"
          >
            {isMobileOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>

          {/* Search */}
          <GlobalSearch />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <NotificationBell />

        <div className="h-8 w-[1px] bg-[var(--admin-muted)]" />

        <Link href="/admin/profile" className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[var(--admin-text)] group-hover:text-gold transition-colors">{userName || "Admin User"}</p>
            <p className="text-xs text-[var(--admin-text)]">{userRole || "Administrator"}</p>
          </div>
          <div className="w-10 h-10 rounded-[10px] bg-black/60 dark:bg-white/30 flex items-center justify-center border border-[var(--admin-border)] group-hover:border-gold/50 transition-colors overflow-hidden relative mr-[5px] md:mr-0">
            {userName && userAvatar ? (
               <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : userName ? (
                <span className="font-bold text-lg text-gold">{userName.charAt(0).toUpperCase()}</span>
            ) : (
                <User size={20} className="text-[var(--admin-muted)] group-hover:text-gold" />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
