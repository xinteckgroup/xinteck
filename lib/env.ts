/**
 * Runtime environment variable validation.
 * Called from instrumentation.ts on server startup.
 */
export function validateEnv() {
    const required: string[] = [
        "DATABASE_URL",
        "JWT_SECRET",
    ];

    const optional: string[] = [
        "RESEND_API_KEY",
        "RESEND_FROM_EMAIL",
        "NEXT_PUBLIC_APP_URL",
        "UPSTASH_REDIS_REST_URL",
        "UPSTASH_REDIS_REST_TOKEN",
        "SENTRY_DSN",
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`
        );
    }

    const missingOptional = optional.filter((key) => !process.env[key]);
    if (missingOptional.length > 0) {
        console.warn(
            `⚠️  Missing optional environment variables: ${missingOptional.join(", ")}`
        );
    }
}
