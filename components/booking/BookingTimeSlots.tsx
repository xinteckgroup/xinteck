"use client";

import { formatTime12h, TimeSlot } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Clock, Globe, Loader2, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";

interface BookingTimeSlotsProps {
    selectedDate: string; // YYYY-MM-DD
    slots: TimeSlot[];
    loading: boolean;
    selectedSlot: string | null; // startTime e.g. "09:00"
    onSelectSlot: (startTime: string) => void;
    isHalfDay?: boolean;
    isBlocked?: boolean;
    blockedReason?: string;
}

export const BookingTimeSlots: React.FC<BookingTimeSlotsProps> = ({
    selectedDate,
    slots,
    loading,
    selectedSlot,
    onSelectSlot,
    isHalfDay = false,
    isBlocked = false,
    blockedReason,
}) => {
    // Detect visitor's local browser timezone
    const [localTimezone, setLocalTimezone] = useState<string>("UTC");
    const [localTimeExample, setLocalTimeExample] = useState<string>("");

    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setLocalTimezone(tz);

            // Compute local time example for 10:10 AM EAT
            const now = new Date();
            const localStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
            setLocalTimeExample(localStr);
        } catch {
            setLocalTimezone("UTC");
        }
    }, []);

    const formattedDateHeader = React.useMemo(() => {
        if (!selectedDate) return "";
        try {
            const [y, m, d] = selectedDate.split("-").map(Number);
            const dateObj = new Date(Date.UTC(y, m - 1, d));
            return dateObj.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
            });
        } catch {
            return selectedDate;
        }
    }, [selectedDate]);

    return (
        <div className="w-full flex flex-col gap-5">
            {/* Header: Date + Dual Timezone banner */}
            <div className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-black tracking-widest text-primary">
                        Step 2 · Pick a Time Slot
                    </span>
                    <span className="text-xs text-foreground/80 font-bold flex items-center gap-1">
                        <Clock size={13} className="text-primary" />
                        15-min call
                    </span>
                </div>
                <h4 className="text-xl font-bold text-foreground mt-1">
                    {formattedDateHeader || "Select a date on calendar"}
                </h4>

                {/* Local Timezone Indicator */}
                <div className="mt-2.5 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground/80 font-medium">
                    <Globe size={14} className="text-primary shrink-0" />
                    <span>
                        Times in <strong className="text-foreground">East Africa Time (EAT)</strong> · Your local timezone:{" "}
                        <strong className="text-foreground">{localTimezone}</strong>
                    </span>
                </div>

                {isHalfDay && (
                    <div className="mt-2 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg px-3 py-1.5 font-medium">
                        ℹ️ Friday Operating Window: <strong>09:00 AM – 12:00 PM EAT</strong> (Half-day)
                    </div>
                )}
            </div>

            {/* Slots Loading State */}
            {loading ? (
                <div className="min-h-[260px] flex flex-col items-center justify-center gap-3 text-muted-foreground py-12">
                    <Loader2 size={32} className="animate-spin text-primary" />
                    <p className="text-sm">Fetching verified time slots...</p>
                </div>
            ) : isBlocked ? (
                /* Blocked / Closed State */
                <div className="min-h-[220px] flex flex-col items-center justify-center text-center p-6 bg-muted/10 border border-border/40 rounded-xl">
                    <Lock size={32} className="text-muted-foreground mb-3" />
                    <h5 className="text-base font-bold text-foreground">Date Unavailable</h5>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        {blockedReason || "Xinteck is closed on this day. Please pick another working day on the calendar."}
                    </p>
                </div>
            ) : slots.length === 0 ? (
                /* No Slots */
                <div className="min-h-[220px] flex flex-col items-center justify-center text-center p-6 bg-muted/10 border border-border/40 rounded-xl">
                    <Clock size={32} className="text-muted-foreground mb-3" />
                    <h5 className="text-base font-bold text-foreground">No Slots Available</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                        All call slots for this date are fully reserved. Please pick another date.
                    </p>
                </div>
            ) : (
                /* Interactive Slots Grid */
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                        {slots.map((slot, index) => {
                            const isSelected = selectedSlot === slot.startTime;
                            const isAvailable = slot.available;
                            const isBooked = slot.reason === "booked";
                            const isBufferBlocked = slot.reason === "buffer_blocked";

                            return (
                                <motion.button
                                    key={slot.startTime}
                                    type="button"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.02 }}
                                    disabled={!isAvailable}
                                    onClick={() => onSelectSlot(slot.startTime)}
                                    className={cn(
                                        "px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all font-sans",
                                        // Available & unselected
                                        isAvailable && !isSelected && "bg-card hover:bg-primary/10 border-border hover:border-primary text-foreground cursor-pointer group shadow-sm",
                                        // Selected
                                        isSelected && "bg-primary text-primary-foreground font-black border-primary shadow-lg ring-2 ring-primary/40 scale-[1.02]",
                                        // Booked
                                        isBooked && "bg-muted/20 border-border/40 text-foreground/40 line-through cursor-not-allowed opacity-60",
                                        // Same-day 2-hour buffer blocked
                                        isBufferBlocked && "bg-muted/15 border-transparent text-foreground/35 cursor-not-allowed opacity-50"
                                    )}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold tracking-tight">
                                            {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                                        </span>
                                        <span className="text-[10px] text-foreground/70 font-semibold">
                                            {isBooked ? "Reserved / Taken" : isBufferBlocked ? "Passed buffer" : "15 mins"}
                                        </span>
                                    </div>

                                    {/* Slot State Icon / Badge */}
                                    {isSelected ? (
                                        <span className="bg-primary-foreground text-primary p-1 rounded-full">
                                            <Check size={14} className="stroke-[3]" />
                                        </span>
                                    ) : isBooked ? (
                                        <span className="text-[11px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Lock size={10} /> Booked
                                        </span>
                                    ) : isBufferBlocked ? (
                                        <span className="text-[10px] text-foreground/50">Passed</span>
                                    ) : (
                                        <span className="text-[11px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            Select →
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    <p className="text-[11px] text-foreground/75 font-medium text-center mt-1">
                        ⚡ Each session includes a 20-minute gap between slots to guarantee zero meeting overruns.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookingTimeSlots;
