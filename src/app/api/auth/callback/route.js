import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Build dashboard URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://docforge.site';
    const dashboardUrl = origin.includes('localhost') ? `${origin}/dashboard` : `${baseUrl}/dashboard`;

    // CRITICAL: Return an HTML page with a client-side redirect instead of a 302.
    // Android Chrome/Yandex automatically switches to "Desktop site" mode when
    // following long chains of 302 redirects across multiple domains
    // (Google → Supabase → our callback → dashboard).
    // Returning an HTML page breaks this chain and forces the browser to stay
    // in mobile mode. The page includes a viewport meta tag and uses both
    // meta refresh and JavaScript redirect for maximum compatibility.
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0;url=${dashboardUrl}">
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to dashboard...</p>
    <script>window.location.replace("${dashboardUrl}");</script>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    });
}
