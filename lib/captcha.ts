import crypto from "crypto";

const CAPTCHA_SECRET =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "xinteck-discovery-captcha-secret-salt-2026";

// In-memory set to prevent replay attacks (used tokens cannot be submitted again)
const usedTokensCache = new Set<string>();

// Cleanup stale tokens every 15 minutes to prevent memory leak
setInterval(() => {
    usedTokensCache.clear();
}, 15 * 60 * 1000);

export interface CaptchaChallenge {
    num1: number;
    num2: number;
    token: string;
    expiresAt: number;
}

/**
 * Generate a cryptographically signed Math Captcha challenge.
 * Valid for 10 minutes.
 */
export function generateCaptchaChallenge(): CaptchaChallenge {
    // Generate clean positive integers (3 to 19)
    const num1 = crypto.randomInt(3, 20);
    const num2 = crypto.randomInt(3, 20);
    const answer = num1 + num2;
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    const payload = `${num1}:${num2}:${answer}:${expiresAt}`;
    const signature = crypto
        .createHmac("sha256", CAPTCHA_SECRET)
        .update(payload)
        .digest("hex");

    const token = `${signature}.${Buffer.from(payload).toString("base64")}`;

    return {
        num1,
        num2,
        token,
        expiresAt,
    };
}

/**
 * Cryptographically verify the client's Math Captcha solution.
 * Handles tampering, expiration, non-numeric input, arithmetic mismatch, and replay attacks.
 */
export function verifyCaptchaSolution(
    token: string | undefined | null,
    userAnswer: number | string | undefined | null
): { valid: boolean; error?: string } {
    if (!token || typeof token !== "string" || token.trim() === "") {
        return { valid: false, error: "Security check is required." };
    }

    if (userAnswer === undefined || userAnswer === null || String(userAnswer).trim() === "") {
        return { valid: false, error: "Please solve the security check challenge." };
    }

    // Replay attack prevention: single use per token
    if (usedTokensCache.has(token)) {
        return {
            valid: false,
            error: "Security verification token already used. Please refresh the challenge.",
        };
    }

    const dotIndex = token.indexOf(".");
    if (dotIndex === -1) {
        return { valid: false, error: "Invalid security check token structure." };
    }

    const signature = token.substring(0, dotIndex);
    const encodedPayload = token.substring(dotIndex + 1);

    try {
        const payload = Buffer.from(encodedPayload, "base64").toString("utf8");
        const expectedSignature = crypto
            .createHmac("sha256", CAPTCHA_SECRET)
            .update(payload)
            .digest("hex");

        // Constant time comparison to prevent timing attacks
        const sigBuffer = Buffer.from(signature, "hex");
        const expectedBuffer = Buffer.from(expectedSignature, "hex");

        if (
            sigBuffer.length !== expectedBuffer.length ||
            !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
        ) {
            return { valid: false, error: "Security check verification failed." };
        }

        const [n1Str, n2Str, ansStr, expStr] = payload.split(":");
        const num1 = parseInt(n1Str, 10);
        const num2 = parseInt(n2Str, 10);
        const expectedAnswer = parseInt(ansStr, 10);
        const expiresAt = parseInt(expStr, 10);

        // Expiration check
        if (Date.now() > expiresAt) {
            return {
                valid: false,
                error: "Security challenge expired. Please refresh the calculation.",
            };
        }

        // Parse and validate user's input
        const cleanAnswer = String(userAnswer).trim();
        const parsedUserAnswer = parseInt(cleanAnswer, 10);

        if (isNaN(parsedUserAnswer) || !/^-?\d+$/.test(cleanAnswer)) {
            return { valid: false, error: "Please enter a valid numeric number." };
        }

        if (parsedUserAnswer !== expectedAnswer || parsedUserAnswer !== num1 + num2) {
            return { valid: false, error: "Incorrect security calculation. Please try again." };
        }

        // Mark token as used to prevent replay attacks
        usedTokensCache.add(token);

        return { valid: true };
    } catch {
        return { valid: false, error: "Security verification error. Please refresh and try again." };
    }
}
