import { logAudit } from '@/lib/audit';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';
import { z } from 'zod';

const verify2faSchema = z.object({
    preAuthToken: z.string().min(1, "Session token required"),
    code: z.string().length(6, "Code must be 6 digits"),
    rememberMe: z.boolean().optional(),
});

/*
Purpose: Verify the 2FA code provided during login.
Decision: We validate the code using otpauth. If successful, we update the session as verified and set the final HttpOnly cookie.
*/
export async function POST(req: Request) {
    try {
        const rawData = await req.json();

        const validation = verify2faSchema.safeParse(rawData);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const { preAuthToken, code, rememberMe } = validation.data;

        // Verify the pre-auth session token. We do it manually because `verifySession` blocks unverified 2FA sessions.
        // We just need to check if the session exists and is valid in the DB.
        const session = await prisma.session.findUnique({
            where: { token: preAuthToken },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            return NextResponse.json({ error: 'Session expired or invalid. Please log in again.' }, { status: 401 });
        }

        const user = session.user;

        if (!user.twoFactorEnabled || !user.twoFactorSecret) {
            return NextResponse.json({ error: '2FA is not enabled for this user.' }, { status: 400 });
        }

        // Verify TOTP code
        const totp = new OTPAuth.TOTP({
            issuer: "Xinteck Admin",
            label: user.email,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret)
        });

        const delta = totp.validate({ token: code, window: 1 });
        const isValid = delta !== null;

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid 2FA code.' }, { status: 401 });
        }

        // Update session as verified
        await prisma.session.update({
            where: { id: session.id },
            data: { twoFactorVerified: true }
        });

        await logAudit({
            action: "user.login_2fa",
            entity: "User",
            entityId: user.id,
            metadata: {
                email: user.email,
                userAgent: req.headers.get("user-agent") || "unknown",
            }
        });

        const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

        const cookieStore = await cookies();
        cookieStore.set('session_token', preAuthToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: maxAge,
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Verify 2FA error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
