"use client";

import { formatTime12h } from "@/lib/booking-utils";
import { ArrowRight, Calendar, CheckCircle2, Clock, Video } from "lucide-react";
import Link from "next/link";
import React from "react";

interface BookingsDashboardWidgetProps {
    stats: {
        pendingCount: number;
        confirmedCount: number;
        completedCount: number;
        todayCount: number;
        totalCount: number;
    };
    nextCall?: {
        name: string;
        date: string;
        startTime: string;
        service?: string;
    } | null;
}

export const BookingsDashboardWidget: React.FC<BookingsDashboardWidgetProps> = ({
    stats,
    nextCall,
}) => {
    return (
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-5 text-foreground relative overflow-hidden group">
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-400 to-primary/40" />

            <div>
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-1.5">
                        <Video size={14} /> Strategy Sessions
                    </span>

                    {stats.pendingCount > 0 ? (
                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                            {stats.pendingCount} Pending Action
                        </span>
                    ) : (
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={11} /> Up to Date
                        </span>
                    )}
                </div>

                <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-foreground tracking-tight">
                        {stats.todayCount}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                        calls scheduled today ({stats.confirmedCount} total confirmed)
                    </span>
                </div>

                {/* Next Upcoming Call Highlight */}
                {nextCall ? (
                    <div className="mt-4 p-3 rounded-xl bg-muted/15 border border-border/60 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                                Next Up
                            </span>
                            <span className="text-xs font-bold text-foreground">
                                {nextCall.name} · {formatTime12h(nextCall.startTime)} EAT
                            </span>
                        </div>
                        <span className="text-xs text-primary font-bold">
                            {nextCall.date}
                        </span>
                    </div>
                ) : (
                    <div className="mt-4 p-3 rounded-xl bg-muted/10 border border-border/40 text-xs text-muted-foreground flex items-center gap-2">
                        <Clock size={14} className="text-primary shrink-0" />
                        <span>No immediate calls awaiting action today.</span>
                    </div>
                )}
            </div>

            <Link
                href="/admin/bookings"
                className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1.5 pt-2 border-t border-border/40 group-hover:translate-x-1 transition-all"
            >
                <span>Manage Strategy Sessions & Calendar</span>
                <ArrowRight size={14} />
            </Link>
        </div>
    );
};

export default BookingsDashboardWidget;
