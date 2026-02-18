"use client";

import { getUserActivity } from "@/actions/profile";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

export default function ActivityPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await getUserActivity();
                setLogs(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    return (
            <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 w-full space-y-6">
                 <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                    <Activity size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[var(--admin-text)]">Recent Activity</h3>
                    <p className="text-xs text-[var(--admin-text)]/80">Your recent actions across the platform.</p>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-[var(--admin-text)]/60 text-sm">Loading activity...</div>
                ) : logs.length === 0 ? (
                    <div className="text-[var(--admin-text)]/60 text-sm">No recent activity found.</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="flex gap-4 p-3 hover:bg-[var(--admin-text)]/5 rounded-[8px] transition-colors border-l-2 border-transparent hover:border-gold">
                            <div className="text-xs font-mono text-[var(--admin-text)]/60 pt-1 shrink-0 w-24">
                                {new Date(log.createdAt).toLocaleDateString()} <br/>
                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div>
                                <p className="text-sm text-[var(--admin-text)] font-medium">{formatAction(log.action)}</p>
                                {log.metadata && (
                                    <p className="text-xs text-[var(--admin-text)]/80 font-mono mt-0.5">
                                        {JSON.stringify(log.metadata).substring(0, 100)}
                                        {JSON.stringify(log.metadata).length > 100 ? "..." : ""}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function formatAction(action: string) {
    return action.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
