"use client";

import { deleteSubscriber, resubscribeSubscriber, unsubscribeSubscriber } from "@/actions/newsletter";
import { RoleGate } from "@/components/admin/RoleGate";
import { Button, ConfirmDialog, PageContainer, PageHeader, Pagination, useToast } from "@/components/admin/ui";
import { Role } from "@prisma/client";
import { Download, MailOpen, Pen, Search, Trash2, UserMinus, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { NewsletterSubscriber } from "@/types";

import { PaginatedResponse } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface NewsletterClientProps {
  initialData: PaginatedResponse<NewsletterSubscriber>;
  stats: { total: number; active: number; unsubscribed: number };
}

export function NewsletterClient({ initialData, stats }: NewsletterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentFilter = (searchParams.get("filter") as "all" | "active" | "unsubscribed") || "all";
  
  const [search, setSearch] = useState(currentSearch);
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">(currentFilter);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const subscribers = initialData.data;
  const meta = {
      page: initialData.page,
      totalPages: initialData.totalPages,
      total: initialData.total
  };

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
        params.set(name, value);
    } else {
        params.delete(name);
    }
    if (name !== "page") {
        params.set("page", "1");
    }
    return params.toString();
  };

  const handleSearchDebounced = useDebouncedCallback((term: string) => {
     router.push(pathname + "?" + createQueryString("search", term));
  }, 300);

  const handleSearchChange = (val: string) => {
      setSearch(val);
      handleSearchDebounced(val);
  };

  const handleFilterChange = (val: "all" | "active" | "unsubscribed") => {
      setFilter(val);
      router.push(pathname + "?" + createQueryString("filter", val));
  };

  const handleUnsubscribe = (id: string) => {
    startTransition(async () => {
      await unsubscribeSubscriber(id);
      toast("Subscriber unsubscribed", "success");
      router.refresh();
    });
  };

  const handleResubscribe = (id: string) => {
    startTransition(async () => {
      await resubscribeSubscriber(id);
      toast("Subscriber resubscribed", "success");
      router.refresh();
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteSubscriber(deleteId);
      toast("Subscriber permanently deleted", "success");
      router.refresh();
      setDeleteId(null);
    });
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Newsletter" 
        subtitle="Manage subscribers and track audience growth."
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="gap-2 bg-gold/90 border border-gold text-black hover:bg-gold transition-all text-sm font-black rounded-[10px]" 
              onClick={() => router.push("/admin/newsletter/compose")}
            >
              <Pen size={14} /> Compose
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 admin-surface-primary border border-[var(--admin-border)] text-white hover:text-gold hover:bg-white/5 transition-all text-sm font-bold rounded-[10px]" 
              onClick={() => window.open("/api/newsletter/export", "_blank")}
            >
              <Download size={14} />
              <span className="text-white">Export CSV</span>
            </Button>
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="flex gap-1 admin-surface-primary border border-[var(--admin-border)] p-1 rounded-[12px] shadow-xl w-fit mb-0">
        {([
          { label: "Subscribers", href: "/admin/newsletter", active: true },
          { label: "Campaigns", href: "/admin/newsletter/campaigns", active: false },
        ] as const).map(tab => (
          <button
            key={tab.label}
            onClick={() => router.push(tab.href)}
            className={cn(
              "px-5 py-2 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all",
              tab.active
                ? "bg-gold/90 text-black shadow-md"
                : "text-white hover:text-gold hover:bg-white/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatsCard 
            label="Total Subscribers" 
            value={stats.total} 
            icon={<Users size={20} />} 
            colorClass="bg-gold/40 text-gold" 
            valueClass="text-white" 
          />
          <StatsCard 
            label="Active Readers" 
            value={stats.active} 
            icon={<MailOpen size={20} />} 
            colorClass="bg-green-500/40 text-green-400" 
            valueClass="text-green-400" 
          />
          <StatsCard 
            label="Unsubscribed" 
            value={stats.unsubscribed} 
            icon={<UserMinus size={20} />} 
            colorClass="bg-white/10 text-white" 
            valueClass="text-white" 
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between admin-surface-primary backdrop-blur-sm p-3 md:p-4 rounded-[12px] border border-[var(--admin-border)] shadow-xl">
          <div className="relative w-full md:w-64 lg:w-96 bg-black/60 dark:bg-white/30 rounded-[10px]">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-10 py-2 text-sm text-white placeholder:text-white focus:border-gold/50 focus:outline-none transition-colors"
                />
             </div>
          </div>
          <div className="flex gap-1 admin-surface-input/30 p-1 rounded-lg border border-[var(--admin-border)] w-full md:w-auto overflow-x-auto">
            {(["all", "active", "unsubscribed"] as const).map(f => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={cn(
                  "px-4 py-1.5 rounded-[6px] text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 md:flex-none",
                  filter === f
                    ? "bg-gold/90 text-black shadow-md border border-gold/40"
                    : "text-white hover:text-gold hover:bg-white/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] overflow-hidden shadow-2xl flex flex-col min-h-[400px]">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-white/5 text-white text-[11px] font-bold uppercase tracking-widest border-b border-[var(--admin-border)]">
                  <th className="p-4 w-[40%]">Email</th>
                  <th className="p-4 w-[20%]">Status</th>
                  <th className="p-4 w-[20%]">Joined</th>
                  <th className="p-4 w-[20%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Users size={48} className="text-white" />
                        <p className="text-base font-bold text-white uppercase tracking-widest">No subscribers found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-[var(--admin-border)]/50 hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                             <a 
                                 href={`mailto:${sub.email}`} 
                                 className="text-[14px] font-bold text-white hover:text-gold transition-colors truncate"
                                 title="Click to email subscriber directly"
                             >
                                 {sub.email}
                             </a>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <span className="bg-gold/20 text-white border border-gold/20 px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider max-w-max">
                                 Source: {sub.source}
                             </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          sub.isActive
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-white/5 text-white border-[var(--admin-border)]"
                        )}>
                          {sub.isActive ? "ACTIVE" : "UNSUBSCRIBED"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                           <span className="text-[12px] font-bold text-white">{new Date(sub.subscribedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                           <span className="text-[10px] text-white font-black uppercase tracking-wider">Verified</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                            {sub.isActive ? (
                              <button
                                onClick={() => handleUnsubscribe(sub.id)}
                                disabled={isPending}
                                className="p-2 text-white hover:text-red-400 hover:bg-red-500/10 rounded-[8px] transition-all"
                                title="Unsubscribe"
                              >
                                {isPending ? <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <UserMinus size={16} />}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleResubscribe(sub.id)}
                                disabled={isPending}
                                className="p-2 text-white hover:text-green-400 hover:bg-green-500/10 rounded-[8px] transition-all"
                                title="Resubscribe"
                              >
                                {isPending ? <div className="w-3.5 h-3.5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" /> : <UserPlus size={16} />}
                              </button>
                            )}
                          </RoleGate>
                          <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                            <button
                              onClick={() => setDeleteId(sub.id)}
                              disabled={isPending}
                              className="p-2 text-white hover:text-red-500 hover:bg-red-500/10 rounded-[8px] transition-all"
                              title="Delete permanently"
                            >
                              <Trash2 size={16} />
                            </button>
                          </RoleGate>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-auto p-4 border-t border-[var(--admin-border)] flex flex-col md:flex-row gap-4 items-center justify-between">
            <span className="text-[12px] font-black text-white uppercase tracking-widest">
              Showing Page <span className="text-gold">{meta.page}</span> of <span className="text-gold">{meta.totalPages}</span> (Total <span className="font-black">{meta.total}</span>)
            </span>
            <div className="flex gap-2">
               <Pagination 
                   currentPage={meta.page}
                   totalPages={meta.totalPages}
                   baseUrl="/admin/newsletter"
               />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Subscriber?"
        message="This action cannot be undone. The subscriber will be permanently removed from the database."
        loading={isPending}
      />

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
            background: rgba(255,255,255,0.2);
        }
      `}</style>
    </PageContainer>
  );
}

function StatsCard({ icon, label, value, colorClass, valueClass }: { icon: any, label: string, value: number, colorClass: string, valueClass: string }) {
    return (
        <div className="p-4 md:p-6 admin-surface-primary backdrop-blur-xs rounded-[12px] border border-[var(--admin-border)] shadow-xl relative overflow-hidden group hover:border-gold/30 transition-all duration-500">
           <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-1000 rotate-12 scale-150 transform">
              {icon}
           </div>
           <div className="flex items-center gap-3 mb-3">
             <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-inner", colorClass)}>
               {icon}
             </div>
             <span className="text-white text-[12px] font-black uppercase tracking-widest">{label}</span>
           </div>
           <p className={cn("text-3xl md:text-4xl font-black tracking-tight", valueClass)}>{value}</p>
        </div>
    );
}
