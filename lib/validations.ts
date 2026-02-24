import { z } from "zod";

/*
Purpose: Centralized Zod schemas for application-wide validation.
Decision: We strictly sanitize inputs (trim/min/max) here to ensure database integrity and prevent injection attacks before data reaches the ORM.
*/

export const uuidSchema = z.string()
    .min(1, "Identifier is required")
    .trim();

// Purpose: Auth schemas enforce strong password policies and email normalization.

export const registerSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
    email: z.string().trim().email("Valid email required"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(8, "New password must be at least 8 characters").max(128, "Password too long"),
});

export const resetPasswordSchema = z.object({
    token: z.string().trim().min(1, "Token required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
});

export const updateProfileSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
    email: z.string().trim().email("Valid email required"),
    avatar: z.string().trim().url("Invalid avatar URL").optional().nullable(),
});

// Purpose: Blog schemas handle complex content validation including slugs and optional metadata.

export const blogPostSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title too long"),
    slug: z.string().trim().min(1, "Slug is required").max(200, "Slug too long")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
    excerpt: z.string().trim().max(500, "Excerpt too long").optional().nullable(),
    content: z.string().max(100000, "Content exceeds 100,000 character maximum. Please split into multiple posts.").optional().nullable(),
    category: z.string().trim().optional().nullable(),
    status: z.enum(["Draft", "Published", "Archived"]).default("Draft"),
    image: z.string().trim().optional().nullable().or(z.literal("")),
    version: z.number().int().nonnegative().optional(),
});

// Purpose: Project schemas ensure URL validity and client data consistency.

export const projectSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title too long"),
    client: z.string().trim().max(100, "Client name too long").optional().nullable(),
    url: z.string().trim().url("Invalid URL").optional().nullable().or(z.literal("")),
    description: z.string().trim().max(5000, "Description too long").optional().nullable(),
    content: z.string().max(100000, "Content exceeds 100,000 character maximum. Please shorten the case study.").optional().nullable(),
    category: z.string().trim().optional().nullable(),
    status: z.string().trim().optional().nullable(),
    role: z.string().trim().max(100, "Role too long").optional().nullable().or(z.literal("")),
    tags: z.array(z.string().trim().max(50, "Tag too long")).max(10, "Too many tags").optional().default([]),
    image: z.string().trim().optional().nullable().or(z.literal("")),
    completionDate: z.string().trim().optional().nullable(),
    version: z.number().int().nonnegative().optional(),
});

// Purpose: Service schemas validate complex nested feature arrays and JSON-stored section data.

export const serviceSchema = z.object({
    name: z.string().trim().min(1, "Service name is required").max(100, "Name too long"),
    subName: z.string().trim().max(200, "Sub name too long").optional().nullable(),
    image: z.string().trim().optional().nullable().or(z.literal("")),
    slug: z.string().trim().min(1, "Slug is required").max(100, "Slug too long")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
    price: z.string().trim().max(50, "Price too long").optional().nullable(),
    description: z.string().trim().max(5000, "Description too long").optional().nullable(),

    features: z.array(z.string().trim()).default([]),

    // Strict JSON Schemas
    stats: z.array(z.object({
        label: z.string().trim(),
        val: z.string().trim()
    })).default([]),

    section1: z.object({
        title: z.string().trim().optional(),
        subtitle: z.string().trim().optional(),
        image: z.string().trim().optional()
    }).default({}),

    section2: z.object({
        title: z.string().trim().optional(),
        description: z.string().trim().optional()
    }).default({}),

    section3: z.object({
        title: z.string().trim().optional(),
        description: z.string().trim().optional()
    }).default({}),

    section4: z.object({
        title: z.string().trim().optional(),
        steps: z.array(z.object({
            title: z.string().trim(),
            description: z.string().trim()
        })).optional()
    }).default({}),

    detailsSection: z.object({
        title: z.string().trim().optional(),
        description: z.string().trim().optional(),
        imageAlt: z.string().trim().optional()
    }).default({}),

    freshnessSection: z.object({
        title: z.string().trim().optional(),
        description: z.string().trim().optional()
    }).default({}),

    buyNowSection: z.object({
        title: z.string().trim().optional(),
        description: z.string().trim().optional(),
        button: z.string().trim().optional(),
        price: z.string().trim().optional(),
        unit: z.string().trim().optional(),
        processingParams: z.array(z.string()).optional(),
        deliveryPromise: z.string().optional(),
        returnPolicy: z.string().optional()
    }).default({}),

    budgetRanges: z.array(z.string().trim()).default(["$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"]),

    status: z.string().default("Draft"),
    version: z.number().int().nonnegative().optional(),
});

// Purpose: Contact schemas protect against spam and ensure messages meet minimum length requirements.

export const contactSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().trim().email("Valid email required"),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message too long"),
});

export const replySchema = z.object({
    content: z.string().trim().min(1, "Reply content is required").max(10000, "Reply too long"),
});

// Purpose: Staff schemas restrict role assignment to valid enums during invitation.

export const inviteStaffSchema = z.object({
    email: z.string().trim().email("Valid email required"),
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
    role: z.enum(["Super Admin", "Admin", "Support Staff"]),
});

// Purpose: Settings schemas validate environment configuration and public/private key-value pairs.

export const settingSchema = z.object({
    key: z.string().trim().min(1, "Key is required").max(100, "Key too long"),
    value: z.string().trim().max(10000, "Value too long"),
});

export const siteSettingSchema = settingSchema.extend({
    // Purpose: Enforce uppercase naming convention for consistency and prevent "SECRET_" prefix to avoid accidental exposure of private keys.
    key: z.string().trim().min(1).max(100)
        .regex(/^[A-Z0-9_]+$/, "Key must be uppercase alphanumeric with underscores (e.g. SITE_NAME)")
        .refine(val => !val.startsWith("SECRET_") && !val.startsWith("PRIVATE_"), "Cannot start with SECRET_ or PRIVATE_"),
    type: z.string().trim().optional(),
    category: z.string().trim().optional(),
    isPublic: z.boolean().optional(),
    description: z.string().trim().max(500, "Description too long").optional(),
});

export const settingsStateSchema = z.object({
    cloudinaryCloudName: z.string().trim().optional(),
    cloudinaryApiKey: z.string().trim().optional(),
    cloudinaryApiSecret: z.string().trim().optional(),
    resendApiKey: z.string().trim().optional(),
    resendFromEmail: z.string().trim().email().optional().or(z.literal("")),
    resendToEmail: z.string().trim().email().optional().or(z.literal("")),
    vercelOidcToken: z.string().trim().optional(),
    geminiApiKey: z.string().trim().optional(),
});
