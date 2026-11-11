"use client";

import { customerRescheduleBooking } from "@/actions/bookings";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingTimeSlots } from "@/components/booking/BookingTimeSlots";
import {
    calculateSlotEndTime,
    formatTime12h,
    generateGoogleCalendarUrl,
    getCurrentEATDate,
    TimeSlot,
} from "@/lib/booking-utils";
import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    Loader2,
    Mail,
    RefreshCw,
    Send,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

interface RescheduleBookingData {
    id: string;
    name: string;
    email: string;
    service?: string | null;
    dateFormatted: string;
    startTime: string;
    endTime: string;
    status: string;
    meetLink?: string | null;
    isLocked: boolean;
}

export default function RescheduleClient({ booking }: { booking: RescheduleBookingData }) {
    const todayDateStr = React.useMemo(() => {
        return getCurrentEATDate().toISOString().split("T")[0];
    }, []);

    const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
    const [currentMonth, setCurrentMonth] = useState<Date>(() => {
        const d = getCurrentEATDate();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });

    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState<boolean>(true);
    const [isHalfDay, setIsHalfDay] = useState<boolean>(false);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [blockedReason, setBlockedReason] = useState<string>("");

    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [reason, setReason] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [rescheduledSuccess, setRescheduledSuccess] = useState<boolean>(false);

    // Fetch verified slots for selected date
    const fetchSlots = useCallback(async (dateStr: string) => {
        setSlotsLoading(true);
        setSelectedSlot(null);
        setError(null);

        try {
            const res = await fetch(`/api/bookings/slots?date=${dateStr}`);
            const data = await res.json();

            if (res.ok) {
                setSlots(data.slots || []);
                setIsHalfDay(data.isHalfDay || false);
                setIsBlocked(data.isBlocked || false);
                setBlockedReason(data.blockedReason || "");
            } else {
                setSlots([]);
                setIsBlocked(true);
                setBlockedReason(data.error || "Failed to load slots.");
            }
        } catch (err) {
            console.error("Failed to fetch slots:", err);
            setSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!booking.isLocked && selectedDate) {
            fetchSlots(selectedDate);
        }
    }, [selectedDate, booking.isLocked, fetchSlots]);

    const handleConfirmReschedule = async () => {
        if (!selectedSlot) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await customerRescheduleBooking({
                bookingId: booking.id,
                newDate: selectedDate,
                newStartTime: selectedSlot,
                reason: reason.trim() || undefined,
            });

            if (!res.success) {
                setError(res.error || "Failed to reschedule appointment.");
                return;
            }

            setRescheduledSuccess(true);
        } catch (err: any) {
            setError(err?.message || "Failed to complete reschedule request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (booking.isLocked) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/40 dark:bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl max-w-2xl mx-auto"
            >
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tight">
                    Rescheduling Window Closed
                </h2>
                <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                    Appointments cannot be rescheduled online within <strong>2 hours</strong> of the scheduled start time
                    ({booking.dateFormatted} at {formatTime12h(booking.startTime)} EAT) to protect our engineering leads&apos; preparation time.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 text-xs text-muted-foreground flex flex-col gap-2">
                    <p>Need urgent adjustments? Reach out to our technical coordinators directly:</p>
                    <a
                        href="mailto:info@xinteck.co.ke"
                        className="text-primary font-bold hover:underline flex items-center justify-center gap-1.5"
                    >
                        <Mail size={14} /> info@xinteck.co.ke
                    </a>
                </div>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-primary text-black font-bold rounded-xl text-xs uppercase"
                >
                    Return to Homepage
                </Link>
            </motion.div>
        );
    }

    if (rescheduledSuccess) {
        const newEndTime = calculateSlotEndTime(selectedSlot!);
        const googleCalUrl = generateGoogleCalendarUrl({
            title: `Strategy Session: Xinteck Technologies & ${booking.name}`,
            description: `15-Minute Technical Strategy Session.`,
            startDate: selectedDate,
            startTime: selectedSlot!,
            endTime: newEndTime,
            meetLink: booking.meetLink || undefined,
        });

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/40 dark:bg-black/80 backdrop-blur-2xl border border-primary/30 rounded-2xl p-8 md:p-12 text-center shadow-2xl max-w-2xl mx-auto"
            >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={44} />
                </div>
                <h2 className="text-3xl font-black text-foreground mb-3 uppercase tracking-tight">
                    Rescheduled Successfully!
                </h2>
                <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                    Your strategy session has been moved to:
                </p>

                <div className="p-6 rounded-2xl bg-white/5 border border-primary/40 mb-8 flex flex-col gap-2">
                    <div className="text-xs uppercase font-bold text-primary tracking-widest">
                        New Appointment Time
                    </div>
                    <div className="text-xl md:text-2xl font-black text-foreground">
                        📅 {selectedDate} · ⏰ {formatTime12h(selectedSlot!)} – {formatTime12h(newEndTime)} EAT
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Updated meeting details and calendar invitations have been sent to <strong>{booking.email}</strong>.
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-8 py-3.5 bg-primary text-black font-black rounded-xl text-xs uppercase flex items-center justify-center gap-2 shadow-lg"
                    >
                        <span>Update Google Calendar</span>
                        <ExternalLink size={14} />
                    </a>
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-3.5 border border-border text-foreground font-bold rounded-xl text-xs uppercase hover:bg-white/5 transition-all text-center"
                    >
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Top Bar: Current appointment info */}
            <div className="bg-white/40 dark:bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs text-primary font-black uppercase tracking-wider block mb-1">
                        Rescheduling Appointment
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-foreground">
                        {booking.name} {booking.service ? `· ${booking.service}` : ""}
                    </h1>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <Clock size={20} className="text-primary shrink-0" />
                    <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                            Currently Booked For
                        </span>
                        <span className="text-xs font-bold text-foreground">
                            {booking.dateFormatted} at {formatTime12h(booking.startTime)} EAT
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-3">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Large Calendar */}
                <div className="lg:col-span-7 bg-white/40 dark:bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                    <BookingCalendar
                        selectedDate={selectedDate}
                        onSelectDate={(newDate) => setSelectedDate(newDate)}
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                        blockedDatesSet={new Set()}
                    />
                </div>

                {/* Right: Time Slots & Confirmation */}
                <div className="lg:col-span-5 bg-white/40 dark:bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
                    <BookingTimeSlots
                        selectedDate={selectedDate}
                        slots={slots}
                        loading={slotsLoading}
                        selectedSlot={selectedSlot}
                        onSelectSlot={setSelectedSlot}
                        isHalfDay={isHalfDay}
                        isBlocked={isBlocked}
                        blockedReason={blockedReason}
                    />

                    {selectedSlot && (
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-foreground font-bold">
                                    Reason for Rescheduling (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g. Schedule conflict with client meeting..."
                                    className="bg-background/80 border border-border/80 rounded-xl p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none resize-none"
                                />
                            </div>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleConfirmReschedule}
                                className="w-full bg-primary hover:bg-primary/90 text-black font-black py-3.5 px-6 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wide cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Confirming New Slot...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Rescheduled Time</span>
                                        <Send size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
