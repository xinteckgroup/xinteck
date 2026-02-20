"use client";

import { useAdminSidebar } from "@/components/admin/AdminSidebarContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderCheck,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  ShieldAlert,
  Target,
  User,
  Users
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define sidebar navigation items
const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "My Profile", href: "/admin/profile", icon: User },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Projects", icon: FolderCheck, href: "/admin/projects" },
  { label: "Services", icon: Briefcase, href: "/admin/services" },
  { label: "Files", href: "/admin/files", icon: FolderOpen },
  { label: "Leads", href: "/admin/leads", icon: Target },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Careers", href: "/admin/careers", icon: GraduationCap },
  { label: "Staff", href: "/admin/staff", icon: Users },
  { label: "Audit Log", href: "/admin/audit", icon: ShieldAlert },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];



export function AdminSidebar({ userRole }: { userRole?: string }) {
  const { isMobileOpen, isCollapsed, toggleCollapse } = useAdminSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Filter Items based on Role
  const filteredItems = SIDEBAR_ITEMS.filter(item => {
    // Super Admin Only
    if (item.label === "Settings" || item.label === "Audit Log") {
       return userRole === Role.SUPER_ADMIN;
    }
    
    // Admin & Super Admin Only
    if (item.label === "Staff") {
       return [Role.SUPER_ADMIN, Role.ADMIN].includes(userRole as any);
    }

    return true; // Everyone sees My Profile and others
  });

  // Determine effective width based on responsiveness
  const isMobile = isMounted && typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Initial width should be collapsed (80px) to prevent flash
  const currentWidth = !isMounted 
      ? 80 
      : isMobile 
          ? (isMobileOpen ? 80 : 0) 
          : (isCollapsed ? 80 : 256);

  const isHidden = isMobile && !isMobileOpen;

  return (
    <motion.aside
      initial={false}
      animate={{ 
         width: currentWidth
      }}
      transition={{ 
         width: { type: "spring", stiffness: 300, damping: 30 }
      }}
      className={cn(
        "relative ml-[5px] my-[5px] mr-0 h-[calc(100vh-10px)] sticky top-[5px] flex flex-col admin-surface-primary backdrop-blur-xs z-50 rounded-[10px]",
        "max-md:w-0", // CSS-only: Hidden on mobile by default until JS hydrates
        isHidden && "border-none bg-transparent pointer-events-none" // Hide border/bg when hidden
      )}
    >
      <div className={cn("flex flex-col h-full overflow-hidden", isHidden && "opacity-0")}>
        {/* Brand */}
        <div className={cn("h-20 flex items-center px-6 relative", isCollapsed ? "justify-center" : "justify-start pl-4")}>
          <div className="relative w-full h-full flex items-center">
              {/* Expanded Logo */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn("absolute inset-0 flex items-center justify-start", isCollapsed && "pointer-events-none")}
              >
                  <div 
                      className="relative w-32 h-10 border border-gold/30 rounded-[10px] overflow-hidden bg-black/60 dark:bg-white/30 admin-gold-pulse"
                  >
                      <NextImage src="/logos/logo-dark-full.webp" alt="Xinteck" fill className="object-cover" priority />
                  </div>
              </motion.div>

              {/* Collapsed Logo */}
              <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isCollapsed ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn("absolute inset-0 flex items-center justify-center", !isCollapsed && "pointer-events-none")}
              >
                  <div 
                      className="relative w-10 h-10 border border-gold/30 rounded-full overflow-hidden bg-black/60 dark:bg-white/30 p-1.5 shrink-0 aspect-square admin-gold-pulse"
                  >
                       <NextImage src="/logos/logo-dark.webp" alt="X" fill className="object-contain" />
                  </div>
              </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-none">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-[10px] transition-all group relative overflow-hidden",
                  isCollapsed && "justify-center",
                  isActive 
                    ? "bg-gold text-primary-foreground font-bold shadow-lg shadow-gold/20" 
                    : "text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavParams"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                <div className={cn("relative z-10", isActive ? "text-primary-foreground" : "text-[var(--admin-text)] group-hover:text-[var(--admin-text)]")}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap relative z-10">
                    {item.label}
                  </span>
                )}
                
                {!isCollapsed && isActive && (
                  <ChevronRight size={16} className="ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Footer / Theme & Logout */}
        <div className="p-3 border-t border-[var(--admin-border)] mx-2 mb-2 space-y-2">
          <div className={cn("flex items-center", isCollapsed ? "flex-col justify-center gap-2" : "gap-3 pl-3")}>
               <ThemeToggle /> 
               {!isCollapsed && <span className="text-sm font-medium text-[var(--admin-text)]">Theme</span>}
          </div>

          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-3 rounded-[10px] transition-all font-bold shadow-lg",
              isCollapsed ? "justify-center bg-gold/10 text-gold hover:bg-gold hover:text-primary-foreground" : "bg-gold text-primary-foreground hover:bg-gold/90 hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-bold">Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={toggleCollapse}
        className={cn(
           "absolute -right-3 top-10 bg-gold text-primary-foreground p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform z-[60] border-2 border-[var(--admin-border)] pointer-events-auto backdrop-blur-xs",
           "hidden md:flex" 
        )}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

    </motion.aside>
  );
}
