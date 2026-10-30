import { getBlockedDates, getBookings, getBookingStats, getWeeklyAvailability } from "@/actions/bookings";
import { BookingsClient } from "@/components/admin/BookingsClient";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@prisma/client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Discovery Calls & Bookings | Xinteck Administration",
};

export default async function AdminBookingsPage() {
    // 1. RBAC Guard: accessible to Super Admin, Admin, and Support Staff
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    // 2. Fetch Initial Bookings & Stats
    const [bookingsRes, stats, weeklyAvailability, blockedDates, activeStaff] = await Promise.all([
        getBookings({ pageSize: 100 }),
        getBookingStats(),
        getWeeklyAvailability(),
        getBlockedDates(),
        prisma.user.findMany({
            where: {
                status: UserStatus.ACTIVE,
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            orderBy: { name: "asc" },
        }),
    ]);

    return (
        <BookingsClient
            initialBookings={bookingsRes.data || []}
            initialStats={stats}
            initialAvailability={weeklyAvailability || []}
            initialBlockedDates={blockedDates || []}
            staffList={activeStaff}
            currentUser={{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }}
        />
    );
}
