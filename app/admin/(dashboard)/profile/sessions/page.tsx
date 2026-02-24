"use client";

import { exportSessionsCsv, getSessions, revokeAllOtherSessions, revokeSession } from "@/actions/auth";
import { Button } from "@/components/admin/ui";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { Pagination } from "@/components/admin/ui/Pagination";
import { Download, Laptop, Phone, TabletSmartphone, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Session {
    id: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    expiresAt: Date;
    token: string;
}

export default function SessionsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const pageParam = searchParams.get("page") || "1";
    const currentPage = parseInt(pageParam, 10) || 1;

    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => void;
    }>({ isOpen: false, title: "", description: "", action: () => {} });

    const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await getSessions(currentPage, 10);
            setSessions(res.data);
            setMeta({ totalPages: res.totalPages, total: res.total });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [currentPage]);


    const handleRevoke = async (id: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Revoke Session",
            description: "Are you sure you want to forcibly logout this device? They will be immediately disconnected.",
            action: async () => {
                closeConfirm();
                try {
                    const res = await revokeSession(id);
                    if (!res.success) throw new Error(res.message);
                    setSessions(prev => prev.filter(s => s.id !== id));
                } catch (error: any) {
                    alert(error.message || "Failed to revoke session");
                }
            }
        });
    };

    const handleRevokeAllOthers = async () => {
        setConfirmConfig({
            isOpen: true,
            title: "Revoke All Devices",
            description: "Are you sure? This will log you out of absolutely every other device instantly. You will only remain logged in here.",
            action: async () => {
                closeConfirm();
                setRevoking(true);
                try {
                    const result = await revokeAllOtherSessions();
                    if (!result.success) throw new Error(result.message);
                    await fetchSessions();
                } catch (error: any) {
                    alert(error.message || "Failed to revoke sessions. Please try again.");
                    console.error(error);
                } finally {
                    setRevoking(false);
                }
            }
        });
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const csv = await exportSessionsCsv();
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `my-sessions-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e: any) {
            alert("Export failed: " + e.message);
        } finally {
            setIsExporting(false);
        }
    };

    const getDeviceIcon = (ua: string | null) => {
        if (!ua) return <Laptop size={20} />;
        if (ua.toLowerCase().includes("mobile")) return <Phone size={20} />;
        if (ua.toLowerCase().includes("tablet")) return <TabletSmartphone size={20} />;
        return <Laptop size={20} />;
    };

    return (
        <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 w-full space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20 shrink-0">
                        <TabletSmartphone size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-[var(--admin-text)]">Active Sessions</h3>
                        <p className="text-xs text-[var(--admin-text)]">Manage devices logged into your account.</p>
                    </div>
                </div>

                <Button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="h-[36px] px-3 whitespace-nowrap text-xs shrink-0 w-fit"
                >
                    {isExporting ? "Exporting..." : <><Download size={14} className="mr-1.5" /> Export CSV</>}
                </Button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-[var(--admin-text)] text-sm flex items-center justify-center py-12">Loading active sessions...</div>
                ) : sessions.length === 0 ? (
                    <div className="text-[var(--admin-text)] text-sm flex items-center justify-center py-12 bg-[var(--admin-text)]/5 rounded-[8px] border border-dashed border-[var(--admin-border)]">No active sessions found.</div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 admin-surface-input p-4 rounded-[10px] hover:bg-[var(--admin-text)]/5 transition-colors">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="p-3 admin-surface-primary rounded-full text-[var(--admin-text)] shrink-0">
                                        {getDeviceIcon(session.userAgent)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-[var(--admin-text)] break-all">{session.ipAddress || "Unknown IP"}</p>
                                        <p className="text-xs text-[var(--admin-text)] line-clamp-2 sm:line-clamp-1 max-w-full sm:max-w-[200px] md:max-w-md" title={session.userAgent || ""}>
                                            {session.userAgent || "Unknown Device"}
                                        </p>
                                        <p className="text-[10px] text-[var(--admin-text)] mt-1">
                                            Started: {new Date(session.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="w-full sm:w-auto"
                                    onClick={() => handleRevoke(session.id)}
                                    title="Revoke Session"
                                >
                                    <Trash2 size={14} className="sm:mr-0 mr-1.5" /> <span className="sm:hidden">Revoke</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {meta.totalPages > 1 && (
                <div className="pt-4 border-t border-[var(--admin-border)] flex justify-center">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
            
            {meta.total > 1 && (
                <div className="pt-4 border-t border-[var(--admin-border)] flex justify-end">
                    <Button 
                        variant="destructive" 
                        onClick={handleRevokeAllOthers}
                        disabled={revoking}
                    >
                        {revoking ? "Revoking..." : "Revoke All Other Sessions"}
                    </Button>
                </div>
            )}

            <ConfirmModal
              isOpen={confirmConfig.isOpen}
              onClose={closeConfirm}
              onConfirm={confirmConfig.action}
              title={confirmConfig.title}
              description={confirmConfig.description}
              confirmText="Revoke"
              isDestructive={true}
            />
        </div>
    );
}
