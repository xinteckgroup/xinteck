import { getUsers } from "@/actions/user";
import { StaffClient } from "@/components/admin/StaffClient";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);
  const staff = await getUsers();
  console.log("SERVER HYDRATION TRACE - STAFF COUNT:", staff.length);
  
  return <StaffClient initialStaff={staff} />;
}
