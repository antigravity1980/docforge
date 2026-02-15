import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request) {
    // 0. Force www -> non-www redirect (for SEO consistency)
    const hostname = request.headers.get('host') || ''
    if (hostname.startsWith('www.')) {
        const url = request.nextUrl.clone()
        url.host = hostname.replace('www.', '')
        return Response.redirect(url, 301)
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
