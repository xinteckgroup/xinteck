import { prisma } from "@/lib/prisma";
import { ContentStatus, ProjectStatus } from "@prisma/client";
import { format } from "date-fns";

export interface PublicPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    readTime: string;
    tag: string;
    content?: string;
    image?: string;
    featuredImage?: string;
}

export interface PublicProject {
    slug: string;
    title: string;
    category: string;
    description: string;
    tags: string[];
    year: string;
    client: string;
    role: string;
    image: string;
    content?: string;
}


export interface PublicService {
    slug: string;
    title: string;
    subName?: string;
    description: string;
    features: string[];
    iconName?: string;
    stats?: { label: string; val: string }[];
    capabilitiesTitle?: string;
    process?: any[]; // Legacy, removing
    cta?: any; // Legacy, removing
    image?: string | null;
    section1?: { title?: string; subtitle?: string; image?: string };
    section2?: { title?: string; description?: string };
    section3?: { title?: string; description?: string };
    section4?: { title?: string; steps?: any[] };
    buyNowSection?: { title?: string; description?: string; button?: string };
    freshnessSection?: { title?: string; description?: string };
}


/* Helper for dynamic read time calculation */
function calculateReadTime(content: string = ""): string {
    const rawText = content.replace(/<[^>]*>?/gm, ''); // Strip HTML if present
    const cleanStr = rawText.replace(/[^a-zA-Z ]/g, ""); // Strip markdown chars implicitly
    const words = cleanStr.trim().split(/\s+/).filter(w => w.length > 0).length;
    const minutes = Math.ceil((words > 0 ? words : 1) / 200); // Avg reading speed: 200wpm
    return `${Math.max(1, minutes)} min read`;
}

/*
Purpose: Fetch published blog posts for the public feed.
Decision: Returns a simplified `PublicPost` interface to avoid leaking internal DB fields like `authorId` or `version`.
*/
export async function getPublicPosts(): Promise<PublicPost[]> {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { status: ContentStatus.PUBLISHED, publishedAt: { not: null } },
            orderBy: { publishedAt: 'desc' },
            include: { author: true, category: true }
        });

        return posts.map(post => ({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || "",
            date: post.publishedAt ? format(post.publishedAt, "MMM dd, yyyy") : "",
            author: post.author.name || "Team Xinteck",
            readTime: calculateReadTime(post.content || ""),
            tag: post.category?.name || "Tech",
            image: post.featuredImage || ""
        }));
    } catch (error) {
        // Purpose: Fail gracefully (return empty array) to ensure the landing page never crashes due to DB errors.
        console.error("Failed to fetch public posts:", error);
        return [];
    }
}

export async function getPublicPost(slug: string): Promise<PublicPost | null> {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug },
            include: { author: true, category: true }
        });

        if (!post || post.status !== ContentStatus.PUBLISHED) return null;

        return {
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || "",
            date: post.publishedAt ? format(post.publishedAt, "MMM dd, yyyy") : "",
            author: post.author.name || "Team Xinteck",
            readTime: calculateReadTime(post.content || ""),
            tag: post.category?.name || "Tech",
            content: post.content,
            image: post.featuredImage || "",
            featuredImage: post.featuredImage || ""
        };
    } catch (error) {
        console.error(`Failed to fetch public post ${slug}:`, error);
        return null;
    }
}

export async function getPublicProjects(): Promise<PublicProject[]> {
    try {
        const projects = await prisma.project.findMany({
            where: { status: { in: [ProjectStatus.COMPLETED, ProjectStatus.ACTIVE] } },
            orderBy: { completionDate: 'desc' }
        });

        return projects.map(p => ({
            slug: p.slug,
            title: p.title,
            category: p.category.replace(/_/g, ' '),
            description: p.description || "",
            tags: p.tags || [],
            year: p.completionDate ? p.completionDate.getFullYear().toString() : new Date().getFullYear().toString(),
            client: p.client || "",
            role: p.role || "Development",
            image: p.coverImage || "/images/placeholder.jpg"
        }));
    } catch (error) {
        console.error("Failed to fetch public projects:", error);
        return [
            {
                slug: "fintech-revolution",
                title: "Fintech Revolution (Demo)",
                category: "Financial Tech",
                description: "System demonstration mode. Database unavailable.",
                tags: ["Demo", "System"],
                year: "2024",
                client: "Internal",
                role: "Demo",
                image: "/images/placeholder.jpg",
            }
        ];
    }
}

