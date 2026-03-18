import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export default NextAuth(authConfig).auth((req) => {
    const { pathname } = req.nextUrl;

    // Public routes — no auth needed
    const publicPaths = ['/login', '/register', '/api/auth'];
    const isPublic = publicPaths.some((path) => pathname.startsWith(path));

    if (isPublic) {
        return NextResponse.next();
    }

    // Protected API routes — return 401 if not authenticated
    if (pathname.startsWith('/api/')) {
        if (!req.auth) {
            return NextResponse.json(
                { error: 'UNAUTHORIZED', message: 'Authentication required' },
                { status: 401 }
            );
        }
        return NextResponse.next();
    }

    // Protected pages — redirect to login if not authenticated
    if (!req.auth) {
        const loginUrl = new URL('/login', req.nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
