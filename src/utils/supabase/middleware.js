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

    // Normalize pathname by removing locale prefix for route checks
    let normalizedPath = pathname
    for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`)) {
            normalizedPath = pathname.replace(`/${locale}`, '')
            break
        }
    }

    // 3. Protected Routes Check (BEFORE i18n redirects)
    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some(route => normalizedPath.includes(route))

    if (isProtectedRoute && !user) {
        // Preserve locale in redirect URL
        const signinPath = pathnameHasLocale ? `/${pathname.split('/')[1]}/auth/signin` : '/auth/signin'
        return NextResponse.redirect(new URL(signinPath, request.url))
    }

    // Redirect /en to / (hide default locale)
    if (pathname.startsWith(`/${defaultLocale}/`) || pathname === `/${defaultLocale}`) {
        const newPath = pathname.replace(`/${defaultLocale}`, '') || '/';
        return NextResponse.redirect(new URL(newPath, request.url))
    }

    if (!pathnameHasLocale && !isInternal) {
        const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale
        // If locale is default (en), rewrite instead of redirect to keep clean URL
        if (locale === defaultLocale) {
            return NextResponse.rewrite(new URL(`/${locale}${pathname}`, request.url))
        } else {
            return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
        }
    }

    // 4. Maintenance Mode Check
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

    // 5. Admin Security
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

    // 6. Auth Page Redirect
    if ((pathname.includes('/auth/signin') || pathname.includes('/auth/signup')) && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}
