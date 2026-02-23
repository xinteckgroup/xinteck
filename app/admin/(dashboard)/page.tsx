import { getAnalyticsGraphData, getDashboardStats, getRecentActivity } from "@/actions/dashboard";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, activity, analytics] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getAnalyticsGraphData()
  ]);

  return <DashboardClient stats={stats} activity={activity} analytics={analytics} />;
}
