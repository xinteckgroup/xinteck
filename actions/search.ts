'use server';

import { getCurrentUser } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export type SearchResult =
    | { type: 'user'; id: string; title: string; subtitle: string; url: string }
    | { type: 'project'; id: string; title: string; subtitle: string; url: string }
    | { type: 'post'; id: string; title: string; subtitle: string; url: string }
    | { type: 'service'; id: string; title: string; subtitle: string; url: string }
    | { type: 'page'; id: string; title: string; subtitle: string; url: string };

export type SearchGroup = {
    label: string;
    results: SearchResult[];
};

export async function searchGlobal(query: string): Promise<SearchGroup[]> {
    if (!query || query.length < 2) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const lowerQuery = query.toLowerCase();

    // Parallelize DB queries
    const [users, projects, posts, services] = await Promise.all([
        // 1. Users (Search by name or email)
        prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 5,
            select: { id: true, name: true, email: true, role: true }
        }),

        // 2. Projects (Search by title)
        prisma.project.findMany({
            where: {
                title: { contains: query, mode: 'insensitive' }
            },
            take: 5,
            select: { id: true, title: true, slug: true }
        }),

        // 3. Blog Posts (Search by title)
        prisma.blogPost.findMany({
            where: {
                title: { contains: query, mode: 'insensitive' }
            },
            take: 5,
            select: { id: true, title: true, slug: true }
        }),

        // 4. Services (Search by name)
        prisma.service.findMany({
            where: {
                name: { contains: query, mode: 'insensitive' }
            },
            take: 5,
            select: { id: true, name: true, description: true }
        })
    ]);

    // 5. Static Pages (Navigation)
    const allPages = [
        { title: "Dashboard", url: "/admin", keywords: ["home", "main", "stats"] },
        { title: "My Profile", url: "/admin/profile", keywords: ["account", "me", "avatar"] },
        { title: "Security Settings", url: "/admin/profile/security", keywords: ["password", "mfa", "2fa"] },
        { title: "Leads", url: "/admin/leads", keywords: ["messages", "contact", "mail", "leads", "inquiries"] },
        { title: "Newsletter", url: "/admin/newsletter", keywords: ["email", "subscribers"] },
        { title: "File Manager", url: "/admin/files", keywords: ["assets", "images", "upload"] },
        { title: "Audit Log", url: "/admin/audit", role: Role.ADMIN, keywords: ["history", "logs", "tracking"] },
        { title: "System Settings", url: "/admin/settings", role: Role.SUPER_ADMIN, keywords: ["config", "env", "system"] },
        { title: "Staff Management", url: "/admin/staff", role: Role.ADMIN, keywords: ["users", "employees", "roles"] },
    ];

    const matchedPages = allPages.filter(page => {
        // RBAC Check
        if (page.role && user.role !== page.role && user.role !== Role.SUPER_ADMIN) return false;

        // Match title or keywords
        return page.title.toLowerCase().includes(lowerQuery) ||
            page.keywords.some(k => k.includes(lowerQuery));
    }).map(page => ({
        type: 'page' as const,
        id: page.url,
        title: page.title,
        subtitle: "Navigation",
        url: page.url
    }));

    // Format Results
    const results: SearchGroup[] = [];

    if (matchedPages.length > 0) {
        results.push({ label: "Pages", results: matchedPages });
    }

    if (users.length > 0) {
        results.push({
            label: "Users",
            results: users.map((u: { id: string; name: string | null; email: string | null; role: Role }) => ({
                type: 'user',
                id: u.id,
                title: u.name || "Unknown User",
                subtitle: `${u.role} • ${u.email}`,
                url: `/admin/staff?edit=${u.id}` // Navigate to staff list, ideally highlighting the user
            }))
        });
    }

    if (projects.length > 0) {
        results.push({
            label: "Projects",
            results: projects.map((p: { id: string; title: string; slug: string }) => ({
                type: 'project',
                id: p.id,
                title: p.title,
                subtitle: "Project",
                url: `/admin/projects/${p.id}`
            }))
        });
    }

    if (posts.length > 0) {
        results.push({
            label: "Blog Posts",
            results: posts.map((p: { id: string; title: string; slug: string }) => ({
                type: 'post',
                id: p.id,
                title: p.title,
                subtitle: "Blog Post",
                url: `/admin/blog/${p.id}`
            }))
        });
    }

    if (services.length > 0) {
        results.push({
            label: "Services",
            results: services.map((s: { id: string; name: string; description: string | null }) => ({
                type: 'service',
                id: s.id,
                title: s.name,
                subtitle: s.description?.substring(0, 30) + "..." || "Service",
                url: `/admin/services/${s.id}`
            }))
        });
    }

    return results;
}
