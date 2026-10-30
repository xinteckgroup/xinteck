"use client";

import { formatTime12h, getCurrentEATDate } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { BookingStatus, Role } from "@prisma/client";
import { motion } from "framer-motion";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Lock,
    Plus,
    UserCheck,
    Video,
} from "lucide-react";
import React, { useMemo, useState } from "react";

interface AdminBookingCalendarProps {
    bookings: any[];
    blockedDates: { id: string; dateFormatted: string; reason?: string | null }[];
    onSelectBooking: (booking: any) => void;
    onAddBlockedDate: (dateStr: string) => void;
    userRole: string;
}

export const AdminBookingCalendar: React.FC<AdminBookingCalendarProps> = ({
    bookings,
    blockedDates,
    onSelectBooking,
    onAddBlockedDate,
    userRole,
}) => {
    const isAdminOrSuper = userRole === Role.SUPER_ADMIN || userRole === Role.ADMIN;

    const [currentMonth, setCurrentMonth] = useState<Date>(() => {
        const d = getCurrentEATDate();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });

    const [focusedDate, setFocusedDate] = useState<string>(() => {
        return getCurrentEATDate().toISOString().split("T")[0];
    });

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthName = currentMonth.toLocaleString("en-US", { month: "long" });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon = 0
    const prevMonthDays = new Date(year, month, 0).getDate();

    const todayStr = useMemo(() => {
        return getCurrentEATDate().toISOString().split("T")[0];
    }, []);

    // Map bookings by date string (YYYY-MM-DD)
    const bookingsByDate = useMemo(() => {
        const map = new Map<string, any[]>();
        for (const b of bookings) {
            const d = b.dateFormatted || b.date?.toString().split("T")[0];
            if (d) {
                if (!map.has(d)) map.set(d, []);
                map.get(d)!.push(b);
            }
        }
        return map;
    }, [bookings]);

    // Map blocked dates
    const blockedMap = useMemo(() => {
        const map = new Map<string, string>();
        for (const b of blockedDates) {
            map.set(b.dateFormatted, b.reason || "Closed");
        }
        return map;
    }, [blockedDates]);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const handleQuickToday = () => {
        const currentEAT = getCurrentEATDate();
        setCurrentMonth(new Date(currentEAT.getFullYear(), currentEAT.getMonth(), 1));
        setFocusedDate(todayStr);
    };

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const focusedDateBookings = useMemo(() => {
        return bookingsByDate.get(focusedDate) || [];
    }, [bookingsByDate, focusedDate]);

    // Status pill style
    const getStatusStyle = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING:
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            case BookingStatus.CONFIRMED:
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case BookingStatus.COMPLETED:
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case BookingStatus.CANCELLED:
                return "bg-rose-500/20 text-rose-400 border-rose-500/30 line-through";
            case BookingStatus.NO_SHOW:
                return "bg-purple-500/20 text-purple-400 border-purple-500/30";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header: Month & Navigation Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                        <span>{monthName}</span>
                        <span className="text-primary font-bold">{year}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Interactive appointment schedule · Click any date or call chip to manage
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleQuickToday}
                        className="text-xs font-bold px-3 py-1.5 rounded-full border border-border/60 hover:border-primary hover:text-primary transition-all text-muted-foreground cursor-pointer"
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg border border-border/60 hover:border-primary hover:bg-primary/10 transition-colors text-foreground cursor-pointer"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg border border-border/60 hover:border-primary hover:bg-primary/10 transition-colors text-foreground cursor-pointer"
                        aria-label="Next Month"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Layout: Calendar Grid (Left) + Selected Day Agenda Panel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* CALENDAR GRID */}
                <div className="lg:col-span-8 bg-card border border-border/60 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-3">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                        {weekDays.map((d, i) => (
                            <div
                                key={d}
                                className={cn(
                                    "text-xs font-black uppercase tracking-wider py-1.5",
                                    i >= 5 ? "text-muted-foreground/50" : "text-primary/90"
                                )}
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Day Cells */}
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                        {/* Prev month padding */}
                        {Array.from({ length: offset }).map((_, i) => (
                            <div
                                key={`prev-${i}`}
                                className="min-h-[75px] sm:min-h-[90px] rounded-xl border border-transparent p-1 opacity-20 text-muted-foreground text-xs font-medium"
                            >
                                {prevMonthDays - offset + i + 1}
                            </div>
                        ))}

                        {/* Current month days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const dateObj = new Date(Date.UTC(year, month, dayNum));
                            const dateStr = dateObj.toISOString().split("T")[0];
                            const dayOfWeek = dateObj.getUTCDay();

                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            const isBlocked = blockedMap.has(dateStr);
                            const blockedReason = blockedMap.get(dateStr);
                            const dayBookings = bookingsByDate.get(dateStr) || [];

                            const isToday = dateStr === todayStr;
                            const isFocused = dateStr === focusedDate;

                            return (
                                <div
                                    key={dateStr}
                                    onClick={() => setFocusedDate(dateStr)}
                                    className={cn(
                                        "min-h-[85px] sm:min-h-[105px] rounded-xl p-1.5 text-left flex flex-col justify-between transition-all border relative group cursor-pointer",
                                        // Default cell
                                        !isBlocked && !isWeekend && "bg-muted/5 hover:bg-muted/15 border-border/40 hover:border-primary/60",
                                        // Weekend
                                        isWeekend && "bg-muted/5 border-transparent text-muted-foreground/40",
                                        // Blocked
                                        isBlocked && "bg-rose-500/5 border-rose-500/20 text-rose-400/80",
                                        // Focused
                                        isFocused && "ring-2 ring-primary border-primary bg-primary/5",
                                        // Today ring
                                        isToday && !isFocused && "ring-1 ring-primary/60"
                                    )}
                                >
                                    {/* Day Header */}
                                    <div className="flex items-center justify-between w-full">
                                        <span className={cn(
                                            "text-xs font-black",
                                            isFocused ? "text-primary" : "text-foreground"
                                        )}>
                                            {dayNum}
                                        </span>

                                        {/* Booking count badge */}
                                        {dayBookings.length > 0 && (
                                            <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.2 rounded-full">
                                                {dayBookings.length}
                                            </span>
                                        )}

                                        {isBlocked && (
                                            <Lock size={12} className="text-rose-400 shrink-0" />
                                        )}
                                    </div>

                                    {/* Appointment Chips in cell */}
                                    <div className="flex flex-col gap-1 overflow-hidden my-1">
                                        {dayBookings.slice(0, 2).map((b) => (
                                            <div
                                                key={b.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectBooking(b);
                                                }}
                                                className={cn(
                                                    "text-[10px] font-bold px-1.5 py-0.5 rounded border truncate cursor-pointer transition-transform hover:scale-105",
                                                    getStatusStyle(b.status)
                                                )}
                                                title={`${formatTime12h(b.startTime)} - ${b.name}`}
                                            >
                                                {formatTime12h(b.startTime)} {b.name.split(" ")[0]}
                                            </div>
                                        ))}

                                        {dayBookings.length > 2 && (
                                            <span className="text-[9px] text-muted-foreground font-bold">
                                                +{dayBookings.length - 2} more
                                            </span>
                                        )}

                                        {isBlocked && dayBookings.length === 0 && (
                                            <span className="text-[9px] text-rose-400/90 italic truncate">
                                                {blockedReason}
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover Quick Set Off-Day action */}
                                    {isAdminOrSuper && !isBlocked && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddBlockedDate(dateStr);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-primary hover:underline font-bold flex items-center gap-0.5 self-start cursor-pointer"
                                        >
                                            <Plus size={10} /> Off-Day
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SELECTED DAY TIMELINE & AGENDA DRAWER */}
                <div className="lg:col-span-4 bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                    <div className="border-b border-border/50 pb-3 flex items-center justify-between">
                        <div>
                            <span className="text-xs uppercase font-black tracking-widest text-primary">
                                Daily Agenda
                            </span>
                            <h4 className="text-base font-bold text-foreground mt-0.5">
                                📅 {focusedDate}
                            </h4>
                        </div>

                        {isAdminOrSuper && (
                            <button
                                type="button"
                                onClick={() => onAddBlockedDate(focusedDate)}
                                className="text-xs text-primary hover:text-primary-foreground hover:bg-primary border border-primary/40 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                                + Block Day
                            </button>
                        )}
                    </div>

                    {/* Bookings scheduled for this day */}
                    {focusedDateBookings.length === 0 ? (
                        <div className="py-10 text-center flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Clock size={28} className="text-muted-foreground/60" />
                            <p className="text-xs">No calls scheduled for this day.</p>
                            {blockedMap.has(focusedDate) && (
                                <p className="text-xs text-rose-400 font-bold">
                                    ⚠️ Office Closed: {blockedMap.get(focusedDate)}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                            {focusedDateBookings.map((b) => (
                                <div
                                    key={b.id}
                                    onClick={() => onSelectBooking(b)}
                                    className="p-3.5 rounded-xl bg-muted/15 hover:bg-muted/25 border border-border/60 hover:border-primary/60 transition-all flex flex-col gap-2 cursor-pointer shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-foreground">
                                            ⏰ {formatTime12h(b.startTime)} – {formatTime12h(b.endTime)}
                                        </span>
                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", getStatusStyle(b.status))}>
                                            {b.status}
                                        </span>
                                    </div>

                                    <div>
                                        <h5 className="text-sm font-bold text-foreground truncate">
                                            {b.name}
                                        </h5>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {b.company ? `${b.company} · ` : ""}{b.service || "Discovery Call"}
                                        </p>
                                    </div>

                                    {b.meetLink && (
                                        <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                                            <Video size={13} />
                                            <span className="truncate">{b.meetLink}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                                        <span className="flex items-center gap-1">
                                            <UserCheck size={12} className="text-primary" />
                                            {b.assignedTo ? b.assignedTo.name : "Unassigned"}
                                        </span>
                                        <span className="text-primary font-bold hover:underline">
                                            View Details →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookingCalendar;
