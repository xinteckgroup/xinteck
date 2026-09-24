import * as Sentry from "@sentry/nextjs";

/*
Purpose: Initialize Sentry error monitoring on the client side.
Decision: Base error tracking is considered essential (functional monitoring).
Session Replay is gated behind analytics consent — we check localStorage
at module load time since this runs before React mounts.
*/

// Check analytics consent from localStorage for replay gating
let analyticsConsented = false;
try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("cookie_consent") : null;
    if (raw === "true") {
        // Legacy format — treated as all accepted
        analyticsConsented = true;
    } else if (raw && raw !== "false") {
        const parsed = JSON.parse(raw);
        analyticsConsented = parsed?.analytics === true;
    }
} catch {}

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Session Replay — only enabled when analytics consent is given
    integrations: analyticsConsented ? [Sentry.replayIntegration()] : [],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    // (only applies when replay integration is loaded above)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});
