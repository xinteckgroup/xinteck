/**
 * Runtime environment variable validation.
 * Called from instrumentation.ts on server startup.
 * 
 * Categories:
 *   REQUIRED  — App will not function without these
 *   RECOMMENDED — Core features degraded if missing (email, rate limiting, cron)
 *   OPTIONAL  — Feature-specific (analytics, AI, media, monitoring)
 */
export function validateEnv() {
    const required: string[] = [
        "DATABASE_URL",
        "JWT_SECRET",
        "ENCRYPTION_KEY",
        "NEXTAUTH_SECRET",
    ];

    const recommended: string[] = [
        // Email (booking confirmations, contact alerts, newsletters, team invites)
        "RESEND_API_KEY",
        "RESEND_FROM_EMAIL",

        // Application URL (sitemap, robots, email links, OG metadata)
        "NEXT_PUBLIC_APP_URL",

        // Rate limiting (auth, contact, newsletter)
        "UPSTASH_REDIS_REST_URL",
        "UPSTASH_REDIS_REST_TOKEN",

        // Cron job auth (booking reminder emails)
        "CRON_SECRET",
    ];

    const optional: string[] = [
        // Email recipients
        "RESEND_TO_EMAIL",

        // Inbound email webhook
        "INBOUND_WEBHOOK_SECRET",

        // Media uploads
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",

        // AI
        "GEMINI_API_KEY",

        // Analytics
        "NEXT_PUBLIC_GA_ID",
        "NEXT_PUBLIC_META_PIXEL_ID",
        "NEXT_PUBLIC_LINKEDIN_PARTNER_ID",

        // Error monitoring
        "NEXT_PUBLIC_SENTRY_DSN",

        // Newsletter
        "NEXT_PUBLIC_SITE_URL",

        // Deployment
        "VERCEL_OIDC_TOKEN",
    ];

    // 1. Required — fail hard
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(
            `❌ Missing REQUIRED environment variables: ${missing.join(", ")}\n` +
            `   See .env.example for the full reference.`
        );
    }

    // 2. Recommended — warn prominently
    const missingRecommended = recommended.filter((key) => !process.env[key]);
    if (missingRecommended.length > 0) {
        console.warn(
            `⚠️  Missing RECOMMENDED environment variables (core features may be degraded):\n` +
            missingRecommended.map((k) => `   • ${k}`).join("\n")
        );
    }

    // 3. Optional — quiet info log
    const missingOptional = optional.filter((key) => !process.env[key]);
    if (missingOptional.length > 0) {
        console.info(
            `ℹ️  Missing optional environment variables (some features disabled):\n` +
            missingOptional.map((k) => `   • ${k}`).join("\n")
        );
    }
}
