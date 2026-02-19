"use server";

import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { IconName } from "@/types";

export async function getDashboardStats() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    // Cache the expensive stats calculation for 5 minutes
    const getCachedStats = unstable_cache(
        async () => {
            try {
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

                // Execute in parallel to reduce latency
                const [
                    totalPosts,
                    totalProjects,
                    totalServices,
                    totalSubscribers,
                    unreadInquiries,
                    totalViewsResult,
                    recentPosts,
                    prevPosts,
                    recentProjects,
                    prevProjects
                ] = await Promise.all([
                    prisma.blogPost.count({ where: { deletedAt: null } }),
                    prisma.project.count({ where: { deletedAt: null } }),
                    prisma.service.count({ where: { isActive: true } }),
                    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
                    prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
                    prisma.blogPost.aggregate({ _sum: { views: true }, where: { deletedAt: null } }),
                    prisma.blogPost.count({ where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null } }),
                    prisma.blogPost.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, deletedAt: null } }),
                    prisma.project.count({ where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null } }),
                    prisma.project.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, deletedAt: null } })
                ]);

                const totalViews = totalViewsResult._sum.views || 0;

                const calcTrend = (current: number, previous: number) => {
                    if (previous === 0) return current > 0 ? "+100%" : "—";
                    const pct = Math.round(((current - previous) / previous) * 100);
                    return pct >= 0 ? `+${pct}%` : `${pct}%`;
                };

                return [
                    {
                        title: "Total Views",
                        value: totalViews.toLocaleString(),
                        trend: "Lifetime",
                        isPositive: true,
                        iconName: "activity" as IconName,
                        href: "/admin/blog",
                        color: "text-blue-400"
                    },
                    {
                        title: "Blog Posts",
                        value: totalPosts.toLocaleString(),
                        trend: calcTrend(recentPosts, prevPosts),
                        isPositive: recentPosts >= prevPosts,
                        iconName: "fileText" as IconName,
                        href: "/admin/blog",
                        color: "text-gold"
                    },
                    {
                        title: "Projects",
                        value: totalProjects.toLocaleString(),
                        trend: calcTrend(recentProjects, prevProjects),
                        isPositive: recentProjects >= prevProjects,
                        iconName: "monitor" as IconName,
                        href: "/admin/projects",
                        color: "text-purple-400"
                    },
                    {
                        title: "Active Services",
                        value: totalServices.toLocaleString(),
                        trend: `${totalServices} live`,
                        isPositive: true,
                        iconName: "monitor" as IconName,
                        href: "/admin/services",
                        color: "text-emerald-400"
                    },
                    {
                        title: "Subscribers",
                        value: totalSubscribers.toLocaleString(),
                        trend: "Newsletter",
                        isPositive: true,
                        iconName: "messageSquare" as IconName,
                        href: "/admin/newsletter",
                        color: "text-cyan-400"
                    },
                    {
                        title: "Pending Leads",
                        value: unreadInquiries.toLocaleString(),
                        trend: unreadInquiries > 0 ? "Action Req" : "All Good",
                        isPositive: unreadInquiries === 0,
                        iconName: "messageSquare" as IconName,
                        href: "/admin/leads",
                        color: unreadInquiries > 0 ? "text-red-400" : "text-green-400"
                    }
                ];
            } catch (error) {
                console.error("Dashboard Stats Error (returning defaults):", error);
                // Return default zeroed stats to allow UI to render
                return [
                    { title: "Total Views", value: "—", trend: "Offline", isPositive: false, iconName: "activity" as IconName, href: "#", color: "text-gray-400" },
                    { title: "Blog Posts", value: "—", trend: "Offline", isPositive: false, iconName: "fileText" as IconName, href: "#", color: "text-gray-400" },
                    { title: "Projects", value: "—", trend: "Offline", isPositive: false, iconName: "monitor" as IconName, href: "#", color: "text-gray-400" },
                    { title: "Active Services", value: "—", trend: "Offline", isPositive: false, iconName: "monitor" as IconName, href: "#", color: "text-gray-400" },
                    { title: "Subscribers", value: "—", trend: "Offline", isPositive: false, iconName: "messageSquare" as IconName, href: "#", color: "text-gray-400" },
                    { title: "Pending Inquiries", value: "—", trend: "Offline", isPositive: false, iconName: "messageSquare" as IconName, href: "#", color: "text-gray-400" }
                ];
            }
        },
        ["dashboard-stats"],
        { revalidate: 300, tags: ["dashboard"] } // 5 minutes cache
    );

    return getCachedStats();
}

export async function getRecentActivity() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    // Cache recent activity for 1 minute (semi-realtime)
    const getCachedActivity = unstable_cache(
        async () => {
            try {
                const logs = await prisma.auditLog.findMany({
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                });

                return logs.map(log => ({
                    id: log.id,
                    user: log.user?.name || log.user?.email || "System",
                    action: formatAction(log.action, log.entity),
                    time: formatDate(log.createdAt),
                    type: getIconType(log.entity)
                }));
            } catch (error) {
                console.error("Recent Activity Error (returning empty):", error);
                return [];
            }
        },
        ["recent-activity"],
        { revalidate: 60, tags: ["dashboard", "activity"] }
    );

    return getCachedActivity();
}

function formatAction(action: string, entity: string | null) {
    // Make "contact.submission" -> "submitted a contact form"
    // Make "post.create" -> "created a post"
    const map: Record<string, string> = {
        "contact.submission": "submitted a contact form",
        "newsletter.subscribe": "subscribed to newsletter",
        "user.login": "logged in",
        "post.create": "created a post",
        "post.update": "updated a post",
        "post.delete": "deleted a post",
    };

    if (map[action]) return map[action];
    return action.replace(".", " ");
}

function getIconType(entity: string | null): IconName {
    if (!entity) return "system";
    if (entity.includes("Contact")) return "inbox";
    if (entity.includes("Blog") || entity.includes("Post")) return "blog";
    if (entity.includes("File")) return "file";
    return "system";
}

function formatDate(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString();
}
