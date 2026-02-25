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

    // Redirect to dashboard using the configured app URL (without www)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://docforge.site';
    const dashboardUrl = origin.includes('localhost') ? `${origin}/dashboard` : `${baseUrl}/dashboard`;

    return NextResponse.redirect(dashboardUrl);
}
