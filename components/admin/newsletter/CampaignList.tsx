"use client";

import { deleteCampaign } from "@/actions/newsletter-campaigns";
import { RoleGate } from "@/components/admin/RoleGate";
import { Button, ConfirmDialog, PageContainer, PageHeader, Pagination, useToast } from "@/components/admin/ui";
import { PaginatedResponse } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import {
    Edit3, Mail, MailCheck,
    Plus, Search, Send, Trash2, Users
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

interface CampaignListProps {
    initialData: PaginatedResponse<any>;
    stats: { totalCampaigns: number; sentCampaigns: number; totalEmailsSent: number };
}

export function CampaignList({ initialData, stats }: CampaignListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status") || "all";

    const [search, setSearch] = useState(currentSearch);
    const [status, setStatus] = useState(currentStatus);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const campaigns = initialData.data;
    const meta = {
        page: initialData.page,
        totalPages: initialData.totalPages,
        total: initialData.total,
    };

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        if (name !== "page") params.set("page", "1");
        return params.toString();
    };

    const handleSearchDebounced = useDebouncedCallback((term: string) => {
        router.push(pathname + "?" + createQueryString("search", term));
    }, 300);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        handleSearchDebounced(val);
    };

    const handleStatusChange = (val: string) => {
        setStatus(val);
        router.push(pathname + "?" + createQueryString("status", val));
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        startTransition(async () => {
            try {
                await deleteCampaign(deleteId);
                toast("Campaign deleted", "success");
                router.refresh();
                setDeleteId(null);
            } catch (err: any) {
                toast(err.message || "Failed to delete", "error");
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            DRAFT: "bg-[var(--admin-text)]/10 text-[var(--admin-text)]/60 border-[var(--admin-border)]",
            SENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse",
            SENT: "bg-green-500/20 text-green-400 border-green-500/30",
            FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
        };
        return (
            <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", styles[status] || styles.DRAFT)}>
                {status}
            </span>
        );
    };

    return (
        <PageContainer>
            <PageHeader
                title="Campaigns"
                subtitle="View and manage your newsletter campaign history."
                actions={
                    <Button
                        variant="outline"
                        className="gap-2 bg-gold/90 border border-gold text-black hover:bg-gold transition-all text-sm font-black rounded-[10px]"
                        onClick={() => router.push("/admin/newsletter/compose")}
                    >
                        <Plus size={14} /> New Campaign
                    </Button>
                }
            />

            <div className="flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <StatsCard label="Total Campaigns" value={stats.totalCampaigns} icon={<Mail size={20} />} colorClass="bg-gold/40 text-gold" valueClass="text-[var(--admin-text)]" />
                    <StatsCard label="Sent Campaigns" value={stats.sentCampaigns} icon={<MailCheck size={20} />} colorClass="bg-green-500/40 text-green-500" valueClass="text-green-500" />
                    <StatsCard label="Total Emails Sent" value={stats.totalEmailsSent} icon={<Send size={20} />} colorClass="bg-blue-500/40 text-blue-500" valueClass="text-blue-500" />
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between admin-surface-primary backdrop-blur-sm p-3 md:p-4 rounded-[12px] border border-[var(--admin-border)] shadow-xl">
                    <div className="relative w-full md:w-64 lg:w-96 bg-black/60 dark:bg-white/30 rounded-[10px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={search}
                                onChange={e => handleSearchChange(e.target.value)}
                                className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex gap-1 admin-surface-input/30 p-1 rounded-lg border border-[var(--admin-border)] w-full md:w-auto overflow-x-auto">
                        {(["all", "DRAFT", "SENT", "SENDING", "FAILED"] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => handleStatusChange(s)}
                                className={cn(
                                    "px-4 py-1.5 rounded-[6px] text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 md:flex-none",
                                    status === s
                                        ? "bg-gold/90 text-[var(--admin-text)] shadow-md border border-[var(--admin-border)]"
                                        : "text-[var(--admin-text)]/40 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/10"
                                )}
                            >
                                {s === "all" ? "All" : s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Campaign Table */}
                <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] overflow-hidden shadow-2xl flex flex-col min-h-[400px]">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-black/20 dark:bg-white/10 text-[var(--admin-text)] text-[12px] font-bold uppercase tracking-widest border-b border-[var(--admin-border)]">
                                    <th className="p-4 w-[35%]">Subject</th>
                                    <th className="p-4 w-[15%]">Status</th>
                                    <th className="p-4 w-[15%]">Recipients</th>
                                    <th className="p-4 w-[15%]">Sent</th>
                                    <th className="p-4 w-[20%] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-[var(--admin-text)]/20">
                                            <div className="flex flex-col items-center gap-4">
                                                <Mail size={48} className="opacity-20" />
                                                <p className="text-base font-bold text-[var(--admin-text)]/40 uppercase tracking-widest">No campaigns yet</p>
                                                <button
                                                    onClick={() => router.push("/admin/newsletter/compose")}
                                                    className="text-xs font-bold text-gold hover:underline"
                                                >
                                                    Create your first newsletter →
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    campaigns.map((c: any) => (
                                        <tr key={c.id} className="border-b border-[var(--admin-border)]/50 hover:bg-[var(--admin-text)]/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-[var(--admin-text)] truncate max-w-[300px]">{c.subject}</span>
                                                    {c.previewText && (
                                                        <span className="text-[11px] text-[var(--admin-muted)] truncate max-w-[300px]">{c.previewText}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">{getStatusBadge(c.status)}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Users size={14} className="text-[var(--admin-muted)]" />
                                                    <span className="text-sm font-bold text-[var(--admin-text)]">
                                                        {c.status === "DRAFT" ? "—" : `${c.sentCount}/${c.recipientCount}`}
                                                    </span>
                                                    {c.failedCount > 0 && (
                                                        <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                                                            {c.failedCount} failed
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-bold text-[var(--admin-text)]">
                                                        {c.sentAt ? new Date(c.sentAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                                    </span>
                                                    {c.sentAt && (
                                                        <span className="text-[10px] text-[var(--admin-muted)]">
                                                            {new Date(c.sentAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    {c.status === "DRAFT" && (
                                                        <>
                                                            <button
                                                                onClick={() => router.push(`/admin/newsletter/compose/${c.id}`)}
                                                                className="p-2 text-[var(--admin-text)] hover:text-gold hover:bg-gold/5 rounded-[8px] transition-all"
                                                                title="Edit draft"
                                                            >
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                                                                <button
                                                                    onClick={() => setDeleteId(c.id)}
                                                                    disabled={isPending}
                                                                    className="p-2 text-[var(--admin-text)] hover:text-red-500 hover:bg-red-500/5 rounded-[8px] transition-all"
                                                                    title="Delete draft"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </RoleGate>
                                                        </>
                                                    )}
                                                    {c.status === "SENT" && (
                                                        <span className="text-[10px] font-bold text-green-400 px-2">✓ Delivered</span>
                                                    )}
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
                        <span className="text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest">
                            Showing Page <span className="text-gold">{meta.page}</span> of <span className="text-gold">{meta.totalPages}</span> (Total <span className="font-black">{meta.total}</span>)
                        </span>
                        <Pagination currentPage={meta.page} totalPages={meta.totalPages} baseUrl="/admin/newsletter/campaigns" />
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Campaign?"
                message="This will permanently delete this draft campaign. This action cannot be undone."
                loading={isPending}
            />
        </PageContainer>
    );
}

function StatsCard({ icon, label, value, colorClass, valueClass }: { icon: any; label: string; value: number; colorClass: string; valueClass: string }) {
    return (
        <div className="p-4 md:p-6 admin-surface-primary backdrop-blur-xs rounded-[12px] border border-[var(--admin-border)] shadow-xl relative overflow-hidden group hover:border-gold/30 transition-all duration-500">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12 scale-150 transform">
                {icon}
            </div>
            <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-inner", colorClass)}>
                    {icon}
                </div>
                <span className="text-[var(--admin-text)]/60 text-[12px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className={cn("text-3xl md:text-4xl font-black tracking-tight", valueClass)}>{value.toLocaleString()}</p>
        </div>
    );
}
