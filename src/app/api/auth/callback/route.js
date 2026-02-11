import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = createRouteHandlerClient({ cookies });
        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
                console.error('OAuth exchange error:', error.message);
                return NextResponse.redirect(`${origin}/auth/signin?error=auth-code-error`);
            }
        } catch (e) {
            console.error('Critical callback error:', e.message);
            return NextResponse.redirect(`${origin}/auth/signin?error=server-error`);
        }
    }

    // URL to redirect to after sign in process completes
    // We redirect to /dashboard and let middleware handle i18n redirect
    return NextResponse.redirect(`${origin}/dashboard`);
}
