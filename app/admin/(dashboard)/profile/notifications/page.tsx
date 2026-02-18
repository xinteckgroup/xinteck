"use client";

import { getNotificationPreferences, updateNotificationPreferences } from "@/actions/profile";
import { Bell, Mail, RefreshCw } from "lucide-react"; // Import spinner
import { useEffect, useState } from "react";

export default function NotificationsPage() {
    const [prefs, setPrefs] = useState({
        marketing: false,
        security: true,
        updates: true,
        comments: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getNotificationPreferences();
                if (data) setPrefs(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const toggle = async (key: keyof typeof prefs) => {
        const newPrefs = { ...prefs, [key]: !prefs[key] };
        setPrefs(newPrefs);
        setSaving(true);
        try {
            await updateNotificationPreferences(newPrefs);
        } catch (e) {
            console.error("Failed to save prefs", e);
            // Revert on failure
            setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
            alert("Failed to save preference.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 w-full space-y-6">
             <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4 justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20">
                        <Bell size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-[var(--admin-text)]">Notification Preferences</h3>
                        <p className="text-xs text-[var(--admin-text)]/80">Manage what emails you receive.</p>
                    </div>
                </div>
                {saving && <RefreshCw size={16} className="text-[var(--admin-text)] animate-spin" />}
            </div>

            {loading ? (
                <div className="text-[var(--admin-text)]/60 text-sm">Loading preferences...</div>
            ) : (
                <div className="space-y-2">
                    {[
                        { key: "security", label: "Security Alerts", desc: "Login attempts, password changes, and critical security issues.", icon: Bell },
                        { key: "updates", label: "System Updates", desc: "New features and maintenance windows.", icon: Bell },
                        { key: "comments", label: "New Comments", desc: "When someone comments on your blog posts.", icon: Mail },
                        { key: "marketing", label: "Marketing", desc: "Tips, newsletters, and promotional content.", icon: Mail },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-[8px] hover:bg-[var(--admin-text)]/5 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 ${prefs[item.key as keyof typeof prefs] ? "text-gold" : "text-[var(--admin-text)]/30"}`}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[var(--admin-text)]">{item.label}</p>
                                    <p className="text-xs text-[var(--admin-text)]/80">{item.desc}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggle(item.key as keyof typeof prefs)}
                                disabled={saving}
                                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${prefs[item.key as keyof typeof prefs] ? "bg-gold" : "admin-surface-input"}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${prefs[item.key as keyof typeof prefs] ? "translate-x-6" : "translate-x-0"}`} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
