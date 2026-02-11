import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/config';

export async function GET() {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Use supabaseAdmin to bypass RLS
    const { data, error } = await supabaseAdmin
        .from('settings')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert array to object key:value
    const settings = data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    return NextResponse.json({ settings });
}

export async function POST(req) {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updates = await req.json();

    for (const [key, value] of Object.entries(updates)) {
        // Use supabaseAdmin to bypass RLS for updates
        const { error } = await supabaseAdmin
            .from('settings')
            .upsert({ key, value: String(value), updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) {
            console.error('Settings update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true });
}
