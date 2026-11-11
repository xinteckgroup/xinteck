"use client";

import {
    addBookingNote,
    assignBookingHost,
    cancelBooking,
    completeBooking,
    confirmBooking,
    deleteBooking,
    markNoShow,
} from "@/actions/bookings";
import { formatTime12h } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { BookingStatus, Role } from "@prisma/client";
import {
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    Loader2,
    Mail,
    MessageCircle,
    MessageSquare,
    Phone,
    ShieldAlert,
    Trash2,
    UserCheck,
    Video,
    X,
    XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface BookingDetailModalProps {
    booking: any;
    isOpen: boolean;
    onClose: () => void;
    userRole: string;
    staffList?: { id: string; name: string; email: string; role: string }[];
    currentUser?: { id: string; name: string; email: string; role: string };
    onUpdated: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
    booking,
    isOpen,
    onClose,
    userRole,
    staffList = [],
    currentUser,
    onUpdated,
}) => {
    const isSuperAdmin = userRole === Role.SUPER_ADMIN;
    const isAdminOrSuper = userRole === Role.SUPER_ADMIN || userRole === Role.ADMIN;

    // Reactive host assignment state
    const [assignedToId, setAssignedToId] = useState<string | null>(booking?.assignedToId || null);
    const [assignedTo, setAssignedTo] = useState<any>(booking?.assignedTo || null);
    const isAssignedToMe = Boolean(currentUser?.id && assignedToId === currentUser.id);

    // Action states
    const [meetLink, setMeetLink] = useState(booking?.meetLink || "");
    const [adminNoteInput, setAdminNoteInput] = useState("");
    const [newInternalNote, setNewInternalNote] = useState("");
    const [cancelReason, setCancelReason] = useState("");
    const [showCancelPrompt, setShowCancelPrompt] = useState(false);
    const [showCompletePrompt, setShowCompletePrompt] = useState(false);
    const [outcomeNote, setOutcomeNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        setAssignedToId(booking?.assignedToId || null);
        setAssignedTo(booking?.assignedTo || null);
        setMeetLink(booking?.meetLink || "");
    }, [booking]);

    if (!isOpen || !booking) return null;

    const dateFormatted = booking.dateFormatted || booking.date?.toString().split("T")[0];

    // Status styling helper
    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING:
                return "bg-amber-500/10 text-amber-500 border-amber-500/30";
            case BookingStatus.CONFIRMED:
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
            case BookingStatus.COMPLETED:
                return "bg-blue-500/10 text-blue-500 border-blue-500/30";
            case BookingStatus.CANCELLED:
                return "bg-rose-500/10 text-rose-500 border-rose-500/30";
            case BookingStatus.NO_SHOW:
                return "bg-purple-500/10 text-purple-500 border-purple-500/30";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    // 1. Confirm Booking
    const handleConfirm = async () => {
        if (!meetLink || !meetLink.trim().startsWith("http")) {
            toast.error("Please enter a valid Google Meet link (e.g. https://meet.google.com/...)");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await confirmBooking({
                bookingId: booking.id,
                meetLink: meetLink.trim(),
                adminNotes: adminNoteInput.trim() || undefined,
            });

            if (res.success) {
                toast.success("Booking confirmed! Official confirmation email sent to client.");
                onUpdated();
                onClose();
            } else {
                toast.error(res.error || "Failed to confirm booking.");
            }
        } catch {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 2. Assign Host
    const handleAssignHost = async (hostId: string) => {
        const targetId = hostId === "none" ? null : hostId;
        try {
            const res = await assignBookingHost(booking.id, targetId);
            if (res.success && res.booking) {
                setAssignedToId(res.booking.assignedToId);
                setAssignedTo(res.booking.assignedTo);
                toast.success(targetId === currentUser?.id ? "Assigned to yourself!" : "Host assigned successfully.");
                onUpdated();
            } else {
                toast.error("Failed to assign host.");
            }
        } catch {
            toast.error("Error assigning host.");
        }
    };

    // 3. Cancel Booking
    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a reason for cancellation.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await cancelBooking({
                bookingId: booking.id,
                reason: cancelReason.trim(),
            });

            if (res.success) {
                toast.success("Booking cancelled and client notified via email.");
                onUpdated();
                onClose();
            } else {
                toast.error(res.error || "Failed to cancel booking.");
            }
        } catch {
            toast.error("Error cancelling booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 4. Complete Call
    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            const res = await completeBooking(booking.id, outcomeNote.trim() || undefined);
            if (res.success) {
                toast.success("Call marked as COMPLETED.");
                onUpdated();
                onClose();
            } else {
                toast.error("Failed to complete call.");
            }
        } catch {
            toast.error("Error updating call status.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Mark No-Show
    const handleNoShow = async () => {
        if (!confirm("Are you sure you want to mark this client as a No-Show?")) return;

        setIsSubmitting(true);
        try {
            const res = await markNoShow(booking.id, "Client did not attend session.");
            if (res.success) {
                toast.success("Marked as NO-SHOW.");
                onUpdated();
                onClose();
            } else {
                toast.error("Failed to update status.");
            }
        } catch {
            toast.error("Error updating status.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 6. Add Note
    const handleAddNote = async () => {
        if (!newInternalNote.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await addBookingNote(booking.id, newInternalNote.trim());
            if (res.success) {
                toast.success("Internal note added.");
                setNewInternalNote("");
                onUpdated();
            } else {
                toast.error("Failed to add note.");
            }
        } catch {
            toast.error("Error saving note.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 7. Delete (Super Admin Only)
    const handleDelete = async () => {
        if (!confirm("DANGER: Are you sure you want to permanently delete this booking record? This action cannot be undone.")) return;

        setIsSubmitting(true);
        try {
            const res = await deleteBooking(booking.id);
            if (res.success) {
                toast.success("Booking deleted.");
                onUpdated();
                onClose();
            } else {
                toast.error("Failed to delete booking.");
            }
        } catch {
            toast.error("Error deleting booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border/80 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-foreground">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border/50 pb-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-xl font-black text-foreground">
                                {booking.name}
                            </h3>
                            <span className={cn("text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border", getStatusBadge(booking.status))}>
                                {booking.status}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span>📅 {dateFormatted}</span>
                            <span>·</span>
                            <span>⏰ {formatTime12h(booking.startTime)} – {formatTime12h(booking.endTime)} EAT</span>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/20 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Client Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-muted/15 border border-border/50 text-xs">
                    <div className="flex items-center gap-2">
                        <Mail size={15} className="text-primary shrink-0" />
                        <span className="text-muted-foreground">Email:</span>
                        <a href={`mailto:${booking.email}`} className="text-primary font-bold hover:underline truncate">
                            {booking.email}
                        </a>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Phone size={15} className="text-primary shrink-0" />
                        <span className="text-muted-foreground">Phone / WA:</span>
                        <a href={`tel:${booking.phone}`} className="text-foreground font-bold hover:underline">
                            {booking.phone}
                        </a>
                        {booking.phone && (
                            <a
                                href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-[6px] transition-all ml-1"
                                title="Chat with client on WhatsApp"
                            >
                                <MessageCircle size={12} />
                                <span>WhatsApp</span>
                            </a>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <UserCheck size={15} className="text-primary shrink-0" />
                        <span className="text-muted-foreground">Company:</span>
                        <span className="text-foreground font-medium">{booking.company || "Not provided"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-primary shrink-0" />
                        <span className="text-muted-foreground">Service:</span>
                        <span className="text-primary font-bold">{booking.service || "General Discovery"}</span>
                    </div>
                </div>

                {/* Scope Estimator Pre-Calculation Highlight (if detected) */}
                {(() => {
                    const message = booking.message || "";
                    const budgetMatch = message.match(/Estimated budget(?: from scope calculator)?:?\s*(KES\s*[\d,]+)/i);
                    const packageMatch = message.match(/Selected package:?\s*([^\n]+)/i);
                    const budget = budgetMatch ? budgetMatch[1].trim() : null;
                    const pkg = packageMatch ? packageMatch[1].trim() : null;

                    if (!budget && !pkg) return null;

                    return (
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                    💰
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                                        Calculated Scope Budget
                                    </span>
                                    <span className="text-base font-extrabold text-foreground">
                                        {budget || "Custom Scope"}
                                    </span>
                                </div>
                            </div>
                            {pkg && (
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-background border border-border text-foreground flex items-center gap-1.5 shadow-sm">
                                    📦 {pkg}
                                </span>
                            )}
                        </div>
                    );
                })()}

                {/* Client Message / Discussion Agenda */}
                {booking.message && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Client Discussion Goals / Notes:
                        </label>
                        <div className="p-3.5 rounded-xl bg-muted/10 border border-border/40 text-xs text-foreground italic leading-relaxed">
                            &quot;{booking.message}&quot;
                        </div>
                    </div>
                )}

                {/* Host Assignment Section */}
                <div className="p-3.5 rounded-xl bg-muted/10 border border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                            Assigned Engineering Host
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-foreground font-medium">
                                {assignedTo ? `${assignedTo.name} (${assignedTo.role})` : "Unassigned (Team Queue)"}
                            </span>
                            {isAssignedToMe && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                                    <UserCheck size={11} /> You
                                </span>
                            )}
                        </div>
                    </div>

                    {isAdminOrSuper ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {/* 1-Click "Assign to Me" Button */}
                            {currentUser?.id && (
                                isAssignedToMe ? (
                                    <button
                                        type="button"
                                        onClick={() => handleAssignHost("none")}
                                        className="text-xs text-muted-foreground hover:text-destructive px-2 py-1.5 rounded-lg border border-border/50 hover:border-destructive/30 transition-colors whitespace-nowrap cursor-pointer"
                                        title="Unassign yourself from this call"
                                    >
                                        Unassign Me
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleAssignHost(currentUser.id)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                                        title="Assign this strategy session to yourself"
                                    >
                                        <UserCheck size={13} />
                                        Assign to Me
                                    </button>
                                )
                            )}

                            {/* Staff Dropdown */}
                            <div className="w-full sm:w-44">
                                <select
                                    value={assignedToId || "none"}
                                    onChange={(e) => handleAssignHost(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                                >
                                    <option value="none">-- Select Host --</option>
                                    {staffList.map((staff) => (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.name} {staff.id === currentUser?.id ? "(You)" : `(${staff.role})`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground">Managed by Admin</span>
                    )}
                </div>

                {/* GOOGLE MEET LINK & CONFIRMATION ACTIONS */}
                {booking.status === BookingStatus.PENDING && (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
                                <Video size={15} /> Confirm & Assign Google Meet Link
                            </span>

                            {/* One-click open Google Meet creator */}
                            <a
                                href="https://meet.google.com/new"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-primary bg-primary/20 hover:bg-primary/30 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
                            >
                                <ExternalLink size={12} /> Create Meet ↗
                            </a>
                        </div>

                        {isAdminOrSuper ? (
                            <div className="flex flex-col gap-2.5">
                                <input
                                    type="url"
                                    value={meetLink}
                                    onChange={(e) => setMeetLink(e.target.value)}
                                    placeholder="Paste Google Meet link (https://meet.google.com/...)"
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                                />

                                <input
                                    type="text"
                                    value={adminNoteInput}
                                    onChange={(e) => setAdminNoteInput(e.target.value)}
                                    placeholder="Optional welcome note to include in confirmation email..."
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                                />

                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleConfirm}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                    <span>Confirm Call & Dispatch Email</span>
                                </button>
                            </div>
                        ) : (
                            <div className="text-xs text-muted-foreground p-2 rounded bg-background/50">
                                Logged in as Support Staff. Only Admins can commit Google Meet links.
                            </div>
                        )}
                    </div>
                )}

                {/* CONFIRMED STATE: Active Meeting Room */}
                {booking.status === BookingStatus.CONFIRMED && booking.meetLink && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block">
                                Google Meet Active Room
                            </span>
                            <a
                                href={booking.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-foreground hover:text-primary hover:underline flex items-center gap-1 mt-0.5"
                            >
                                <span>{booking.meetLink}</span>
                                <ExternalLink size={12} />
                            </a>
                        </div>

                        <a
                            href={booking.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow"
                        >
                            <Video size={14} /> Join Call ↗
                        </a>
                    </div>
                )}

                {/* POST-CALL ACTIONS: Mark Completed or No-Show */}
                {booking.status === BookingStatus.CONFIRMED && (
                    <div className="border-t border-border/50 pt-3 flex flex-col gap-3">
                        {showCompletePrompt ? (
                            <div className="p-3.5 rounded-xl bg-muted/15 border border-border flex flex-col gap-2.5">
                                <span className="text-xs font-bold text-foreground">
                                    Call Outcome & Next Steps Notes:
                                </span>
                                <textarea
                                    rows={2}
                                    value={outcomeNote}
                                    onChange={(e) => setOutcomeNote(e.target.value)}
                                    placeholder="e.g. Client agreed on proposal for web app. Sent initial architecture outline."
                                    className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                                />
                                <div className="flex items-center gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowCompletePrompt(false)}
                                        className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleComplete}
                                        className="bg-primary text-primary-foreground font-black text-xs px-4 py-1.5 rounded-lg flex items-center gap-1"
                                    >
                                        {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                                        Save & Mark Completed
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCompletePrompt(true)}
                                    className="text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <CheckCircle2 size={13} /> Mark Completed
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNoShow}
                                    className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <Clock size={13} /> Mark No-Show
                                </button>

                                {isAdminOrSuper && (
                                    <button
                                        type="button"
                                        onClick={() => setShowCancelPrompt(true)}
                                        className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                                    >
                                        <XCircle size={13} /> Cancel Call
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* CANCEL PROMPT */}
                {showCancelPrompt && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-2.5">
                        <span className="text-xs font-bold text-rose-500">
                            Reason for Cancellation (will be emailed to client):
                        </span>
                        <input
                            type="text"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="e.g. Schedule conflict due to emergency server migration..."
                            className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:border-rose-500 focus:outline-none"
                        />
                        <div className="flex items-center gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowCancelPrompt(false)}
                                className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5"
                            >
                                Dismiss
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleCancel}
                                className="bg-rose-600 text-white font-black text-xs px-4 py-1.5 rounded-lg flex items-center gap-1"
                            >
                                {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                )}

                {/* INTERNAL CRM NOTES */}
                <div className="border-t border-border/50 pt-4 flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <MessageSquare size={14} className="text-primary" /> Internal Admin Notes
                    </span>

                    {booking.adminNotes ? (
                        <div className="p-3 rounded-xl bg-muted/15 border border-border/40 text-xs text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {booking.adminNotes}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No internal notes recorded yet.</p>
                    )}

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newInternalNote}
                            onChange={(e) => setNewInternalNote(e.target.value)}
                            placeholder="Add a new consultation note..."
                            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                        <button
                            type="button"
                            disabled={isSubmitting || !newInternalNote.trim()}
                            onClick={handleAddNote}
                            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer disabled:opacity-50"
                        >
                            Save Note
                        </button>
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                    {isSuperAdmin && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1 font-bold p-1 hover:underline cursor-pointer"
                        >
                            <Trash2 size={13} /> Delete Booking (Super Admin)
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-bold px-5 py-2 rounded-lg border border-border hover:bg-muted/20 text-foreground ml-auto cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;
