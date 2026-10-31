"use client";

import {
    addBlockedDate,
    removeBlockedDate,
    updateWeeklyAvailabilityDay,
} from "@/actions/bookings";
import { Role } from "@prisma/client";
import {
    AlertTriangle,
    Calendar,
    Check,
    Clock,
    Lock,
    Plus,
    Save,
    Trash2,
    X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface AvailabilityManagerProps {
    weeklyAvailability: any[];
    blockedDates: any[];
    userRole: string;
    onUpdated: () => void;
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
    weeklyAvailability,
    blockedDates,
    userRole,
    onUpdated,
}) => {
    const isSuperAdmin = userRole === Role.SUPER_ADMIN;
    const isAdminOrSuper = userRole === Role.SUPER_ADMIN || userRole === Role.ADMIN;

    // Off-Day Modal state
    const [showAddBlockedModal, setShowAddBlockedModal] = useState(false);
    const [blockedDateInput, setBlockedDateInput] = useState("");
    const [blockedReasonInput, setBlockedReasonInput] = useState("");
    const [collisionWarning, setCollisionWarning] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Weekly availability edit state
    const [editingAvailability, setEditingAvailability] = useState<any[]>(weeklyAvailability);

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Add Blocked Date / Off-Day
    const handleAddBlockedDate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blockedDateInput) return;

        setIsSaving(true);
        try {
            const res = await addBlockedDate({
                date: blockedDateInput,
                reason: blockedReasonInput.trim() || "Admin Day Off",
            });

            if (res.success) {
                if (res.conflictCount && res.conflictCount > 0) {
                    toast.warning(`Date blocked! Note: ${res.conflictCount} active call(s) were already scheduled on this day.`);
                } else {
                    toast.success("Date successfully blocked on calendar.");
                }
                setShowAddBlockedModal(false);
                setBlockedDateInput("");
                setBlockedReasonInput("");
                setCollisionWarning(null);
                onUpdated();
            } else {
                toast.error(res.error || "Failed to block date.");
            }
        } catch {
            toast.error("Error saving blocked date.");
        } finally {
            setIsSaving(false);
        }
    };

    // Remove Blocked Date
    const handleRemoveBlocked = async (id: string) => {
        if (!confirm("Are you sure you want to unblock this date and reopen time slots?")) return;

        try {
            const res = await removeBlockedDate(id);
            if (res.success) {
                toast.success("Date unblocked. Slots are now available.");
                onUpdated();
            } else {
                toast.error(res.error || "Failed to remove blocked date.");
            }
        } catch {
            toast.error("Error unblocking date.");
        }
    };

    // Save single day availability
    const handleSaveDayAvailability = async (dayItem: any) => {
        try {
            const res = await updateWeeklyAvailabilityDay({
                dayOfWeek: dayItem.dayOfWeek,
                startTime: dayItem.startTime,
                endTime: dayItem.endTime,
                isActive: dayItem.isActive,
            });

            if (res.success) {
                toast.success(`Updated hours for ${dayNames[dayItem.dayOfWeek]}.`);
                onUpdated();
            } else {
                toast.error(res.error || "Failed to update day hours.");
            }
        } catch {
            toast.error("Error updating working hours.");
        }
    };

    return (
        <div className="w-full flex flex-col gap-8">
            {/* 1. ADMIN OFF-DAYS & STATUTORY HOLIDAYS */}
            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                    <div>
                        <h4 className="text-lg font-black text-foreground flex items-center gap-2">
                            <Lock size={18} className="text-primary" />
                            <span>Off-Days & Blocked Dates</span>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Any date blocked here is instantly disabled on the customer booking calendar
                        </p>
                    </div>

                    {isAdminOrSuper && (
                        <button
                            type="button"
                            onClick={() => setShowAddBlockedModal(true)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer w-fit"
                        >
                            <Plus size={14} /> Set Day Off / Block Date
                        </button>
                    )}
                </div>

                {/* Blocked Dates List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {blockedDates.map((b) => (
                        <div
                            key={b.id}
                            className="p-3.5 rounded-xl bg-muted/10 border border-border/60 flex items-center justify-between gap-3"
                        >
                            <div className="flex items-center gap-2.5">
                                <Calendar size={16} className="text-primary shrink-0" />
                                <div>
                                    <span className="text-xs font-black text-foreground block">
                                        📅 {b.dateFormatted}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground truncate block max-w-[170px]">
                                        {b.reason || "Office Closed"}
                                    </span>
                                </div>
                            </div>

                            {isAdminOrSuper && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveBlocked(b.id)}
                                    className="text-muted-foreground hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                                    title="Unblock this date"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. WEEKLY WORKING HOURS (Super Admin Only) */}
            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="border-b border-border/50 pb-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-foreground flex items-center gap-2">
                            <Clock size={18} className="text-primary" />
                            <span>Weekly Working Hours & Slots Configuration</span>
                        </h4>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                            {isSuperAdmin ? "Super Admin Access" : "Read-Only (Super Admin)"}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Company operating window: Mon-Thu 09:00–17:00 EAT · Friday 09:00–12:00 EAT (Half-day) · Sat/Sun Closed
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {editingAvailability.map((item, index) => {
                        const dayName = dayNames[item.dayOfWeek];
                        const isFriday = item.dayOfWeek === 5;
                        const isWeekend = item.dayOfWeek === 0 || item.dayOfWeek === 6;

                        return (
                            <div
                                key={item.dayOfWeek}
                                className="p-4 rounded-xl bg-muted/10 border border-border/60 flex flex-col justify-between gap-3 min-w-0 overflow-hidden"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-bold text-foreground truncate">
                                        {dayName} {isFriday && <span className="text-[10px] text-primary font-semibold">(Half-day)</span>}
                                    </span>

                                    {isSuperAdmin ? (
                                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold cursor-pointer shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={item.isActive}
                                                onChange={(e) => {
                                                    const updated = [...editingAvailability];
                                                    updated[index].isActive = e.target.checked;
                                                    setEditingAvailability(updated);
                                                }}
                                                className="accent-primary"
                                            />
                                            <span>Active</span>
                                        </label>
                                    ) : (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                                            {item.isActive ? "Open" : "Closed"}
                                        </span>
                                    )}
                                </div>

                                {item.isActive ? (
                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs w-full min-w-0">
                                        <div className="flex-1 min-w-[105px]">
                                            <input
                                                type="time"
                                                disabled={!isSuperAdmin}
                                                value={item.startTime}
                                                onChange={(e) => {
                                                    const updated = [...editingAvailability];
                                                    updated[index].startTime = e.target.value;
                                                    setEditingAvailability(updated);
                                                }}
                                                className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none disabled:opacity-60 text-center"
                                            />
                                        </div>
                                        <span className="text-muted-foreground text-xs font-semibold shrink-0 text-center">to</span>
                                        <div className="flex-1 min-w-[105px]">
                                            <input
                                                type="time"
                                                disabled={!isSuperAdmin}
                                                value={item.endTime}
                                                onChange={(e) => {
                                                    const updated = [...editingAvailability];
                                                    updated[index].endTime = e.target.value;
                                                    setEditingAvailability(updated);
                                                }}
                                                className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none disabled:opacity-60 text-center"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic py-1">
                                        Closed for bookings
                                    </div>
                                )}

                                {isSuperAdmin && (
                                    <button
                                        type="button"
                                        onClick={() => handleSaveDayAvailability(item)}
                                        className="mt-auto pt-1 text-xs text-primary font-bold hover:text-primary/80 flex items-center gap-1.5 cursor-pointer w-fit transition-colors"
                                    >
                                        <Save size={13} /> Save {dayName}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ADD OFF-DAY MODAL */}
            {showAddBlockedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 text-foreground">
                        <div className="flex items-center justify-between border-b border-border/50 pb-3">
                            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                                <Lock size={16} className="text-primary" />
                                <span>Set Day Off / Block Date</span>
                            </h4>
                            <button
                                type="button"
                                onClick={() => setShowAddBlockedModal(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddBlockedDate} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">
                                    Date to Block <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={blockedDateInput}
                                    onChange={(e) => setBlockedDateInput(e.target.value)}
                                    className="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">
                                    Reason for Closure <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={blockedReasonInput}
                                    onChange={(e) => setBlockedReasonInput(e.target.value)}
                                    placeholder="e.g. Jamhuri Day, Annual Strategy Retreat, System Maintenance"
                                    className="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 leading-relaxed flex items-start gap-2">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <span>
                                    Blocking this date will instantly hide all slots on the client calendar. Any already scheduled appointments should be rescheduled or cancelled.
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                                <button
                                    type="button"
                                    onClick={() => setShowAddBlockedModal(false)}
                                    className="text-xs font-bold px-4 py-2 rounded-lg border border-border hover:bg-muted/20 text-muted-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-primary text-primary-foreground font-black text-xs uppercase px-4 py-2 rounded-lg shadow disabled:opacity-50"
                                >
                                    {isSaving ? "Blocking..." : "Block Date"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailabilityManager;
