"use client";

import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingTimeSlots } from "@/components/booking/BookingTimeSlots";
import {
    formatTime12h,
    generateGoogleCalendarUrl,
    generateIcsContent,
    getCurrentEATDate,
    TimeSlot,
} from "@/lib/booking-utils";
import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Download,
    ExternalLink,
    Info,
    Video,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface BookingClientProps {
    servicesList: string[];
    initialBlockedDates?: string[]; // YYYY-MM-DD
}

export const BookingClient: React.FC<BookingClientProps> = ({
    servicesList,
    initialBlockedDates = [],
}) => {
    // Current Nairobi Date
    const todayDateStr = React.useMemo(() => {
        return getCurrentEATDate().toISOString().split("T")[0];
    }, []);

    // Read query params from scope estimators (e.g. /book?service=Web+Development&budget=KES+145,000)
    const searchParams = useSearchParams();
    const initialService = useMemo(() => searchParams.get("service") || undefined, [searchParams]);
    const initialMessage = useMemo(() => {
        const budget = searchParams.get("budget");
        const pkg = searchParams.get("package");
        const parts: string[] = [];
        if (budget) parts.push(`Estimated budget from scope calculator: ${budget}`);
        if (pkg) parts.push(`Selected package: ${pkg}`);
        return parts.length > 0 ? parts.join("\n") : undefined;
    }, [searchParams]);

    // Calendar state
    const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
    const [currentMonth, setCurrentMonth] = useState<Date>(() => {
        const d = getCurrentEATDate();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });

    // Slots state
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState<boolean>(true);
    const [isHalfDay, setIsHalfDay] = useState<boolean>(false);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [blockedReason, setBlockedReason] = useState<string>("");

    // Selected slot state
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    // Active workflow step: "slots" | "form" | "success"
    const [step, setStep] = useState<"slots" | "form" | "success">("slots");

    // Submission & Error state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // Successful booking result
    const [confirmedBooking, setConfirmedBooking] = useState<{
        id: string;
        date: string;
        startTime: string;
        endTime: string;
        name: string;
        email: string;
    } | null>(null);

    const blockedDatesSet = React.useMemo(() => {
        return new Set(initialBlockedDates);
    }, [initialBlockedDates]);

    // Fetch verified time slots when date changes
    const fetchSlots = useCallback(async (dateStr: string) => {
        setSlotsLoading(true);
        setSelectedSlot(null);
        setSubmissionError(null);

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
        if (selectedDate) {
            fetchSlots(selectedDate);
        }
    }, [selectedDate, fetchSlots]);

    // Handle Slot Pick
    const handleSelectSlot = (startTime: string) => {
        setSelectedSlot(startTime);
        setStep("form");
    };

    // Handle Form Submit
    const handleFormSubmit = async (formData: {
        name: string;
        email: string;
        phone: string;
        company?: string;
        service?: string;
        message?: string;
        honeypot?: string;
        captchaToken?: string;
        captchaAnswer?: number;
    }) => {
        if (!selectedSlot) return;

        setIsSubmitting(true);
        setSubmissionError(null);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    date: selectedDate,
                    startTime: selectedSlot,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // If 409 Conflict: someone else grabbed the slot while typing
                if (res.status === 409 || data.slotConflict) {
                    setSubmissionError(data.error || "This slot was just booked by another visitor! Please pick another slot.");
                    // Refetch slots and return to slots view without losing form data
                    await fetchSlots(selectedDate);
                    setStep("slots");
                    return;
                }

                setSubmissionError(data.error || "Failed to complete booking. Please try again.");
                return;
            }

            // Success
            setConfirmedBooking(data.booking);
            setStep("success");
        } catch (err) {
            console.error("Booking submission error:", err);
            setSubmissionError("Network error. Please verify your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Download .ics calendar file
    const handleDownloadIcs = () => {
        if (!confirmedBooking) return;

        const icsData = generateIcsContent({
            id: confirmedBooking.id,
            title: `Discovery Call: Xinteck & ${confirmedBooking.name}`,
            description: `Free 15-Minute Technical Discovery & Strategy Call with Xinteck Technologies.`,
            startDate: confirmedBooking.date,
            startTime: confirmedBooking.startTime,
            endTime: confirmedBooking.endTime,
        });

        const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `xinteck-discovery-${confirmedBooking.date}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Reset workflow
    const handleBookAnother = () => {
        setConfirmedBooking(null);
        setSelectedSlot(null);
        setStep("slots");
        fetchSlots(selectedDate);
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-10">
            {/* SUCCESS SCREEN */}
            {step === "success" && confirmedBooking ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-8 md:p-14 shadow-2xl text-center max-w-2xl mx-auto flex flex-col items-center gap-6"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary shadow-xl">
                        <CheckCircle2 size={44} className="stroke-[2.5]" />
                    </div>

                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-primary">
                            Session Confirmed
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mt-1">
                            Your Call is Booked!
                        </h2>
                        <p className="text-sm md:text-base text-foreground/80 mt-2 max-w-md mx-auto">
                            Thank you, <strong className="text-foreground">{confirmedBooking.name}</strong>. We have received your booking and reserved your session.
                        </p>
                    </div>

                    {/* Booking Details Card */}
                    <div className="w-full bg-muted/10 rounded-[10px] p-6 text-left flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-border/50 pb-3">
                            <span className="text-xs text-foreground/70 font-semibold">Appointment Date</span>
                            <span className="text-sm font-bold text-foreground">
                                📅 {confirmedBooking.date}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-3">
                            <span className="text-xs text-foreground/70 font-semibold">Time Window (EAT)</span>
                            <span className="text-sm font-black text-primary">
                                ⏰ {formatTime12h(confirmedBooking.startTime)} – {formatTime12h(confirmedBooking.endTime)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-3">
                            <span className="text-xs text-foreground/70 font-semibold">Meeting Format</span>
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                <Video size={14} className="text-primary" /> Google Meet Video Call
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-foreground/70 font-semibold">Email Delivered To</span>
                            <span className="text-xs font-medium text-foreground">
                                {confirmedBooking.email}
                            </span>
                        </div>
                    </div>

                    {/* Next Steps Notification */}
                    <div className="text-xs text-foreground/80 bg-primary/10 rounded-[10px] p-4 text-left leading-relaxed">
                        📩 An official confirmation has been dispatched to <strong>{confirmedBooking.email}</strong>. Once our engineering host is assigned, your direct Google Meet link will be emailed to you before the meeting.
                    </div>

                    {/* Calendar Sync Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        <a
                            href={generateGoogleCalendarUrl({
                                title: `Discovery Call: Xinteck & ${confirmedBooking.name}`,
                                description: `15-Minute Technical Discovery & Strategy Session.`,
                                startDate: confirmedBooking.date,
                                startTime: confirmedBooking.startTime,
                                endTime: confirmedBooking.endTime,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-1/2 bg-white/10 hover:bg-white/20 border border-border text-foreground font-bold py-3 px-4 rounded-[10px] text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                            <ExternalLink size={14} /> Add to Google Calendar
                        </a>

                        <button
                            type="button"
                            onClick={handleDownloadIcs}
                            className="w-full sm:w-1/2 bg-white/10 hover:bg-white/20 border border-border text-foreground font-bold py-3 px-4 rounded-[10px] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                        >
                            <Download size={14} /> Download (.ics file)
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleBookAnother}
                        className="text-xs text-primary font-bold hover:underline cursor-pointer pt-2"
                    >
                        Schedule another call
                    </button>
                </motion.div>
            ) : (
                /* MAIN INTERACTIVE BOOKING LAYOUT */
                <div className="flex flex-col gap-6">
                    {/* Scope Estimator Context Banner */}
                    {(initialService || initialMessage) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-primary/10 border border-primary/30 rounded-[10px] px-5 py-4 flex items-start gap-3"
                        >
                            <Info size={18} className="text-primary shrink-0 mt-0.5" />
                            <div className="text-xs text-foreground leading-relaxed">
                                <span className="font-bold text-foreground">Your scope estimate has been saved.</span>
                                {initialService && (
                                    <span> Service: <strong className="text-primary">{initialService}</strong>.</span>
                                )}
                                {searchParams.get("budget") && (
                                    <span> Budget estimate: <strong className="text-primary">{searchParams.get("budget")}</strong>.</span>
                                )}
                                {searchParams.get("package") && (
                                    <span> Package: <strong className="text-primary">{searchParams.get("package")}</strong>.</span>
                                )}
                                <span className="text-foreground/80"> Pick a date and time below — your selections will be pre-filled in the form.</span>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: Large Interactive Calendar Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 sm:p-8 md:p-10 shadow-2xl"
                    >
                        <BookingCalendar
                            selectedDate={selectedDate}
                            onSelectDate={(newDate) => {
                                setSelectedDate(newDate);
                                setStep("slots");
                            }}
                            currentMonth={currentMonth}
                            onMonthChange={setCurrentMonth}
                            blockedDatesSet={blockedDatesSet}
                        />
                    </motion.div>

                    {/* RIGHT COLUMN: Time Slots or Details Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-5 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 sm:p-8 shadow-2xl flex flex-col justify-between"
                    >
                        {step === "slots" ? (
                            <BookingTimeSlots
                                selectedDate={selectedDate}
                                slots={slots}
                                loading={slotsLoading}
                                selectedSlot={selectedSlot}
                                onSelectSlot={handleSelectSlot}
                                isHalfDay={isHalfDay}
                                isBlocked={isBlocked}
                                blockedReason={blockedReason}
                            />
                        ) : (
                            <BookingForm
                                selectedDate={selectedDate}
                                selectedSlot={selectedSlot!}
                                servicesList={servicesList}
                                onSubmit={handleFormSubmit}
                                isSubmitting={isSubmitting}
                                error={submissionError}
                                onBackToSlots={() => setStep("slots")}
                                initialService={initialService}
                                initialMessage={initialMessage}
                            />
                        )}
                    </motion.div>
                    </div>
                </div>
            )}

            {/* SESSION OBJECTIVES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 flex flex-col gap-4 shadow-lg">
                    <div className="w-12 h-12 rounded-[10px] bg-background/80 flex items-center justify-center text-primary font-black text-lg">
                        1
                    </div>
                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>Technical Exploration</h4>
                    <p className={`${TYPOGRAPHY.meta} text-foreground text-sm leading-relaxed`}>
                        An introductory consultation focused on understanding your project scope, technical requirements, and goals.
                    </p>
                </div>

                <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 flex flex-col gap-4 shadow-lg">
                    <div className="w-12 h-12 rounded-[10px] bg-background/80 flex items-center justify-center text-primary font-black text-lg">
                        2
                    </div>
                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>Direct Engineering Insights</h4>
                    <p className={`${TYPOGRAPHY.meta} text-foreground text-sm leading-relaxed`}>
                        Engage directly with senior engineering leads experienced in scalable cloud systems, mobile apps, and enterprise APIs.
                    </p>
                </div>

                <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 flex flex-col gap-4 shadow-lg">
                    <div className="w-12 h-12 rounded-[10px] bg-background/80 flex items-center justify-center text-primary font-black text-lg">
                        3
                    </div>
                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>Architectural Roadmap</h4>
                    <p className={`${TYPOGRAPHY.meta} text-foreground text-sm leading-relaxed`}>
                        Gain objective guidance on suitable technology stacks, project feasibility, delivery milestones, and scope estimates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingClient;
