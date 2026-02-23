"use client";

import { deleteAllReadNotifications, deleteNotification, getNotifications, markAllNotificationsRead, markNotificationRead } from "@/actions/notifications";
import { useToast } from "@/components/admin/ui/Toast";
import { Notification, NotificationPriority, NotificationType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, CheckCircle2, ChevronRight, Info, ShieldAlert, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types for UI
type NotificationItem = Notification;

export function NotificationBell() {
    const router = useRouter();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [unread, setUnread] = useState<NotificationItem[]>([]);
    const [read, setRead] = useState<NotificationItem[]>([]);
    const [totalUnread, setTotalUnread] = useState(0);
    
    // Polling refs
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isTabActiveRef = useRef(true);
    
    // Fetch Data
    const fetchData = async () => {
        try {
            const data = await getNotifications();
            setUnread(data.unread);
            setRead(data.read);
            setTotalUnread(data.totalUnread);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    // Polling Setup
    useEffect(() => {
        // Initial fetch
        fetchData();

        const handleVisibilityChange = () => {
            isTabActiveRef.current = !document.hidden;
            if (isTabActiveRef.current) {
                // Resume polling immediately on focus
                fetchData();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Adaptive Polling
        // If unread > 0, poll faster (20s). If 0, poll slower (45s).
        const intervalTime = totalUnread > 0 ? 20000 : 45000;
        
        pollingIntervalRef.current = setInterval(() => {
            if (isTabActiveRef.current) {
                fetchData();
            }
        }, intervalTime);

        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [totalUnread]); // Re-run effect when priority changes (adaptive)

    // Watcher for New Proactive Notifications
    const prevUnreadCountRef = useRef(totalUnread);
    useEffect(() => {
        if (totalUnread > prevUnreadCountRef.current && unread.length > 0) {
             // A new notification arrived! Fire toast for the newest item.
             const newest = unread[0]; // Since it returns ordered by desc
             
             // Map Prisma severity to Toast severity
             let toastType: "info" | "success" | "warning" | "error" = "info";
             if (newest.type === "SUCCESS") toastType = "success";
             if (newest.type === "ERROR") toastType = "error";
             if (newest.priority === "HIGH" || newest.priority === "CRITICAL" || newest.type === "WARNING") toastType = "info";

             toast(
                 `${newest.title}: ${newest.message.substring(0, 50)}${newest.message.length > 50 ? '...' : ''}`,
                 toastType
             );
        }
        prevUnreadCountRef.current = totalUnread;
    }, [totalUnread, unread, toast]);

    // Handlers
    const handleMarkRead = async (id: string, link: string | null) => {
        // Optimistic update
        const target = unread.find(n => n.id === id);
        if (target) {
            setUnread(prev => prev.filter(n => n.id !== id));
            setRead(prev => [target, ...prev]);
            setTotalUnread(prev => Math.max(0, prev - 1));
        }

        try {
            await markNotificationRead(id);
            if (link) {
                router.push(link);
                setIsOpen(false);
            }
        } catch (e) {
            // Rollback (simplified, typically just refetch)
            fetchData();
        }
    };

    const handleMarkAllRead = async () => {
        // Optimistic
        setRead(prev => [...unread, ...prev]);
        setUnread([]);
        setTotalUnread(0);

        try {
            await markAllNotificationsRead();
        } catch (e) {
            fetchData();
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string, isRead: boolean) => {
        e.stopPropagation();
        // Optimistic delete
        if (isRead) {
            setRead(prev => prev.filter(n => n.id !== id));
        } else {
            setUnread(prev => prev.filter(n => n.id !== id));
            setTotalUnread(prev => Math.max(0, prev - 1));
        }

        try {
            await deleteNotification(id);
        } catch (err) {
            fetchData();
        }
    };

    const handleClearRead = async () => {
        // Optimistic clear
        setRead([]);

        try {
            await deleteAllReadNotifications();
        } catch (err) {
            fetchData();
        }
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "SUCCESS": return <CheckCircle2 size={16} className="text-green-500" />;
            case "WARNING": return <ShieldAlert size={16} className="text-yellow-500" />;
            case "ERROR": return <XCircle size={16} className="text-red-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    const getPriorityStyle = (priority: NotificationPriority) => {
        switch (priority) {
            case "CRITICAL": return "border-l-2 border-destructive bg-destructive/10";
            case "HIGH": return "border-l-2 border-yellow-500 bg-yellow-500/10";
            default: return "border-l-2 border-transparent hover:bg-muted";
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gold hover:text-gold/80 transition-colors p-2 rounded-full hover:bg-[var(--admin-text)]/5"
            >
                <Bell size={20} />
                {totalUnread > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border border-background flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-[90vw] sm:w-96 bg-white dark:bg-black border border-[var(--admin-border)] shadow-2xl rounded-xl overflow-hidden z-50 origin-top-right"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-[var(--admin-border)] bg-gray-50 dark:bg-[#0a0a0a]">
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-[var(--admin-text)] flex items-center gap-2">
                                    Notifications 
                                    {totalUnread > 0 && <span className="bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-full">{totalUnread}</span>}
                                </h3>
                                <div className="flex gap-3">
                                    {read.length > 0 && (
                                        <button 
                                            onClick={handleClearRead}
                                            className="text-[11px] uppercase font-bold text-zinc-500 hover:text-destructive transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 size={12} /> Clear read
                                        </button>
                                    )}
                                    {totalUnread > 0 && (
                                        <button 
                                            onClick={handleMarkAllRead}
                                            className="text-[11px] uppercase font-bold text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                                        >
                                            <Check size={14} /> Mark all read
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* List */}
                            <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                                {unread.length === 0 && read.length === 0 ? (
                                    <div className="p-12 text-center text-zinc-500 dark:text-[var(--admin-muted)] flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center mb-1">
                                            <Bell size={20} className="opacity-50" />
                                        </div>
                                        <p className="text-sm font-medium">All caught up!</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        {/* Unread Section */}
                                        {unread.length > 0 && (
                                            <div className="flex flex-col">
                                                {unread.map(n => (
                                                    <div 
                                                        key={n.id}
                                                        onClick={() => handleMarkRead(n.id, n.link)}
                                                        className={`p-4 border-b border-[var(--admin-border)] cursor-pointer group flex gap-3 items-start transition-colors ${getPriorityStyle(n.priority)}`}
                                                    >
                                                        <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                                                    <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-[var(--admin-text)] group-hover:text-gold transition-colors truncate pr-2">{n.title}</h4>
                                                                <span className="text-[10px] text-zinc-500 dark:text-[var(--admin-muted)] whitespace-nowrap shrink-0">
                                                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-zinc-500 dark:text-[var(--admin-muted)] line-clamp-2 leading-relaxed">{n.message}</p>
                                                        </div>
                                                        {n.link && (
                                                            <ChevronRight size={14} className="text-zinc-900/40 dark:text-[var(--admin-text)]/30 self-center group-hover:text-gold transition-colors shrink-0 mx-1" />
                                                        )}
                                                        <button 
                                                            onClick={(e) => handleDelete(e, n.id, false)}
                                                            className="text-zinc-400 hover:text-destructive transition-colors self-center p-1 rounded hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100"
                                                            title="Delete Notification"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Read Section Header */}
                                        {read.length > 0 && (
                                            <>
                                                {unread.length > 0 && (
                                                    <div className="px-4 py-2 bg-gray-50 dark:bg-[#0a0a0a] text-[10px] font-bold text-zinc-500 dark:text-muted-foreground uppercase tracking-wider sticky top-0 border-y border-[var(--admin-border)]">
                                                        Recent History
                                                    </div>
                                                )}
                                                
                                                {/* Read Section */}
                                                {read.map(n => (
                                                    <div 
                                                        key={n.id}
                                                        className="p-4 border-b border-[var(--admin-border)] bg-transparent opacity-60 hover:opacity-100 transition-opacity flex gap-3 group hover:bg-zinc-900/5 dark:hover:bg-[var(--admin-text)]/5"
                                                    >
                                                        <div className="mt-0.5 grayscale opacity-50 shrink-0">{getIcon(n.type)}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <h4 className="text-sm font-medium text-zinc-900/80 dark:text-[var(--admin-text)]/80">{n.title}</h4>
                                                                <span className="text-[10px] text-zinc-500 dark:text-[var(--admin-muted)]">
                                                                    {new Date(n.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-zinc-500 dark:text-[var(--admin-muted)] line-clamp-1">{n.message}</p>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => handleDelete(e, n.id, true)}
                                                            className="text-zinc-400 hover:text-destructive transition-colors self-center p-1 rounded hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100"
                                                            title="Delete Notification"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
