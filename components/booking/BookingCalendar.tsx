"use client";

import { BOOKING_CONFIG, getCurrentEATDate } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import React, { useMemo } from "react";

interface BookingCalendarProps {
    selectedDate: string; // YYYY-MM-DD
    onSelectDate: (dateStr: string) => void;
    currentMonth: Date;
    onMonthChange: (newMonth: Date) => void;
    blockedDatesSet?: Set<string>; // YYYY-MM-DD
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
    selectedDate,
    onSelectDate,
    currentMonth,
    onMonthChange,
    blockedDatesSet = new Set(),
}) => {
    // Current date in EAT
    const todayEAT = useMemo(() => {
        const d = getCurrentEATDate();
        return d.toISOString().split("T")[0];
    }, []);

    // Max selectable date (30 days rolling)
    const maxDateStr = useMemo(() => {
        const d = getCurrentEATDate();
        d.setDate(d.getDate() + BOOKING_CONFIG.MAX_BOOKING_DAYS_AHEAD);
        return d.toISOString().split("T")[0];
    }, []);

    // Year and Month details
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0-indexed

    const monthName = currentMonth.toLocaleString("en-US", { month: "long" });

    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // First day of month (0 = Sun, 1 = Mon ... 6 = Sat)
    // We display Mon-Sun (0 = Mon, 6 = Sun)
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Align Mon to 0

    const prevMonthDays = new Date(year, month, 0).getDate();

    const handlePrevMonth = () => {
        const prev = new Date(year, month - 1, 1);
        const currentEAT = getCurrentEATDate();
        if (prev.getFullYear() < currentEAT.getFullYear() || 
           (prev.getFullYear() === currentEAT.getFullYear() && prev.getMonth() < currentEAT.getMonth())) {
            return; // Don't navigate to past months
        }
        onMonthChange(prev);
    };

    const handleNextMonth = () => {
        const next = new Date(year, month + 1, 1);
        onMonthChange(next);
    };

    const handleQuickToday = () => {
        const currentEAT = getCurrentEATDate();
        onMonthChange(new Date(currentEAT.getFullYear(), currentEAT.getMonth(), 1));
        onSelectDate(todayEAT);
    };

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header: Month & Navigation Controls */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                        <span>{monthName}</span>
                        <span className="text-primary font-bold">{year}</span>
                    </h3>
                    <p className="text-xs text-foreground/80 font-medium mt-0.5">
                        Operating Hours: Mon–Thu 9am–5pm · Fri 9am–12pm EAT
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleQuickToday}
                        className="text-xs font-bold px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-all text-foreground"
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-colors text-foreground"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-colors text-foreground"
                        aria-label="Next Month"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="w-full">
                {/* Weekday Labels */}
                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                    {weekDays.map((day, idx) => (
                        <div
                            key={day}
                            className={cn(
                                "text-xs font-black uppercase tracking-wider py-1.5",
                                idx >= 5 ? "text-foreground/50" : "text-primary font-bold"
                            )}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {/* Previous Month Padding Days */}
                    {Array.from({ length: offset }).map((_, i) => {
                        const dayNum = prevMonthDays - offset + i + 1;
                        return (
                            <div
                                key={`prev-${i}`}
                                className="h-12 sm:h-14 md:h-16 rounded-xl border border-transparent p-1.5 opacity-25 text-muted-foreground flex flex-col justify-between"
                            >
                                <span className="text-xs font-medium">{dayNum}</span>
                            </div>
                        );
                    })}

                    {/* Current Month Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const dateObj = new Date(Date.UTC(year, month, dayNum));
                        const dateStr = dateObj.toISOString().split("T")[0];
                        const dayOfWeek = dateObj.getUTCDay(); // 0 = Sun, 6 = Sat

                        const isPast = dateStr < todayEAT;
                        const isTooFar = dateStr > maxDateStr;
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        const isBlocked = blockedDatesSet.has(dateStr);
                        const isFriday = dayOfWeek === 5;

                        const isDisabled = isPast || isTooFar || isWeekend || isBlocked;
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateStr === todayEAT;

                        return (
                            <motion.button
                                key={dateStr}
                                type="button"
                                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                whileTap={!isDisabled ? { scale: 0.96 } : {}}
                                disabled={isDisabled}
                                onClick={() => onSelectDate(dateStr)}
                                className={cn(
                                    "relative h-12 sm:h-14 md:h-16 rounded-xl p-1.5 sm:p-2 text-left flex flex-col justify-between transition-all border",
                                    // Default open day
                                    !isDisabled && !isSelected && "bg-card hover:bg-primary/10 border-border hover:border-primary text-foreground cursor-pointer shadow-sm",
                                    // Selected
                                    isSelected && "bg-primary text-primary-foreground font-black border-primary ring-2 sm:ring-4 ring-primary/30 shadow-lg scale-105 z-10",
                                    // Disabled (Weekend, Holiday, Past)
                                    isDisabled && "bg-muted/15 border-transparent text-foreground/35 cursor-not-allowed opacity-60",
                                    // Today Ring
                                    isToday && !isSelected && "border-primary/80 ring-1 ring-primary/40 font-bold"
                                )}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className={cn(
                                        "text-xs sm:text-sm font-bold",
                                        isSelected ? "text-primary-foreground font-black" : "text-foreground"
                                    )}>
                                        {dayNum}
                                    </span>

                                    {/* Indicators */}
                                    {isBlocked && (
                                        <Lock size={12} className="text-foreground/70" />
                                    )}
                                    {isFriday && !isDisabled && !isSelected && (
                                        <span className="hidden sm:inline-block text-[9px] font-black uppercase text-primary/80">
                                             ½d
                                        </span>
                                    )}
                                </div>

                                {/* Status Dot / Label */}
                                <div className="flex items-center justify-between">
                                    {isWeekend ? (
                                        <span className="text-[10px] text-foreground/50 font-medium hidden sm:inline">Off</span>
                                    ) : isBlocked ? (
                                        <span className="text-[10px] text-foreground/70 font-semibold hidden sm:inline">Closed</span>
                                    ) : isPast ? (
                                        <span className="text-[10px] text-foreground/40 hidden sm:inline">—</span>
                                    ) : isSelected ? (
                                        <span className="text-[10px] font-bold text-primary-foreground">Selected</span>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                            <span className="text-[9px] text-foreground/75 font-semibold hidden md:inline">Open</span>
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/80 font-medium border-t border-border/40 pt-4">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Lock size={12} className="text-foreground/80" />
                    <span>Office Closed / Holiday</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-primary font-bold text-[10px]">½d</span>
                    <span>Friday (9am–12pm)</span>
                </div>
            </div>
        </div>
    );
};

export default BookingCalendar;
