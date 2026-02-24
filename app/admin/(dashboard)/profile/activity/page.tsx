"use client";

import { exportUserActivityCsv, getUserActivity } from "@/actions/profile";
import { Button } from "@/components/admin/ui";
import { Pagination } from "@/components/admin/ui/Pagination";
import { Activity, Download, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function ActivityPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageParam = searchParams.get("page") || "1";
    const currentPage = parseInt(pageParam, 10) || 1;
    const searchQuery = searchParams.get("search") || "";

    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ totalPages: 1, total: 0 });
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            try {
                const res = await getUserActivity(currentPage, 10, searchQuery);
                setLogs(res.data);
                setMeta({ totalPages: res.totalPages, total: res.total });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [currentPage, searchQuery]);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) params.set("search", term);
        else params.delete("search");
        params.set("page", "1"); // Reset page
        router.replace(`?${params.toString()}`);
    }, 300);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const csv = await exportUserActivityCsv();
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `my-activity-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e: any) {
            alert("Export failed: " + e.message);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 w-full space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20 shrink-0">
                        <Activity size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-[var(--admin-text)]">Recent Activity</h3>
                        <p className="text-xs text-[var(--admin-text)]/80">Your recent actions across the platform.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0 items-center">
                    <div className="relative w-full sm:w-64 bg-black/60 dark:bg-white/30 rounded-[10px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search activity..." 
                                defaultValue={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors h-[40px]"
                            />
                        </div>
                    </div>
                    <Button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="h-[40px] px-4 whitespace-nowrap text-[13px] rounded-[10px]"
                    >
                        {isExporting ? "Exporting..." : <><Download size={16} className="mr-2" /> Export CSV</>}
                    </Button>
                </div>
            </div>

            <div className="space-y-4 min-h-[400px]">
                {loading ? (
                    <div className="text-[var(--admin-text)]/60 text-sm flex items-center justify-center py-12">Loading activity...</div>
                ) : logs.length === 0 ? (
                    <div className="text-[var(--admin-text)]/60 text-sm flex items-center justify-center py-12 bg-[var(--admin-text)]/5 rounded-[8px] border border-dashed border-[var(--admin-border)]">No recent activity found.</div>
                ) : (
                    <div className="space-y-2">
                        {logs.map((log) => (
                            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 hover:bg-[var(--admin-text)]/5 rounded-[8px] transition-colors border-l-2 border-transparent hover:border-gold">
                                <div className="text-xs font-mono text-[var(--admin-text)]/60 shrink-0 sm:w-32">
                                    {new Date(log.createdAt).toLocaleDateString()} <span className="sm:hidden">•</span> <br className="hidden sm:block"/>
                                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-[var(--admin-text)] font-bold">{formatAction(log.action)}</p>
                                    {log.metadata && (
                                        <p className="text-xs text-[var(--admin-text)]/70 font-mono mt-1 break-all bg-[var(--admin-text)]/5 p-1.5 rounded-[4px] border border-[var(--admin-border)]/50 inline-block max-w-full">
                                            {JSON.stringify(log.metadata).substring(0, 150)}
                                            {JSON.stringify(log.metadata).length > 150 ? "..." : ""}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!loading && meta.totalPages > 1 && (
                <div className="pt-4 border-t border-[var(--admin-border)]">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}

function formatAction(action: string) {
    return action.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
