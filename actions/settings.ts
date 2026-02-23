"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { decrypt, encrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface EnvStatus {
    databaseUrl: boolean;
    postgresUrl: boolean;
    prismaDatabaseUrl: boolean;
    encryptionKey: boolean;
    nextAuthSecret: boolean;
}

export interface SettingsState {
    cloudinaryCloudName?: string;
    cloudinaryApiKey?: string;
    cloudinaryApiSecret?: string;
    resendApiKey?: string;
    resendFromEmail?: string;
    resendToEmail?: string;
    vercelOidcToken?: string;
    geminiApiKey?: string;
    envStatus?: EnvStatus;
}

export async function getSettings(showSecrets = false): Promise<SettingsState> {
    await requireRole([Role.SUPER_ADMIN]); // Only super admin

    const configs = await prisma.secretConfig.findMany({
        where: {
            key: {
                in: [
                    "CLOUDINARY_CLOUD_NAME",
                    "CLOUDINARY_API_KEY",
                    "CLOUDINARY_API_SECRET",
                    "RESEND_API_KEY",
                    "RESEND_FROM_EMAIL",
                    "RESEND_TO_EMAIL",
                    "RESEND_TO_EMAIL",
                    "VERCEL_OIDC_TOKEN",
                    "GEMINI_API_KEY"
                ]
            }
        }
    });

    const settings: Partial<SettingsState> = {};

    for (const config of configs) {
        let value = "";
        try {
            // Decrypt - new utility takes the whole string (iv:content:tag)
            const decrypted = decrypt(config.encryptedValue);

            if (showSecrets) {
                value = decrypted;
            } else {
                // Masking
                if (config.key.includes("KEY") || config.key.includes("SECRET") || config.key.includes("TOKEN")) {
                    value = decrypted.substring(0, 4) + "..." + decrypted.substring(decrypted.length - 4);
                } else {
                    value = decrypted;
                }
            }
        } catch (e) {
            console.error(`Failed to decrypt ${config.key}`, e);
            value = "ERROR_DECRYPTING";
        }

        // Map Keys to State Props
        switch (config.key) {
            case "CLOUDINARY_CLOUD_NAME": settings.cloudinaryCloudName = value; break;
            case "CLOUDINARY_API_KEY": settings.cloudinaryApiKey = value; break;
            case "CLOUDINARY_API_SECRET": settings.cloudinaryApiSecret = value; break;
            case "RESEND_API_KEY": settings.resendApiKey = value; break;
            case "RESEND_FROM_EMAIL": settings.resendFromEmail = value; break;
            case "RESEND_TO_EMAIL": settings.resendToEmail = value; break;
            case "VERCEL_OIDC_TOKEN": settings.vercelOidcToken = value; break;
            case "GEMINI_API_KEY": settings.geminiApiKey = value; break;
        }
    }

    // Default to env vars if not in DB
    if (!settings.cloudinaryCloudName) settings.cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    if (!settings.cloudinaryApiKey) settings.cloudinaryApiKey = process.env.CLOUDINARY_API_KEY ? mask(process.env.CLOUDINARY_API_KEY) : "";
    if (!settings.cloudinaryApiSecret) settings.cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET ? mask(process.env.CLOUDINARY_API_SECRET) : "";
    if (!settings.resendApiKey) settings.resendApiKey = process.env.RESEND_API_KEY ? mask(process.env.RESEND_API_KEY) : "";
    if (!settings.resendFromEmail) settings.resendFromEmail = process.env.RESEND_FROM_EMAIL || "";
    if (!settings.resendToEmail) settings.resendToEmail = process.env.RESEND_TO_EMAIL || "";
    if (!settings.vercelOidcToken) settings.vercelOidcToken = process.env.VERCEL_OIDC_TOKEN ? mask(process.env.VERCEL_OIDC_TOKEN) : "";
    if (!settings.geminiApiKey) settings.geminiApiKey = process.env.GEMINI_API_KEY ? mask(process.env.GEMINI_API_KEY) : "";

    // Env Status
    settings.envStatus = {
        databaseUrl: !!process.env.DATABASE_URL,
        postgresUrl: !!process.env.POSTGRES_URL,
        prismaDatabaseUrl: !!process.env.PRISMA_DATABASE_URL,
        encryptionKey: !!process.env.ENCRYPTION_KEY,
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    };

    return settings;
}

function mask(str: string) {
    if (str.length < 8) return "****";
    return str.substring(0, 4) + "..." + str.substring(str.length - 4);
}

import { settingsStateSchema } from "@/lib/validations";

export async function updateSettings(data: SettingsState) {
    const user = await requireRole([Role.SUPER_ADMIN]);
    const parsed = settingsStateSchema.parse(data);

    // Helper to upsert
    const save = async (key: string, value: string | undefined) => {
        if (!value || value.includes("...")) return; // Don't save masked values back!

        // New encryption returns "iv:content:tag"
        const encryptedString = encrypt(value);
        // Schema requires `iv` column (legacy/schema constraint). 
        // We extract IV from the string for the column, but the payload has it too.
        const iv = encryptedString.split(":")[0];

        await prisma.secretConfig.upsert({
            where: { key },
            update: {
                encryptedValue: encryptedString,
                iv,
                updatedAt: new Date()
            },
            create: {
                key,
                encryptedValue: encryptedString,
                iv
            }
        });
    };

    await save("CLOUDINARY_CLOUD_NAME", data.cloudinaryCloudName);
    await save("CLOUDINARY_API_KEY", data.cloudinaryApiKey);
    await save("CLOUDINARY_API_SECRET", data.cloudinaryApiSecret);
    await save("RESEND_API_KEY", data.resendApiKey);
    await save("RESEND_FROM_EMAIL", data.resendFromEmail);
    await save("RESEND_TO_EMAIL", data.resendToEmail);
    await save("VERCEL_OIDC_TOKEN", data.vercelOidcToken);
    await save("GEMINI_API_KEY", data.geminiApiKey);

    await logAudit({
        action: "secret_update",
        entity: "SecretConfig",
        userId: user.id,
        metadata: { keys: Object.keys(data).filter(k => k !== "envStatus") }
    });

    revalidatePath("/admin/settings");
}

// HELPER for internal usage (fetching full secrets)
export async function INTERNAL_getSecret(key: string): Promise<string | null> {
    // Check Env first? Or DB first?
    // Plan: DB overrides Env.

    const config = await prisma.secretConfig.findUnique({ where: { key } });
    if (config) {
        try {
            return decrypt(config.encryptedValue);
        } catch (e) {
            console.error(`Decryption failed for ${key}`, e);
        }
    }

    // Fallback to Env
    if (key === "CLOUDINARY_CLOUD_NAME" && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    }
    if (key === "CLOUDINARY_API_KEY" && process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY) {
        return process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    }
    if (key === "CLOUDINARY_API_SECRET" && process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET) {
        return process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
    }
    return process.env[key] || null;
}
