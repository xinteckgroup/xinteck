import { getBookingStats } from "@/actions/bookings";
import { getAnalyticsGraphData, getDashboardStats, getRecentActivity } from "@/actions/dashboard";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, activity, analytics, bookingStats] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getAnalyticsGraphData(),
    getBookingStats().catch(() => null),
  ]);

  return (
    <DashboardClient 
      stats={stats} 
      activity={activity} 
      analytics={analytics} 
      bookingStats={bookingStats} 
    />
  );
}
