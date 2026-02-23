"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";
import { ContentStatus, Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createPaginatedResult, getPaginationParams, PaginatedResponse } from "@/lib/pagination";

import { BlogPostSummary } from "@/types";
import { PaginationParams } from "@/types/pagination";

export type BlogFilter = PaginationParams & {
    category?: string;
    status?: string;
    search?: string;
};

export async function getBlogPosts(params: BlogFilter = {}): Promise<PaginatedResponse<BlogPostSummary>> {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { search, category, status } = params;

    const where: Prisma.BlogPostWhereInput = {
        deletedAt: null,
    };

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (category && category !== "All Categories") {
        where.category = { name: category };
    }

    if (status && status !== "All Status") {
        // Map UI "Draft" to ContentStatus.DRAFT
        const statusMap: Record<string, ContentStatus> = {
            "Draft": ContentStatus.DRAFT,
            "In Review": ContentStatus.IN_REVIEW,
            "Published": ContentStatus.PUBLISHED,
            "Archived": ContentStatus.ARCHIVED
        };
        if (statusMap[status]) {
            where.status = statusMap[status];
        }
    }

    const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
            where,
            skip,
            take: limit,
            orderBy: { updatedAt: 'desc' },
            include: {
                category: true,
                author: { select: { name: true } }
            }
        }),
        prisma.blogPost.count({ where })
    ]);

    const data: BlogPostSummary[] = posts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category?.name || "Uncategorized",
        status: formatStatus(p.status),
        views: p.views.toLocaleString(),
        date: p.updatedAt.toLocaleDateString(),
        author: p.author.name
    }));

    return createPaginatedResult(data, total, page, limit);
}

import { uuidSchema } from "@/lib/validations";

export async function getBlogPost(id: string) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);
    const validatedId = uuidSchema.parse(id);

    const post = await prisma.blogPost.findUnique({
        where: { id: validatedId },
        include: { category: true }
    });

    if (!post) return null;

    return {
        ...post,
        category: post.category?.name || "Technology",
        status: formatStatus(post.status)
    };
}

export async function createBlogPost(data: any) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);
    const parsed = blogPostSchema.parse(data);

    let finalStatus = parseStatus(data.status);
    // Enforce Approval Workflow: Only SUPER_ADMIN can directly Publish
    if (finalStatus === ContentStatus.PUBLISHED && user.role !== Role.SUPER_ADMIN) {
        finalStatus = ContentStatus.IN_REVIEW;
    }

    const post = await prisma.blogPost.create({
        data: {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            featuredImage: data.image,
            status: finalStatus,
            publishedAt: finalStatus === ContentStatus.PUBLISHED ? new Date() : null,
            author: { connect: { id: user.id } },
            category: data.category ? {
                connectOrCreate: {
                    where: { name: data.category },
                    create: {
                        name: data.category,
                        slug: data.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    }
                }
            } : undefined
        }
    });

    await logAudit({
        action: "post.create",
        entity: "BlogPost",
        entityId: post.id,
        userId: user.id,
        metadata: { title: post.title }
    });

    revalidatePath("/admin/blog");
    return { success: true, id: post.id };
}

export async function updateBlogPost(id: string, data: any) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);
    const validatedId = uuidSchema.parse(id);
    const parsed = blogPostSchema.partial().parse(data);

    // Optimistic locking (Phase 3)
    const currentVersion = data.version;

    let finalStatus = parseStatus(data.status);
    // Enforce Approval Workflow: Only SUPER_ADMIN can directly Publish
    if (finalStatus === ContentStatus.PUBLISHED && user.role !== Role.SUPER_ADMIN) {
        finalStatus = ContentStatus.IN_REVIEW;
    }

    try {
        const post = await prisma.blogPost.update({
            where: {
                id: validatedId,
                ...(typeof currentVersion === 'number' ? { version: currentVersion } : {})
            },
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                featuredImage: data.image,
                status: finalStatus,
                ...(finalStatus === ContentStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
                category: data.category ? {
                    connectOrCreate: {
                        where: { name: data.category },
                        create: {
                            name: data.category,
                            slug: data.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                        }
                    }
                } : undefined,
                version: { increment: 1 }
            }
        });

        await logAudit({
            action: "post.update",
            entity: "BlogPost",
            entityId: post.id,
            userId: user.id,
            metadata: { title: post.title }
        });

        revalidatePath("/admin/blog");
        revalidatePath(`/admin/blog/${id}`);
        return { success: true, id };
    } catch (error: any) {
        if (error.code === 'P2025') {
            throw new Error("Concurrency conflict: This post has been modified by another user. Please refresh and try again.");
        }
        throw error;
    }
}

export async function deleteBlogPost(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const validatedId = uuidSchema.parse(id);

    const post = await prisma.blogPost.update({
        where: { id: validatedId },
        data: { deletedAt: new Date() }
    });

    await logAudit({
        action: "post.delete",
        entity: "BlogPost",
        entityId: post.id,
        userId: user.id,
        metadata: { title: post.title }
    });

    revalidatePath("/admin/blog");
    return { success: true };
}

// Helpers
function formatStatus(status: ContentStatus): string {
    if (status === "PUBLISHED") return "Published";
    if (status === "DRAFT") return "Draft";
    if (status === "IN_REVIEW") return "In Review";
    if (status === "ARCHIVED") return "Archived";
    return status;
}

function parseStatus(status: string): ContentStatus {
    if (status === "Published") return ContentStatus.PUBLISHED;
    if (status === "Draft") return ContentStatus.DRAFT;
    if (status === "In Review") return ContentStatus.IN_REVIEW;
    if (status === "Archived") return ContentStatus.ARCHIVED;
    return ContentStatus.DRAFT;
}
