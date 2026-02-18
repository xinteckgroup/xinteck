"use client";

import { deleteUser, deleteUsers, inviteUser, reactivateUser, suspendUser, updateUserRole } from "@/actions/user";
import { DataGrid } from "@/components/admin/DataGrid";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { Activity, Ban, Check, RefreshCw, Shield, UserMinus, UserPlus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "./ui/Toast";

interface StaffClientProps {
  initialStaff: any[];
}

export function StaffClient({ initialStaff }: StaffClientProps) {
  const router = useRouter();
  const { error, success } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  // Invite Form State
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  const handleInvite = () => {
    if (!inviteName || !inviteEmail) return;
    
    startTransition(async () => {
        try {
            await inviteUser({ name: inviteName, email: inviteEmail, role: inviteRole });
            success("Invitation sent successfully");
            setIsInviteOpen(false);
            resetForm();
            router.refresh();
        } catch (e: any) {
            error("Failed to invite user: " + e.message);
        }
    });
  };

  const handleUpdateRole = () => {
    if (!selectedStaff) return;
    
    startTransition(async () => {
        try {
            await updateUserRole(selectedStaff.id, inviteRole);
            success("Role updated successfully");
            setIsEditOpen(false);
            setSelectedStaff(null);
            router.refresh();
        } catch (e: any) {
            error("Failed to update role: " + e.message);
        }
    });
  };

  const handleDelete = (ids: string | string[]) => {
       if (confirm("Permanently delete this user? This cannot be undone.")) {
           startTransition(async () => {
               try {
                   if (Array.isArray(ids)) {
                       await deleteUsers(ids);
                   } else {
                       await deleteUser(ids);
                   }
                   success("User(s) deleted successfully");
                   router.refresh();
               } catch (e: any) {
                   error("Failed to delete user: " + e.message);
               }
           });
       }
  };

  const openEdit = (member: any) => {
     setSelectedStaff(member);
     setInviteRole(member.role); // Pre-select current role
     setIsEditOpen(true);
  };

  const resetForm = () => {
     setInviteName("");
     setInviteEmail("");
     setInviteRole("Viewer");
  };

  const handleSuspend = (id: string) => {
    if (confirm("Suspend this user? They will be logged out immediately.")) {
      startTransition(async () => {
        try {
          await suspendUser(id);
          success("User suspended");
          router.refresh();
        } catch (e: any) {
          error("Failed to suspend: " + e.message);
        }
      });
    }
  };

  const handleReactivate = (id: string) => {
    startTransition(async () => {
      try {
        await reactivateUser(id);
        success("User reactivated");
        router.refresh();
      } catch (e: any) {
        error("Failed to reactivate: " + e.message);
      }
    });
  };

  const columns = [
    {
      key: "name",
      label: "User Profile",
      render: (row: any) => (
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full admin-surface-input flex items-center justify-center text-[var(--admin-text)] font-black border border-[var(--admin-border)] overflow-hidden relative shadow-inner">
               {row.avatar?.startsWith('http') ? (
                  <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
               ) : (
                  <span className="text-gold uppercase">{row.avatar || row.name.charAt(0)}</span>
               )}
            </div>
            <div>
               <p className="text-[14px] font-black text-[var(--admin-text)] leading-tight">{row.name}</p>
               <p className="text-[11px] font-bold text-[var(--admin-text)]/40 uppercase tracking-tighter">{row.email}</p>
            </div>
         </div>
      )
    },
    {
      key: "role",
      label: "Role",
      render: (row: any) => (
         <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
            row.role === 'Super Admin' ? 'bg-primary/10 text-gold border-gold/20' : 
            row.role === 'Editor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            'admin-surface-input text-[var(--admin-text)]/40 border-[var(--admin-border)]'
         )}>
            <Shield size={10} />
            {row.role}
         </span>
      )
    },
    {
       key: "status",
       label: "Status",
       render: (row: any) => (
          <div className="flex items-center gap-2">
             <div className={cn(
                "w-2 h-2 rounded-full",
                row.status === 'Active' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' :
                row.status === 'Away' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 
                row.status === 'Suspended' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 
                'bg-[var(--admin-text)]/20'
             )} />
             <span className="text-[12px] font-bold text-[var(--admin-text)]/60 uppercase tracking-wider">{row.status}</span>
          </div>
       )
    },
    { 
       key: "lastActive", 
       label: "Last Active", 
       align: "right" as const,
       render: (row: any) => (
          <span className="text-[12px] font-bold text-[var(--admin-text)]/40 uppercase tracking-widest bg-[var(--admin-text)]/5 px-2 py-1 rounded-md border border-[var(--admin-border)]">
             {row.lastActive || "Never"}
          </span>
       )
    },
    {
      key: "actions",
      label: "",
      align: "right" as const,
      render: (row: any) => (
        <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {row.role !== 'Super Admin' && (
              row.status === 'Suspended' ? (
                <button
                  onClick={() => handleReactivate(row.id)}
                  disabled={isPending}
                  className="p-2 text-green-400 hover:bg-green-500/5 rounded-[8px] transition-all"
                  title="Reactivate"
                >
                  <RefreshCw size={16} className={isPending ? "animate-spin" : ""} />
                </button>
              ) : row.status === 'Active' ? (
                <button
                  onClick={() => handleSuspend(row.id)}
                  disabled={isPending}
                  className="p-2 text-red-400 hover:bg-red-500/5 rounded-[8px] transition-all"
                  title="Suspend"
                >
                  <Ban size={16} />
                </button>
              ) : null
            )}
          </div>
        </RoleGate>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Staff Management" 
        subtitle="Manage team access and permissions."
        actions={
          <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
            <button 
              onClick={() => setIsInviteOpen(true)} 
              className="bg-primary text-primary-foreground font-black px-6 py-2 md:px-10 md:py-3 rounded-[10px] flex items-center gap-2 hover:bg-gold transition-all text-xs md:text-sm shadow-xl shadow-primary/20"
            >
              <UserPlus size={16} />
              Invite Member
            </button>
          </RoleGate>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
           <StatsCard 
              label="Total Members" 
              value={initialStaff.length} 
              icon={<Users size={20} />} 
              colorClass="bg-gold/10 text-gold" 
              valueClass="text-[var(--admin-text)]" 
           />
           <StatsCard 
              label="Active Now" 
              value={initialStaff.filter(s => s.status === 'Active').length} 
              icon={<Activity size={20} />} 
              colorClass="bg-green-500/10 text-green-500" 
              valueClass="text-green-500" 
              pulse 
           />
           <StatsCard 
              label="Suspended" 
              value={initialStaff.filter(s => s.status === 'Suspended').length} 
              icon={<UserMinus size={20} />} 
              colorClass="bg-red-500/10 text-red-500" 
              valueClass="text-red-500" 
           />
        </div>

        {/* Data Grid */}
        <div className="rounded-[12px] overflow-hidden shadow-2xl">
           <DataGrid 
              columns={columns}
              data={initialStaff}
              hideSearch={false}
              actions={{
                 onEdit: (id) => openEdit(initialStaff.find(s => s.id === id)),
                 onDelete: (id: any) => handleDelete(id)
              }}
           />
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
         <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="admin-surface-floating w-full max-w-md rounded-[20px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-[var(--admin-border)] overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
               <div className="flex justify-between items-center p-6 bg-black/20 border-b border-[var(--admin-border)]">
                  <div>
                    <h3 className="text-xl font-black text-[var(--admin-text)] tracking-tight">Invite Member</h3>
                    <p className="text-[12px] font-bold text-gold uppercase tracking-widest mt-0.5">Team Authorization</p>
                  </div>
                  <button onClick={() => setIsInviteOpen(false)} className="p-2 text-[var(--admin-text)] hover:text-gold hover:bg-[var(--admin-text)]/5 rounded-full transition-all">
                    <X size={20} />
                  </button>
               </div>
               <div className="p-8 flex flex-col gap-6">
                  <div className="space-y-2">
                     <label className="text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest ml-1">Full Name</label>
                     <input 
                        type="text" 
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full admin-surface-input rounded-[12px] border border-[var(--admin-border)] p-4 text-[var(--admin-text)] text-sm md:text-base outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-bold placeholder:text-[var(--admin-text)]"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest ml-1">Email Address</label>
                     <input 
                        type="email" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="e.g. john@xinteck.com"
                        className="w-full admin-surface-input rounded-[12px] border border-[var(--admin-border)] p-4 text-[var(--admin-text)] text-sm md:text-base outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-bold placeholder:text-[var(--admin-text)]"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest ml-1">Access Tier</label>
                     <div className="grid grid-cols-3 gap-2">
                        {["Super Admin", "Editor", "Viewer"].map(role => (
                           <button 
                              key={role}
                              onClick={() => setInviteRole(role)}
                              className={cn(
                                 "py-2 rounded-[10px] text-[12px] font-bold uppercase tracking-widest border transition-all shadow-sm",
                                 inviteRole === role 
                                  ? "bg-primary text-[var(--admin-text)] border-primary shadow-lg shadow-primary/20 scale-105 z-10" 
                                  : "admin-surface-input text-[var(--admin-text)] border-[var(--admin-border)] hover:border-gold/30"
                              )}
                           >
                              {role}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="bg-gold/30 border border-gold/10 rounded-[12px] p-4 flex items-start gap-3">
                    <Shield size={16} className="text-[var(--admin-text)] shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-[var(--admin-text)] leading-relaxed uppercase tracking-wider">
                      Default password will be <strong className="text-[var(--admin-text)] font-black underline">xinteck123</strong>. Member should change it upon first login.
                    </p>
                  </div>
               </div>
               <div className="p-6 bg-black/10 border-t border-[var(--admin-border)] flex justify-end gap-4">
                  <button onClick={() => setIsInviteOpen(false)} className="px-6 py-2 text-[var(--admin-text)] hover:text-gold text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
                  <button 
                     onClick={handleInvite}
                     disabled={!inviteName || !inviteEmail || isPending}
                     className={cn(
                       "bg-primary text-[var(--admin-text)] font-black px-10 py-3 rounded-[12px] flex items-center gap-2 hover:bg-gold transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/20",
                       (!inviteName || !inviteEmail || isPending) && "opacity-50 cursor-not-allowed grayscale"
                     )}
                  >
                     {isPending ? "Configuring..." : "Send Invite"}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Edit Role Modal */}
      {isEditOpen && selectedStaff && (
         <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="admin-surface-floating w-full max-w-sm rounded-[20px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-[var(--admin-border)] overflow-hidden animate-in zoom-in duration-500">
               <div className="flex justify-between items-center p-6 bg-black/20 border-b border-[var(--admin-border)]">
                  <div>
                    <h3 className="text-lg font-black text-[var(--admin-text)] tracking-tight">Edit Permissions</h3>
                    <p className="text-[10px] font-bold text-gold uppercase tracking-widest mt-0.5">{selectedStaff.name}</p>
                  </div>
                  <button onClick={() => setIsEditOpen(false)} className="p-2 text-[var(--admin-text)]/40 hover:text-gold hover:bg-[var(--admin-text)]/5 rounded-full transition-all">
                    <X size={20} />
                  </button>
               </div>
               <div className="p-8">
                  <label className="text-[10px] font-black text-[var(--admin-text)]/40 uppercase tracking-widest ml-1 mb-4 block">Select Access Tier</label>
                  <div className="flex flex-col gap-3">
                     {["Super Admin", "Editor", "Viewer"].map(role => (
                        <button 
                           key={role}
                           onClick={() => setInviteRole(role)}
                           className={cn(
                              "p-4 rounded-[12px] text-xs font-black uppercase tracking-widest border text-left flex justify-between items-center transition-all shadow-sm",
                              inviteRole === role 
                                ? "bg-primary/10 text-gold border-gold shadow-lg shadow-gold/5" 
                                : "admin-surface-input text-[var(--admin-text)]/40 border-[var(--admin-border)] hover:bg-gold/5 hover:text-gold"
                           )}
                        >
                           {role}
                           {inviteRole === role && <Check size={16} className="animate-in zoom-in duration-300" />}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="p-6 bg-black/10 border-t border-[var(--admin-border)] flex justify-end gap-4">
                  <button onClick={() => setIsEditOpen(false)} className="px-5 py-2 text-[var(--admin-text)]/40 hover:text-[var(--admin-text)] text-xs font-black uppercase tracking-widest">Cancel</button>
                  <button 
                     onClick={handleUpdateRole}
                     disabled={isPending}
                     className={cn(
                       "bg-primary text-primary-foreground font-black px-8 py-3 rounded-[12px] flex items-center gap-2 hover:bg-gold transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/20",
                       isPending && "opacity-50 cursor-not-allowed grayscale"
                     )}
                  >
                     {isPending ? "Syncing..." : "Update Role"}
                  </button>
               </div>
            </div>
         </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--admin-border);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--admin-text);
            opacity: 0.2;
        }
      `}</style>
    </PageContainer>
  );
}

function StatsCard({ 
  icon, 
  label, 
  value, 
  colorClass, 
  valueClass,
  pulse = false
}: { 
  icon: any, 
  label: string, 
  value: number, 
  colorClass: string, 
  valueClass: string,
  pulse?: boolean
}) {
    return (
        <div className="p-4 md:p-6 admin-surface-primary backdrop-blur-xs rounded-[12px] border border-[var(--admin-border)] shadow-xl relative overflow-hidden group hover:border-gold/30 transition-all duration-500">
           <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12 scale-150 transform">
              {icon}
           </div>
           <div className="flex items-center gap-3 mb-3">
             <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-inner relative", colorClass)}>
               {icon}
               {pulse && (
                  <span className="absolute inset-0 rounded-full bg-current animate-ping opacity-20" />
               )}
             </div>
             <span className="text-[var(--admin-text)]/60 text-[12px] font-black uppercase tracking-widest">{label}</span>
           </div>
           <p className={cn("text-3xl md:text-4xl font-black tracking-tight", valueClass)}>{value}</p>
        </div>
    );
}
