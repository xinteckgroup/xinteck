import { logAudit } from '@/lib/audit';
import { createSession, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email("Valid email required"),
    password: z.string().min(1, "Password required"),
    rememberMe: z.boolean().optional(),
});

/*
Purpose: Handle user login via API credentials.
Decision: We validate input, verify password hash, and issue a secure HTTP-only cookie session to maintain stateless authentication relative to the server.
*/
export async function POST(req: Request) {
    try {
        const rawData = await req.json();

        // Purpose: Validate input structure before touching the database to prevent injection or malformed queries.
        const validation = loginSchema.safeParse(rawData);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const { email, password, rememberMe } = validation.data;

        // ... (User finding and validation steps remain the same) ...
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        /*
        Purpose: Create a new session record.
        Decision: We persist the session in the database to allow for server-side revocation (e.g., "Log out all devices").
        */
        const { session, token } = await createSession(user, !user.twoFactorEnabled);

        // 5. Update lastActiveAt
        await prisma.user.update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() }
        });

        // If 2FA is enabled, do NOT set the final cookie yet.
        // Return the token to the client so it can be used for 2FA verification.
        if (user.twoFactorEnabled) {
            return NextResponse.json({
                success: true,
                requires2FA: true,
                preAuthToken: token,
                message: "2FA Required"
            });
        }

        // Purpose: Log the successful login for security auditing and suspicious activity monitoring.
        await logAudit({
            action: "user.login",
            entity: "User",
            entityId: user.id,
            metadata: {
                email: user.email,
                userAgent: req.headers.get("user-agent") || "unknown",
                rememberMe
            }
        });

        /*
        Purpose: Set the session cookie on the client.
        Decision: HttpOnly and Secure flags are mandatory to prevent XSS theft and Man-in-the-Middle attacks.
        */
        // 30 days if rememberMe, else 1 day (or session)
        const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

        const cookieStore = await cookies();
        cookieStore.set('session_token', token, {
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
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

