import { authLimiter, contactLimiter, newsletterLimiter } from '@/lib/rate-limit';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'development_super_secret_key_change_me');

const PUBLIC_AUTH_ROUTES = [
    '/admin/login',
    '/admin/register',
    '/admin/forgot-password',
    '/admin/reset-password',
];

// Standard rate limit denial response with proper headers
function rateLimitResponse(limit: number, remaining: number, reset: number) {
    return new NextResponse(JSON.stringify({ error: 'Too Many Requests. Please try again later.' }), {
        status: 429,
        headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
    });
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // ─── 1. Rate Limiting for Public APIs ───
    if (pathname === '/api/auth/login' || pathname === '/api/auth/verify-2fa') {
        const { success, limit, remaining, reset } = await authLimiter.limit(ip);
        if (!success) return rateLimitResponse(limit, remaining, reset);
    }

    if (pathname === '/api/contact') {
        const { success, limit, remaining, reset } = await contactLimiter.limit(ip);
        if (!success) return rateLimitResponse(limit, remaining, reset);
    }

    if (pathname === '/api/newsletter') {
        const { success, limit, remaining, reset } = await newsletterLimiter.limit(ip);
        if (!success) return rateLimitResponse(limit, remaining, reset);
    }

    // ─── 2. Protect Admin Routes ───
    if (pathname.startsWith('/admin')) {
        const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some(
            route => pathname === route || pathname.startsWith(route + '/')
        );

        if (isPublicAuthRoute) {
            // Redirect already-authenticated users away from login
            if (pathname === '/admin/login') {
                const token = request.cookies.get('session_token')?.value;
                if (token) {
                    try {
                        await jwtVerify(token, JWT_SECRET);
                        return NextResponse.redirect(new URL('/admin', request.url));
                    } catch {
                        // Invalid token — allow access to login page
                    }
                }
            }
            return NextResponse.next();
        }

        // Protected admin route — require valid JWT
        const token = request.cookies.get('session_token')?.value;

        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            // Preserve return URL for post-login redirect
            if (pathname !== '/admin') {
                loginUrl.searchParams.set('returnUrl', pathname);
            }
            return NextResponse.redirect(loginUrl);
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            const response = NextResponse.next();
            // Prevent caching of authenticated admin pages
            response.headers.set('x-middleware-cache', 'no-cache');
            return response;
        } catch {
            // Invalid/expired token — clear and redirect to login
            const loginUrl = new URL('/admin/login', request.url);
            if (pathname !== '/admin') {
                loginUrl.searchParams.set('returnUrl', pathname);
            }
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('session_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/auth/login',
        '/api/auth/verify-2fa',
        '/api/contact',
        '/api/newsletter',
    ],
};
