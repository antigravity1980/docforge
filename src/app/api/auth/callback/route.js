import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const cookieStore = await cookies();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Missing Supabase environment variables');
            return NextResponse.json({ error: 'Internal Server Error: Missing credentials' }, { status: 500 });
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (error) {
                            console.error('Cookie set error:', error.message);
                        }
                    },
                },
            }
        );

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
    return NextResponse.redirect(`${origin}/dashboard`);
}
