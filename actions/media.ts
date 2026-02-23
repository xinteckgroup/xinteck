"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

import { createPaginatedResult, getPaginationParams, PaginatedResponse, PaginationParams } from "@/lib/pagination";
import { uuidSchema } from "@/lib/validations";

export type MediaFilter = PaginationParams & {
    search?: string;
    type?: "image" | "document" | "video" | "all";
    folderId?: string | null;
};

export async function getMediaFiles(params: MediaFilter = {}): Promise<PaginatedResponse<any>> {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { search, type, folderId } = params;

    const where: any = { deletedAt: null };

    if (search) {
        where.originalName = { contains: search, mode: 'insensitive' };
    }

    // ─── FILTER MODE vs NAVIGATION MODE ───

    const isFilterMode = type && type !== "all";

    if (isFilterMode) {
        // FILTER MODE: Ignore folder structure, show flat list by type
        if (type === "image") {
            where.mimeType = { startsWith: "image/" };
        } else if (type === "video") {
            where.mimeType = { startsWith: "video/" };
        } else if (type === "document") {
            // Documents are anything that isn't an image or video
            where.AND = [
                { mimeType: { not: { startsWith: "image/" } } },
                { mimeType: { not: { startsWith: "video/" } } }
            ];
        }
    } else {
        // NAVIGATION MODE (All Files): Respect specific folder
        if (!search) {
            // Only apply folder constraint if NOT searching 
            where.folderId = folderId;
        }
    }

    const [files, total] = await Promise.all([
        prisma.mediaFile.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: { uploadedBy: { select: { name: true } } }
        }),
        prisma.mediaFile.count({ where })
    ]);

    const data = files.map(f => ({
        id: f.id,
        name: f.originalName,
        size: formatBytes(f.size),
        type: f.mimeType.startsWith('image/') ? 'image' : f.mimeType.startsWith('video/') ? 'video' : 'document',
        date: f.createdAt.toLocaleDateString(),
        url: f.url,
        folderId: f.folderId,
        mimeType: f.mimeType
    }));

    return createPaginatedResult(data, total, page, limit);
}

// ─── FOLDER ACTIONS ───

export async function getFolders(parentId: string | null = null) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);
    return await prisma.mediaFolder.findMany({
        where: { parentId },
        orderBy: { name: 'asc' },
        include: { _count: { select: { files: true } } }
    });
}

export async function createFolder(name: string, parentId: string | null = null) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    // Check dupe
    const existing = await prisma.mediaFolder.findFirst({
        where: { name, parentId }
    });
    if (existing) throw new Error("Folder already exists");

    const folder = await prisma.mediaFolder.create({
        data: { name, parentId }
    });

    await logAudit({
        action: "media.folder_create",
        entity: "MediaFolder",
        entityId: folder.id,
        userId: user.id,
        metadata: { name, parentId }
    });

    return folder;
}

export async function deleteFolder(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const validatedId = uuidSchema.parse(id);

    const folder = await prisma.mediaFolder.findUnique({
        where: { id: validatedId },
    });

    if (!folder) return;

    // 1. Move files to root (or parent)
    // We choose root (null) for safety to ensure they are visible at top level
    await prisma.mediaFile.updateMany({
        where: { folderId: validatedId },
        data: { folderId: folder.parentId }
    });

    // 2. Move subfolders to root (or parent) to prevent FK constraint failure
    await prisma.mediaFolder.updateMany({
        where: { parentId: validatedId },
        data: { parentId: folder.parentId }
    });

    // 3. Delete the folder
    await prisma.mediaFolder.delete({ where: { id: validatedId } });

    await logAudit({
        action: "media.folder_delete",
        entity: "MediaFolder",
        entityId: validatedId,
        userId: user.id,
        metadata: { name: folder.name }
    });

    revalidatePath("/admin/files");
}

export async function uploadFile(formData: FormData, folderId?: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    // ─── VALIDATION ───
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB (Increased for video support)
    const ALLOWED_MIME_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
        "video/mp4",
        "video/webm",
        "video/quicktime"
    ];

    if (file.size > MAX_SIZE) {
        throw new Error(`File size exceeds the limit of ${MAX_SIZE / (1024 * 1024)}MB.`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error("Invalid file type. Allowed: Images, PDF, MP4, WebM, MOV.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dynamic Config
    const cloud_name = await INTERNAL_getSecret("CLOUDINARY_CLOUD_NAME");
    const api_key = await INTERNAL_getSecret("CLOUDINARY_API_KEY");
    const api_secret = await INTERNAL_getSecret("CLOUDINARY_API_SECRET");

    if (!cloud_name || !api_key || !api_secret) {
        console.error("Cloudinary Configuration Error details: ", {
            cloud_name: cloud_name ? "Set" : "Missing",
            api_key: api_key ? "Set" : "Missing",
            api_secret: api_secret ? "Set" : "Missing"
        });
        throw new Error("Cloudinary configuration missing. Please check System Settings.");
    }

    cloudinary.config({
        cloud_name,
        api_key,
        api_secret,
        secure: true
    });

    try {
        // Upload to Cloudinary using a promise wrapper around the stream
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "xinteck_uploads",
                    resource_type: "auto", // Handle images, videos, raw files key for video support
                    public_id: file.name.split('.')[0] + "_" + Date.now(),
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // Save metadata to DB
        const media = await prisma.mediaFile.create({
            data: {
                name: result.public_id,
                originalName: file.name,
                mimeType: file.type,
                size: result.bytes,
                url: result.secure_url,
                uploadedById: user.id,
                folderId: folderId || null
            }
        });

        await logAudit({
            action: "media.upload",
            entity: "MediaFile",
            entityId: media.id,
            userId: user.id,
            metadata: {
                fileName: file.name,
                cloudinaryId: result.public_id
            }
        });

        revalidatePath("/admin/files");
        return { success: true, url: result.secure_url };

    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload file to media storage");
    }
}

export async function deleteFile(id: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    const file = await prisma.mediaFile.findUnique({ where: { id: validatedId } });
    if (!file) return;

    // Soft delete in DB
    await prisma.mediaFile.update({ where: { id: validatedId }, data: { deletedAt: new Date() } });

    // Remove from Cloudinary
    try {
        const cloud_name = await INTERNAL_getSecret("CLOUDINARY_CLOUD_NAME");
        const api_key = await INTERNAL_getSecret("CLOUDINARY_API_KEY");
        const api_secret = await INTERNAL_getSecret("CLOUDINARY_API_SECRET");

        if (cloud_name && api_key && api_secret) {
            cloudinary.config({ cloud_name, api_key, api_secret, secure: true });

            // Determine resource type for deletion (video/image)
            const resourceType = file.mimeType.startsWith('video/') ? 'video' : 'image';
            // Note: Cloudinary default is 'image', need to specify if video

            const publicId = file.publicId || file.name;
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        }
    } catch (e) {
        console.error("Failed to delete file from Cloudinary:", e);
    }

    await logAudit({
        action: "media.delete",
        entity: "MediaFile",
        entityId: id,
        userId: user.id,
        metadata: { fileName: file.originalName }
    });

    revalidatePath("/admin/files");
    return { success: true };
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

