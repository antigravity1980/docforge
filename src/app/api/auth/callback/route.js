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
            const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

            console.log('Exchanging code for session...');
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('OAuth exchange error:', error.message);
                return NextResponse.redirect(`${origin}/auth/signin?error=auth-code-error&details=${encodeURIComponent(error.message)}`);
            }

            console.log('Session exchanged successfully. User:', data.session?.user?.email);
            console.log('Session ID:', data.session?.user?.id);
        } catch (e) {
            console.error('Critical callback error:', e.message);
            return NextResponse.redirect(`${origin}/auth/signin?error=server-error&details=${encodeURIComponent(e.message)}`);
        }
    } else {
        console.warn('No code provided in callback');
    }

    // URL to redirect to after sign in process completes
    console.log(`Redirecting to ${origin}/dashboard`);
    return NextResponse.redirect(`${origin}/dashboard`);
}
