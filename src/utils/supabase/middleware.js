import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { ADMIN_EMAILS } from '@/lib/config'

export async function updateSession(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. Create Supabase Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 2. Refresh Session
    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl
    const pathname = url.pathname

    // --- i18n Logic (Preserved) ---
    const locales = ['en', 'fr', 'de', 'es', 'it', 'pt']
    const defaultLocale = 'en'
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (!pathnameHasLocale) {
        const isInternal = pathname.startsWith('/api') ||
            pathname.startsWith('/_next') ||
            pathname.startsWith('/admin') ||
            pathname.includes('.') ||
            pathname === '/robots.txt' ||
            pathname === '/sitemap.xml' ||
            pathname === '/auth/v1/callback' // Exclude Supabase auth callback if it hits middleware

        if (!isInternal) {
            const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale
            return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
        }
    }

    // --- Security Logic ---

    // 3. Admin Protection
    if (pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/auth/signin', request.url))
        }
        const userEmail = user.email
        const isConfigAdmin = ADMIN_EMAILS.includes(userEmail)
        const isMetaAdmin = user.app_metadata?.role === 'admin'

        if (!isConfigAdmin && !isMetaAdmin) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // 4. Protected Routes
    const protectedRoutes = ['/dashboard', '/generate']
    const isProtectedRoute = protectedRoutes.some(route => pathname.includes(route)) // .includes handles /en/dashboard etc

    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // 5. Auth Page Redirect (if logged in)
    if ((pathname.includes('/auth/signin') || pathname.includes('/auth/signup')) && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}
