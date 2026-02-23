import { getInvitations } from "@/actions/team";
import { getUsers } from "@/actions/user";
import { StaffClient } from "@/components/admin/StaffClient";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);
  const staff = await getUsers();
  let allStaff = [...staff];

  // Only Admins can see/manage invites
  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
     const rawInvitations = await getInvitations();
     const activeInvites = rawInvitations.filter(inv => inv.status === "PENDING" && new Date(inv.expiresAt) > new Date());
     
     const ghostUsers = activeInvites.map(inv => ({
          id: inv.id,
          name: "Pending Invite",
          email: inv.email,
          role: inv.role === 'SUPER_ADMIN' ? 'Super Admin' : inv.role === 'ADMIN' ? 'Admin' : 'Support Staff',
          status: "Pending",
          lastActive: "Invited by " + (inv.invitedBy?.name || "Admin"),
          avatar: "⏳",
          isInvite: true
     }));
     allStaff = [...ghostUsers, ...staff];
  }

  console.log("SERVER HYDRATION TRACE - STAFF COUNT:", allStaff.length);
  
  return <StaffClient initialStaff={allStaff} />;
}
