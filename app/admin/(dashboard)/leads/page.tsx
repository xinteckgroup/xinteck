import { getAdminUsers, getMessages } from "@/actions/leads";
import { LeadsClient } from "@/components/admin/LeadsClient";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ filter?: string; search?: string; page?: string; limit?: string }> 
}) {
  const params = await searchParams;
  const filter = (params.filter as "all" | "unread" | "starred" | "archived") || "all";
  const search = params.search;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;

  const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);
  
  const [result, adminUsers] = await Promise.all([
    getMessages({ filter, search, page, pageSize: limit }),
    user.role === Role.SUPER_ADMIN ? getAdminUsers() : Promise.resolve([])
  ]);

  return <LeadsClient initialData={result} adminUsers={adminUsers} currentUserRole={user.role} />;
}