export async function getPublicProject(slug: string): Promise<PublicProject | null> {
    try {
        const p = await prisma.project.findUnique({
            where: { slug },
        });

        if (!p || (p.status !== ProjectStatus.COMPLETED && p.status !== ProjectStatus.ACTIVE)) return null;

        return {
            slug: p.slug,
            title: p.title,
            category: p.category.replace(/_/g, ' '),
            description: p.description || "",
            tags: p.tags || [],
            year: p.completionDate ? p.completionDate.getFullYear().toString() : new Date().getFullYear().toString(),
            client: p.client || "",
            role: p.role || "Development",
            image: p.coverImage || "/images/placeholder.jpg",
            content: p.content || ""
        };
    } catch (error) {
        console.error(`Failed to fetch public project ${slug}:`, error);
        return null;
    }
}

export async function getFeaturedProject(): Promise<PublicProject | null> {
    try {
        const p = await prisma.project.findFirst({
            where: { status: ProjectStatus.COMPLETED },
            orderBy: { completionDate: 'desc' }
        });

        if (p) {
            return {
                slug: p.slug,
                title: p.title,
                category: p.category.replace(/_/g, ' '),
                description: p.description || "",
                tags: p.tags || [],
                year: p.completionDate ? p.completionDate.getFullYear().toString() : new Date().getFullYear().toString(),
                client: p.client || "",
                role: p.role || "Development",
                image: p.coverImage || "/images/placeholder.jpg",
                content: p.content || ""
            };
        }
    } catch (error) {
        // Purpose: Log the error but proceed to fallback to keep the site functional.
        console.warn("Database unavailable, returning fallback featured project:", error);
    }

    // Fallback data when database is empty OR errors out
    return {
        slug: "fintech-revolution",
        title: "Fintech Revolution",
        category: "Financial Tech",
        description: "A complete overhaul of a legacy banking system, migrating 5M+ users to a secure, cloud-native infrastructure with zero downtime.",
        tags: ["Cloud", "Security", "Migration"],
        year: "2024",
        client: "Global Bank Corp",
        role: "Full Stack Development",
        image: "/images/placeholder.jpg",
        content: "Full case study content..."
    };
}

export async function getPublicServices() {
    try {
        const services = await prisma.service.findMany({
            where: { status: ContentStatus.PUBLISHED },
            orderBy: { sortOrder: 'asc' }
        });

        return services.map(s => ({
            slug: s.slug,
            title: s.name,
            subName: s.subName,
            description: s.description,
            image: s.image,
            features: s.features,
        }));
    } catch (error) {
        console.error("Failed to fetch services:", error);
        // Minimal fallback to prevent 500
        return [];
    }
}


export async function getPublicService(slug: string): Promise<PublicService | null> {
    try {
        const s = await prisma.service.findUnique({
            where: { slug },
        });

        if (!s || s.status !== ContentStatus.PUBLISHED) return null;

        // Helper to safely access JSON
        const section1 = s.section1 as any || {};
        const section4 = s.section4 as any || {};
        const details = s.detailsSection as any || {};
        const buyNow = s.buyNowSection as any || {};
        const section2 = s.section2 as any || {};
        const section3 = s.section3 as any || {};
        const freshness = s.freshnessSection as any || {};

        return {
            slug: s.slug,
            title: s.name,
            subName: s.subName,
            description: s.description,
            image: (s as any).image,
            features: s.features,
            capabilitiesTitle: details.title || "WHAT WE BUILD.",
            stats: Array.isArray(s.stats) ? (s.stats as any[]) : [],
            section1: { title: section1.title, subtitle: section1.subtitle, image: section1.image },
            section2: { title: section2.title, description: section2.description },
            section3: { title: section3.title, description: section3.description },
            section4: { title: section4.title || "HOW WE DELIVER.", steps: section4.steps || [] },
            freshnessSection: { title: freshness.title, description: freshness.description },
            buyNowSection: {
                title: buyNow.title || "READY TO BUILD?",
                description: buyNow.description || "Let's discuss your project.",
                button: buyNow.button || "Start Now"
            }
        };
    } catch (error) {
        console.error(`Failed to fetch service ${slug}:`, error);
        return null;
    }
}

/**
 * Lightweight fetch for navigation items (FloatingDock, Footer, ServicesFeatured).
 * Returns only { name, slug } to avoid leaking internal fields.
 */
export async function getServiceNavItems(): Promise<{ name: string; slug: string }[]> {
    try {
        const services = await prisma.service.findMany({
            where: { status: ContentStatus.PUBLISHED },
            orderBy: { sortOrder: 'asc' },
            select: { name: true, slug: true },
        });

        return services.map(s => ({ name: s.name, slug: s.slug }));
    } catch (error) {
        console.error("Failed to fetch service nav items:", error);
        // Hardcoded fallback to prevent broken navigation
        return [
            { name: "Web Development", slug: "web-development" },
            { name: "Mobile App Development", slug: "mobile-app-development" },
            { name: "Custom Software Development", slug: "custom-software-development" },
            { name: "UI/UX Design", slug: "ui-ux-design" },
            { name: "Cloud & DevOps", slug: "cloud-devops" },
        ];
    }
}
