import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { ADMIN_EMAILS } from '@/lib/config'

export async function updateSession(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

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

    // 1. Refresh Session & Get User
    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl
    const pathname = url.pathname

    // 2. i18n Logic
    const locales = ['en', 'fr', 'de', 'es', 'it', 'pt']
    const defaultLocale = 'en'
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    // Helper to identify internal paths
    const isInternal = pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/admin') || // Admin is handled separately but is considered "internal" structure-wise
        pathname.includes('.') ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml' ||
        pathname === '/auth/v1/callback'

    if (!pathnameHasLocale && !isInternal) {
        const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
    }

    // 3. Maintenance Mode Check
    // optimization: only check if not accessing assets or admin api
    if (!pathname.startsWith('/_next') && !pathname.includes('.')) {
        try {
            const { data: setting } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'maintenanceMode')
                .single()

            const maintenanceMode = setting?.value === 'true'

            if (maintenanceMode) {
                // Allow:
                // 1. Admin/Auth/API routes
                // 2. The Maintenance page itself
                // 3. Admin users (checked by email or metadata)

                const isAllowedRoute =
                    pathname.startsWith('/admin') ||
                    pathname.startsWith('/api') ||
                    pathname.includes('/auth') ||
                    pathname.includes('/maintenance');

                const userEmail = user?.email
                const isAdmin = userEmail && (ADMIN_EMAILS.includes(userEmail) || user?.app_metadata?.role === 'admin')

                if (!isAllowedRoute && !isAdmin) {
                    // Extract locale to redirect to correct maintenance page
                    const localeMatch = pathname.match(/^\/([a-z]{2})/);
                    const locale = localeMatch ? localeMatch[1] : defaultLocale;
                    return NextResponse.redirect(new URL(`/${locale}/maintenance`, request.url))
                }
            }
        } catch (error) {
            // If DB fails, default to allowing access (fail open) vs blocking (fail closed). 
            // Fail open is safer for strictly maintenance check.
            console.error('Maintenance check failed:', error);
        }
    }

    // 4. Admin Security
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

    // 5. Protected Routes
    const protectedRoutes = ['/dashboard', '/generate']
    const isProtectedRoute = protectedRoutes.some(route => pathname.includes(route))

    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // 6. Auth Page Redirect
    if ((pathname.includes('/auth/signin') || pathname.includes('/auth/signup')) && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}
