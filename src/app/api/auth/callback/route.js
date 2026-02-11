import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // URL to redirect to after sign in process completes
    // Using hardcoded production URL to ensure we land on the correct domain where cookies are set
    // This is safer than relying on request origin which might be http in some environments
    const dashboardUrl = 'https://www.docforge.site/dashboard';

    // Check if we are on localhost
    if (origin.includes('localhost')) {
        return NextResponse.redirect(`${origin}/dashboard`);
    }

    return NextResponse.redirect(dashboardUrl);
}
