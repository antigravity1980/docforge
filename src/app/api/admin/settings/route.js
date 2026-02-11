import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/config';

export async function GET() {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
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

    return NextResponse.json(settings);
}

export async function POST(req) {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updates = await req.json();

    for (const [key, value] of Object.entries(updates)) {
        const { error } = await supabase
            .from('settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true });
}
