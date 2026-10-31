"use client";

import { AdminBookingCalendar } from "@/components/admin/AdminBookingCalendar";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";
import { BookingDetailModal } from "@/components/admin/BookingDetailModal";
import { formatTime12h } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { BookingStatus, Role } from "@prisma/client";
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Eye,
    Filter,
    List,
    Lock,
    Plus,
    RefreshCw,
    Search,
    Shield,
    SlidersHorizontal,
    UserCheck,
    Video,
    X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface BookingsClientProps {
    initialBookings: any[];
    initialStats: {
        pendingCount: number;
        confirmedCount: number;
        completedCount: number;
        todayCount: number;
        totalCount: number;
    };
    initialAvailability: any[];
    initialBlockedDates: any[];
    staffList: { id: string; name: string; email: string; role: string }[];
    currentUser: { id: string; name: string; email: string; role: string };
}

export const BookingsClient: React.FC<BookingsClientProps> = ({
    initialBookings,
    initialStats,
    initialAvailability,
    initialBlockedDates,
    staffList,
    currentUser,
}) => {
    const userRole = currentUser.role;
    const isSuperAdmin = userRole === Role.SUPER_ADMIN;
    const isAdminOrSuper = userRole === Role.SUPER_ADMIN || userRole === Role.ADMIN;

    // View mode: "calendar" | "list" | "availability"
    const [viewMode, setViewMode] = useState<"calendar" | "list" | "availability">("calendar");

    // Local data state
    const [bookings, setBookings] = useState<any[]>(initialBookings);
    const [stats, setStats] = useState(initialStats);
    const [availability, setAvailability] = useState(initialAvailability);
    const [blockedDates, setBlockedDates] = useState(initialBlockedDates);

    // List View Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [selectedHost, setSelectedHost] = useState<string>("ALL");

    // Detail Modal state
    const [activeBooking, setActiveBooking] = useState<any | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Refresh data handler
    const handleRefreshData = async () => {
        try {
            const res = await fetch("/api/admin/bookings/refresh");
            if (res.ok) {
                const data = await res.json();
                if (data.bookings) setBookings(data.bookings);
                if (data.stats) setStats(data.stats);
                if (data.blockedDates) setBlockedDates(data.blockedDates);
            }
        } catch {
            // Soft refresh
        }
    };

    // Filtered bookings for List View
    const filteredBookings = React.useMemo(() => {
        return bookings.filter((b) => {
            // Status filter
            if (selectedStatus !== "ALL" && b.status !== selectedStatus) return false;

            // Host filter
            if (selectedHost !== "ALL" && b.assignedToId !== selectedHost) return false;

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const nameMatch = b.name?.toLowerCase().includes(q);
                const emailMatch = b.email?.toLowerCase().includes(q);
                const phoneMatch = b.phone?.toLowerCase().includes(q);
                const companyMatch = b.company?.toLowerCase().includes(q);
                const serviceMatch = b.service?.toLowerCase().includes(q);
                return nameMatch || emailMatch || phoneMatch || companyMatch || serviceMatch;
            }

            return true;
        });
    }, [bookings, selectedStatus, selectedHost, searchQuery]);

    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING:
                return "bg-amber-500/10 text-amber-500 border-amber-500/30";
            case BookingStatus.CONFIRMED:
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
            case BookingStatus.COMPLETED:
                return "bg-blue-500/10 text-blue-500 border-blue-500/30";
            case BookingStatus.CANCELLED:
                return "bg-rose-500/10 text-rose-500 border-rose-500/30 line-through";
            case BookingStatus.NO_SHOW:
                return "bg-purple-500/10 text-purple-500 border-purple-500/30";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 text-foreground max-w-7xl mx-auto">
            {/* Top Bar: Title & Role status */}
            <div className="flex flex-col gap-4 border-b border-border/50 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                            Discovery Call Bookings
                        </h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center gap-1">
                            <Shield size={12} /> {userRole}
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        15-minute consultations · Anti-double-booking sync · Resend email notifications
                    </p>
                </div>

                {/* View Mode Switcher — directly below subtitle */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/20 border border-border/60 self-start w-fit">
                    <button
                        type="button"
                        onClick={() => setViewMode("calendar")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                            viewMode === "calendar"
                                ? "bg-primary text-primary-foreground shadow"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <CalendarIcon size={14} /> Calendar View
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                            viewMode === "list"
                                ? "bg-primary text-primary-foreground shadow"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <List size={14} /> Data Table ({bookings.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("availability")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                            viewMode === "availability"
                                ? "bg-primary text-primary-foreground shadow"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <SlidersHorizontal size={14} /> Working Hours & Off-Days
                    </button>
                </div>
            </div>

            {/* Role Notice Banner for Support Staff */}
            {userRole === Role.SUPPORT_STAFF && (
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
                    <Shield size={16} className="shrink-0" />
                    <span>
                        <strong>Support Staff Mode:</strong> You can view all bookings, join calls, log call outcomes (Completed/No-Show), and add internal notes. Working hours and date blocking are managed by Admins.
                    </span>
                </div>
            )}

            {/* KPI METRICS BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase font-black tracking-wider">
                        Pending Action
                    </span>
                    <span className="text-2xl font-black text-amber-500">
                        {stats.pendingCount}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Needs Meet Link</span>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase font-black tracking-wider">
                        Scheduled Today
                    </span>
                    <span className="text-2xl font-black text-primary">
                        {stats.todayCount}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Active for Today</span>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase font-black tracking-wider">
                        Confirmed Ahead
                    </span>
                    <span className="text-2xl font-black text-emerald-500">
                        {stats.confirmedCount}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Ready with Meet links</span>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase font-black tracking-wider">
                        Completed Calls
                    </span>
                    <span className="text-2xl font-black text-blue-500">
                        {stats.completedCount}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Total Sessions Held</span>
                </div>
            </div>

            {/* VIEW 1: INTERACTIVE MATCHING CALENDAR VIEW */}
            {viewMode === "calendar" && (
                <AdminBookingCalendar
                    bookings={bookings}
                    blockedDates={blockedDates}
                    onSelectBooking={(b) => {
                        setActiveBooking(b);
                        setIsDetailOpen(true);
                    }}
                    onAddBlockedDate={(dateStr) => {
                        setViewMode("availability");
                    }}
                    userRole={userRole}
                />
            )}

            {/* VIEW 2: DATA TABLE / LIST VIEW */}
            {viewMode === "list" && (
                <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                    {/* Filter Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-5 relative">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email, phone, company..."
                                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value={BookingStatus.PENDING}>Pending Confirmation</option>
                                <option value={BookingStatus.CONFIRMED}>Confirmed</option>
                                <option value={BookingStatus.COMPLETED}>Completed</option>
                                <option value={BookingStatus.CANCELLED}>Cancelled</option>
                                <option value={BookingStatus.NO_SHOW}>No-Show</option>
                            </select>
                        </div>

                        <div className="sm:col-span-4">
                            <select
                                value={selectedHost}
                                onChange={(e) => setSelectedHost(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                            >
                                <option value="ALL">All Assigned Hosts</option>
                                {staffList.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        Host: {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    {filteredBookings.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                            <Clock size={32} className="text-muted-foreground/60" />
                            <p className="text-sm font-bold text-foreground">No bookings found</p>
                            <p className="text-xs">Try adjusting your search query or status filter.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-border/50">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-muted/20 border-b border-border/50 text-muted-foreground uppercase font-black text-[10px] tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Client Details</th>
                                        <th className="py-3 px-4">Date & Time (EAT)</th>
                                        <th className="py-3 px-4">Service</th>
                                        <th className="py-3 px-4">Host</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {filteredBookings.map((b) => (
                                        <tr
                                            key={b.id}
                                            onClick={() => {
                                                setActiveBooking(b);
                                                setIsDetailOpen(true);
                                            }}
                                            className="hover:bg-muted/10 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-foreground">{b.name}</div>
                                                <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                                                    {b.email} {b.phone ? `· ${b.phone}` : ""}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="font-bold text-foreground">
                                                    📅 {b.dateFormatted}
                                                </div>
                                                <div className="text-[11px] text-primary font-semibold">
                                                    ⏰ {formatTime12h(b.startTime)} – {formatTime12h(b.endTime)}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="font-medium text-foreground">
                                                    {b.service || "General"}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    {b.assignedTo ? b.assignedTo.name : "Unassigned"}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", getStatusBadge(b.status))}>
                                                    {b.status}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveBooking(b);
                                                        setIsDetailOpen(true);
                                                    }}
                                                    className="text-primary hover:underline font-bold text-xs inline-flex items-center gap-1"
                                                >
                                                    <Eye size={13} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 3: AVAILABILITY & OFF-DAYS */}
            {viewMode === "availability" && (
                <AvailabilityManager
                    weeklyAvailability={availability}
                    blockedDates={blockedDates}
                    userRole={userRole}
                    onUpdated={handleRefreshData}
                />
            )}

            {/* DETAIL / ACTION MODAL */}
            {isDetailOpen && activeBooking && (
                <BookingDetailModal
                    booking={activeBooking}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    userRole={userRole}
                    staffList={staffList}
                    currentUser={currentUser}
                    onUpdated={() => {
                        handleRefreshData();
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
};

export default BookingsClient;
