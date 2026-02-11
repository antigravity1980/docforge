import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        console.log('Exchange Code:', code.substring(0, 10) + '...');

        try {
            const cookieStore = await cookies();

            // Create a custom cookie adapter to bridge Next.js 15 async cookies with auth-helpers
            const supabase = createRouteHandlerClient({
                cookies: () => ({
                    get(name) {
                        return cookieStore.get(name)?.value;
                    },
                    getAll() {
                        return cookieStore.getAll();
                    },
                    set(name, value, options) {
                        console.log(`Setting cookie: ${name}`);
                        try {
                            cookieStore.set(name, value, options);
                        } catch (err) {
                            console.error(`Failed to set cookie ${name}:`, err);
                        }
                    },
                    remove(name, options) {
                        console.log(`Removing cookie: ${name}`);
                        try {
                            cookieStore.set(name, '', { ...options, maxAge: 0 });
                        } catch (err) {
                            console.error(`Failed to remove cookie ${name}:`, err);
                        }
                    },
                })
            });

            console.log('Exchanging code for session...');
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('OAuth exchange error:', error.message);
                return NextResponse.redirect(`${origin}/auth/signin?error=auth-code-error&details=${encodeURIComponent(error.message)}`);
            }

            console.log('Session exchanged successfully. User:', data.session?.user?.email);
        } catch (e) {
            console.error('Critical callback error:', e.message);
            return NextResponse.redirect(`${origin}/auth/signin?error=server-error&details=${encodeURIComponent(e.message)}`);
        }
    } else {
        console.warn('No code provided in callback');
    }

    // Force strict HTTPS redirect to www to avoid cookie/protocol mismatches
    // Using hardcoded production URL to ensure we land on the correct domain where cookies are set
    const dashboardUrl = 'https://www.docforge.site/dashboard';
    console.log(`Redirecting to ${dashboardUrl}`);
    return NextResponse.redirect(dashboardUrl);
}
