import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'development_super_secret_key_change_me');
const SALT_ROUNDS = 10;
const SESSION_EXPIRY = '7d';


// Purpose: Verify a plaintext password against the stored hash.
export async function verifyPassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
}

/*
Purpose: Create a stateful session for an authenticated user.
Decision: We use a database-backed session (via Prisma) combined with a signed JWT to allowing both quick stateless validation (if needed) and server-side revocation.
*/
export async function createSession(user: Pick<User, 'id' | 'email' | 'role' | 'name' | 'twoFactorEnabled'>, isTwoFactorVerified: boolean = false) {
    // Purpose: Set session expiry to 7 days to reduce login friction for admins.
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    /*
    Purpose: Generate a signed JWT as the session token.
    Decision: Signing the token prevents tampering, and the payload provides immediate context without a DB lookup in some edge layers.
    */
    const token = await new SignJWT({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        twoFactorVerified: isTwoFactorVerified
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(SESSION_EXPIRY)
        .sign(JWT_SECRET);

    // Purpose: Persist the session to allow for auditing and revocation (e.g., "Log out all devices").
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            token,
            expiresAt: expires,
            twoFactorVerified: isTwoFactorVerified
        },
    });

    return { session, token };
}

export async function verifySession(token: string) {
    try {
        // Purpose: Cryptographically verify the token structure and signature first.
        const { payload } = await jwtVerify(token, JWT_SECRET);

        /*
        Purpose: Validate against the database to ensure the session hasn't been explicitly revoked.
        Decision: This dual-check (crypto + DB) is the gold standard for secure, revokable sessions.
        */
        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            return null;
        }

        // Enforce 2FA strictly at the session verification level
        if (session.user.twoFactorEnabled && !session.twoFactorVerified) {
            return null; // Session is invalid if 2FA is required but not verified
        }

        return {
            valid: true,
            user: session.user,
            payload
        };
    } catch (error) {
        return null;
    }
}

// Purpose: Terminate a session by removing it from the database, effectively logging the user out.
export async function destroySession(token: string) {
    await prisma.session.deleteMany({
        where: { token }
    });
}
