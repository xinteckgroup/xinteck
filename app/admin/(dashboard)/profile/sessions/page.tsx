"use client";

import { getSessions, revokeAllOtherSessions, revokeSession } from "@/actions/auth";
import { Button } from "@/components/admin/ui";
import { Laptop, Phone, TabletSmartphone, Trash2 } from "lucide-react";
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
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState(false);

    const fetchSessions = async () => {
        try {
            const data = await getSessions();
            setSessions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id: string) => {
        if (!confirm("Are you sure you want to revoke this session?")) return;
        try {
            const res = await revokeSession(id);
            if (!res.success) throw new Error(res.message);
            setSessions(prev => prev.filter(s => s.id !== id));
        } catch (error: any) {
            alert(error.message || "Failed to revoke session");
        }
    };

    const handleRevokeAllOthers = async () => {
        if (!confirm("Are you sure? This will log you out of all other devices.")) return;
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
    };

    const getDeviceIcon = (ua: string | null) => {
        if (!ua) return <Laptop size={20} />;
        if (ua.toLowerCase().includes("mobile")) return <Phone size={20} />;
        if (ua.toLowerCase().includes("tablet")) return <TabletSmartphone size={20} />;
        return <Laptop size={20} />;
    };

    return (
        <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 w-full space-y-6">
             <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                    <TabletSmartphone size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[var(--admin-text)]">Active Sessions</h3>
                    <p className="text-xs text-[var(--admin-text)]">Manage devices logged into your account.</p>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-[var(--admin-text)] text-sm">Loading active sessions...</div>
                ) : sessions.length === 0 ? (
                    <div className="text-[var(--admin-text)] text-sm">No active sessions found.</div>
                ) : (
                    sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between admin-surface-input p-4 rounded-[10px] hover:bg-[var(--admin-text)]/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 admin-surface-primary rounded-full text-[var(--admin-text)]">
                                    {getDeviceIcon(session.userAgent)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[var(--admin-text)] break-all">{session.ipAddress || "Unknown IP"}</p>
                                    <p className="text-xs text-[var(--admin-text)] line-clamp-1 max-w-[200px] md:max-w-md" title={session.userAgent || ""}>
                                        {session.userAgent || "Unknown Device"}
                                    </p>
                                    <p className="text-[10px] text-[var(--admin-text)] mt-1">
                                        Started: {new Date(session.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleRevoke(session.id)}
                                title="Revoke Session"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    ))
                )}
            </div>
            
            {sessions.length > 1 && (
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
        </div>
    );
}
