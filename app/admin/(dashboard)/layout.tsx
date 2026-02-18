import { AdminBackground } from "@/components/admin/AdminBackground";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { RoleProvider } from "@/components/admin/RoleContext";
import { ToastProvider } from "@/components/admin/ui/Toast";
import { getCurrentUser } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  
  return (
    <AdminSidebarProvider>
      <AdminBackground />
      <div className="min-h-screen flex bg-transparent text-foreground font-sans selection:bg-gold/30 admin-background-root">

        
        <AdminSidebar userRole={user?.role} />
        
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <RoleProvider
              userRole={user?.role ?? Role.SUPPORT_STAFF}
              userId={user?.id ?? ""}
              userName={user?.name ?? ""}
              userAvatar={user?.avatar ?? undefined}
          >
            <AdminTopbar />
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <main className="min-h-full p-2 md:p-8">
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </main>
            </div>
          </RoleProvider>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}

