import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/config';

export async function middleware(req) {
    let res = NextResponse.next();
    const { pathname } = req.nextUrl;

    // --- 1. i18n Locale Logic ---
    const locales = ['en', 'fr', 'de', 'es', 'it', 'pt'];
    const defaultLocale = 'en';

    // Check if pathname has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        // Exclude api, static files, and admin (admin usually stays in one lang or separate)
        const isInternal = pathname.startsWith('/api') ||
            pathname.startsWith('/_next') ||
            pathname.startsWith('/admin') ||
            pathname.includes('.') || // static files like favicon.ico
            pathname === '/robots.txt' ||
            pathname === '/sitemap.xml';

        if (!isInternal) {
            // Get preferred language from headers or cookie
            const locale = req.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
        }
    }

    // --- 2. Supabase & Security Logic ---
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
                    res = NextResponse.next({
                        request: req,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // 1. Admin Security (RBAC - Role Based Access Control)
    if (pathname.startsWith('/admin')) {
        // Must be logged in
        if (!session) {
            return NextResponse.redirect(new URL('/auth/signin', req.url));
        }

        // Must be an admin
        const userEmail = session.user.email;
        const isConfigAdmin = ADMIN_EMAILS.includes(userEmail);
        const isMetaAdmin = session.user.app_metadata?.role === 'admin';

        if (!isConfigAdmin && !isMetaAdmin) {
            // Redirect non-admins to dashboard
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    // 2. User Dashboard & Generator Security
    const protectedRoutes = ['/dashboard', '/generate'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // 3. Redirect logged-in users away from auth pages
    if ((pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) && session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
