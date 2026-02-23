"use client";

import { inviteUser, revokeInvitation } from "@/actions/team";
import { deleteUser, deleteUsers, reactivateUser, suspendUser, updateUserRole } from "@/actions/user";
import { DataGrid } from "@/components/admin/DataGrid";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { Activity, Ban, Check, RefreshCw, Shield, UserMinus, UserPlus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { useToast } from "./ui/Toast";

interface StaffClientProps {
  initialStaff: any[];
}

export function StaffClient({ initialStaff }: StaffClientProps) {
  const router = useRouter();
  const { error, success } = useToast();
  const [isPending, startTransition] = useTransition();
  // Confirm Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
  });

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Invite Form State
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Support Staff");

  // Rock-solid Optimistic UI that survives `router.refresh()` overrides
  const [optimisticStaff, mutateOptimisticStaff] = useOptimistic(
     initialStaff,
     (state, action: { type: string, payload: any }) => {
        switch (action.type) {
           case "ADD":
              return [action.payload, ...state];
           case "UPDATE_ROLE":
              return state.map(s => s.id === action.payload.id ? { ...s, role: action.payload.role } : s);
           case "DELETE":
              if (Array.isArray(action.payload)) {
                  return state.filter(s => !action.payload.includes(s.id));
              }
              return state.filter(s => s.id !== action.payload);
           case "SUSPEND":
              return state.map(s => s.id === action.payload ? { ...s, status: "Suspended" } : s);
           case "REACTIVATE":
              return state.map(s => s.id === action.payload ? { ...s, status: "Active" } : s);
           default:
              return state;
        }
     }
  );

  const handleInvite = () => {
    if (!inviteName || !inviteEmail) return;
    
    startTransition(async () => {
        try {
            const mappedRole = inviteRole === "Admin" ? Role.ADMIN : Role.SUPPORT_STAFF;
            const result = await inviteUser({ email: inviteEmail, role: mappedRole });
            
            if (result?.success === false) {
                // Return server message directly to admin toast
                error(result.message || "Failed to invite user");
                return;
            }
            
            success("Invitation sent successfully. They will appear here once registered.");
            
            // Note: Optimistic UI removed for 'ADD' because the user is not actively created until they register.

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

            // Optimistic update
            mutateOptimisticStaff({
               type: "UPDATE_ROLE",
               payload: { id: selectedStaff.id, role: inviteRole }
            });

            setIsEditOpen(false);
            setSelectedStaff(null);
            router.refresh();
        } catch (e: any) {
            error("Failed to update role: " + e.message);
        }
    });
  };

  const handleDelete = (ids: string | string[]) => {
       const idList = Array.isArray(ids) ? ids : [ids];
       setConfirmConfig({
           isOpen: true,
           title: "Delete User(s)",
           description: `Are you absolutely sure you want to permanently delete ${idList.length} user(s)? This cannot be undone.`,
           action: () => {
               closeConfirm();
               startTransition(async () => {
                   try {
                       if (Array.isArray(ids)) {
                           await deleteUsers(ids);
                       } else {
                           await deleteUser(ids);
                       }
                       success("User(s) deleted successfully");
                       
                       // Optimistic update
                       mutateOptimisticStaff({
                          type: "DELETE",
                          payload: ids
                       });
    
                       router.refresh();
                   } catch (e: any) {
                       error("Failed to delete user: " + e.message);
                   }
               });
           }
       });
  };

  const openEdit = (member: any) => {
     setSelectedStaff(member);
     setInviteRole(member.role); // Pre-select current role
     setIsEditOpen(true);
  };

  const resetForm = () => {
     setInviteName("");
     setInviteEmail("");
     setInviteRole("Support Staff");
  };

  const handleSuspend = (id: string) => {
    setConfirmConfig({
        isOpen: true,
        title: "Suspend User",
        description: "Are you sure you want to suspend this user? They will be logged out immediately and denied access until reactivated.",
        action: () => {
            closeConfirm();
            startTransition(async () => {
              try {
                await suspendUser(id);
                success("User suspended");
                
                // Optimistic update
                mutateOptimisticStaff({
                   type: "SUSPEND",
                   payload: id
                });
      
                router.refresh();
              } catch (e: any) {
                error("Failed to suspend: " + e.message);
              }
            });
        }
    });
  };

  const handleReactivate = (id: string) => {
    startTransition(async () => {
      try {
        await reactivateUser(id);
        success("User reactivated");
        
        // Optimistic update
        mutateOptimisticStaff({
           type: "REACTIVATE",
           payload: id
        });

        router.refresh();
      } catch (e: any) {
        error("Failed to reactivate: " + e.message);
      }
    });
  };

  const handleRevoke = (id: string) => {
    setConfirmConfig({
        isOpen: true,
        title: "Revoke Invitation",
        description: "Are you sure you want to revoke this invitation? The token will instantly become invalid.",
        action: () => {
            closeConfirm();
            startTransition(async () => {
              try {
                await revokeInvitation(id);
                success("Invitation permanently revoked.");
                
                mutateOptimisticStaff({
                   type: "DELETE",
                   payload: id
                });
      
                router.refresh();
              } catch (e: any) {
                error("Failed to revoke: " + e.message);
              }
            });
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
            row.role === 'Admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
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
                row.status === 'Pending' ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]' :
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
        <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {row.isInvite ? (
               <button
                 onClick={() => handleRevoke(row.id)}
                 disabled={isPending}
                 className="p-2 text-red-500 hover:bg-red-500/10 rounded-[8px] transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-red-500/20"
                 title="Revoke Invite"
               >
                 <X size={14} /> Revoke
               </button>
            ) : row.role !== 'Super Admin' ? (
              <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                {row.status === 'Suspended' ? (
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
                ) : null}
              </RoleGate>
            ) : null}
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
              className="bg-primary text-[var(--admin-text)] px-6 py-2 md:px-10 md:py-3 rounded-[10px] flex items-center gap-2 hover:bg-gold transition-all text-xs md:text-sm shadow-xl shadow-primary/20"
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
              value={optimisticStaff.length} 
              icon={<Users size={20} />} 
              colorClass="bg-gold/10 text-gold" 
              valueClass="text-[var(--admin-text)]" 
           />
           <StatsCard 
              label="Active Now" 
              value={optimisticStaff.filter(s => s.status === 'Active').length} 
              icon={<Activity size={20} />} 
              colorClass="bg-green-500/10 text-green-500" 
              valueClass="text-green-500" 
              pulse 
           />
           <StatsCard 
              label="Suspended" 
              value={optimisticStaff.filter(s => s.status === 'Suspended').length} 
              icon={<UserMinus size={20} />} 
              colorClass="bg-red-500/10 text-red-500" 
              valueClass="text-red-500" 
           />
        </div>

        {/* Data Grid */}
        <div className="rounded-[12px] overflow-hidden shadow-2xl">
           <DataGrid 
              columns={columns}
              data={optimisticStaff}
              hideSearch={false}
              disableSelection={(row: any) => row.role === 'Super Admin'}
              actions={{
                 onEdit: (id) => openEdit(optimisticStaff.find(s => s.id === id)),
                 onDelete: (id: any) => handleDelete(id)
              }}
           />
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white/30 dark:bg-white/20 backdrop-blur-md transition-colors rounded-[10px] w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative text-[var(--admin-text)] border border-[var(--admin-border)]">
               <div className="p-4 border-b border-[var(--admin-text)/10] flex items-center justify-between bg-transparent shrink-0">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-lg font-bold flex items-center gap-2 truncate">Invite Member</h3>
                    <p className="text-[12px] opacity-80 truncate">Team Authorization</p>
                  </div>
                  <button onClick={() => setIsInviteOpen(false)} className="opacity-80 hover:opacity-100 hover:text-gold transition-colors shrink-0 ml-3">
                    <X size={24} />
                  </button>
               </div>
               <div className="p-4 overflow-y-auto flex-1 bg-transparent flex flex-col gap-6">
                  <div className="space-y-2">
                     <label className="text-[12px] font-black uppercase tracking-widest ml-1 opacity-90">Full Name</label>
                     <input 
                        type="text" 
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-white/50 dark:bg-black/50 rounded-[12px] border border-black/10 dark:border-white/10 p-4 text-sm md:text-base outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-bold placeholder:text-[var(--admin-text)/60] dark:placeholder:text-[var(--admin-text)/60]"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[12px] font-black uppercase tracking-widest ml-1 opacity-90">Email Address</label>
                     <input 
                        type="email" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="e.g. john@xinteck.co.ke"
                        className="w-full bg-white/50 dark:bg-black/50 rounded-[12px] border border-black/10 dark:border-white/10 p-4 text-sm md:text-base outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-bold placeholder:text-[var(--admin-text)/60] dark:placeholder:text-[var(--admin-text)/60]"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[12px] font-black uppercase tracking-widest ml-1 opacity-90">Access Tier</label>
                     <div className="grid grid-cols-3 gap-2">
                        {["Super Admin", "Admin", "Support Staff"].map(role => (
                           <button 
                              key={role}
                              onClick={() => setInviteRole(role)}
                              className={cn(
                                 "py-2 rounded-[10px] text-[12px] font-bold uppercase tracking-widest border transition-all shadow-sm",
                                 inviteRole === role 
                                  ? "bg-primary text-[var(--admin-text)] border-primary shadow-lg shadow-primary/20 scale-105 z-10" 
                                  : "bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-gold/50"
                              )}
                           >
                              {role}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="bg-gold/20 dark:bg-gold/10 border border-gold/20 rounded-[12px] p-4 flex items-start gap-3">
                    <Shield size={16} className="text-gold shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold leading-relaxed uppercase tracking-wider opacity-90">
                      Default password will be <strong className="font-black underline text-gold">xinteck123</strong>. Member should change it upon first login.
                    </p>
                  </div>
               </div>
               <div className="p-4 border-t border-black/10 dark:border-white/10 bg-transparent flex justify-end items-center gap-4 shrink-0">
                  <button onClick={() => setIsInviteOpen(false)} className="px-6 py-2 opacity-70 hover:opacity-100 hover:text-gold text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
                  <button 
                     onClick={handleInvite}
                     disabled={!inviteName || !inviteEmail || isPending}
                     className={cn(
                       "bg-primary text-[var(--admin-text)] font-black px-8 py-2.5 rounded-[12px] flex items-center gap-2 hover:bg-gold transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/20",
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
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white/30 dark:bg-white/20 backdrop-blur-md transition-colors rounded-[10px] w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative text-[var(--admin-text)] border border-black/10 dark:border-white/10">
               <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-transparent shrink-0">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-lg font-bold flex items-center gap-2 truncate">Edit Permissions</h3>
                    <p className="text-[12px] opacity-80 truncate">{selectedStaff.name}</p>
                  </div>
                  <button onClick={() => setIsEditOpen(false)} className="opacity-80 hover:opacity-100 hover:text-gold transition-colors shrink-0 ml-3">
                    <X size={24} />
                  </button>
               </div>
               <div className="p-4 overflow-y-auto flex-1 bg-transparent">
                  <label className="text-[10px] font-black opacity-60 uppercase tracking-widest ml-1 mb-4 block">Select Access Tier</label>
                  <div className="flex flex-col gap-3">
                     {["Super Admin", "Admin", "Support Staff"].map(role => (
                        <button 
                           key={role}
                           onClick={() => setInviteRole(role)}
                           className={cn(
                              "p-4 rounded-[12px] text-xs font-black uppercase tracking-widest border text-left flex justify-between items-center transition-all shadow-sm",
                              inviteRole === role 
                                ? "bg-primary text-[var(--admin-text)] border-primary shadow-lg shadow-primary/20 scale-[1.02]" 
                                : "bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-gold/50 hover:text-gold"
                           )}
                        >
                           {role}
                           {inviteRole === role && <Check size={16} className="animate-in zoom-in duration-300" />}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="p-4 border-t border-black/10 dark:border-white/10 bg-transparent flex justify-end items-center gap-4 shrink-0">
                  <button onClick={() => setIsEditOpen(false)} className="px-5 py-2 opacity-60 hover:opacity-100 text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
                  <button 
                     onClick={handleUpdateRole}
                     disabled={isPending}
                     className={cn(
                       "bg-primary text-[var(--admin-text)] font-black px-8 py-2.5 rounded-[12px] flex items-center gap-2 hover:bg-gold transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/20",
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
        <div className="p-4 md:p-6 bg-white/30 dark:bg-black/60 backdrop-blur-xl rounded-[12px] border border-[var(--admin-border)] shadow-xl relative overflow-hidden group hover:border-gold/30 transition-all duration-500">
           <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12 scale-150 transform">
              {icon}
           </div>
           <div className="flex items-center gap-3 mb-3">
             <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-inner relative z-10", colorClass)}>
               {icon}
               {pulse && (
                  <span className="absolute inset-0 rounded-full bg-current animate-ping opacity-20" />
               )}
             </div>
             <span className="text-[var(--admin-text)]/60 text-[12px] font-black uppercase tracking-widest relative z-10">{label}</span>
           </div>
           <p className={cn("text-3xl md:text-4xl font-black tracking-tight relative z-10", valueClass)}>{value}</p>
        </div>
    );
}
