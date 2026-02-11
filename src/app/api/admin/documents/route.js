import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/config';

export async function GET(request) {
    const supabase = await createClient();

    // 1. Check Auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
        let query = supabaseAdmin
            .from('documents')
            .select('*, profiles(email)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (search) {
            query = query.or(`title.ilike.%${search}%,id.eq.${search}`);
        }

        const { data: docs, count, error } = await query;

        if (error) throw error;

        // Transform data for UI
        const logs = docs.map(d => ({
            id: d.id,
            user: d.profiles?.email || 'Unknown',
            type: d.type,
            tokens: 'N/A', // We don't track tokens yet
            time: new Date(d.created_at).toLocaleString(),
            status: 'Success' // Assuming all saved docs are successes
        }));

        return NextResponse.json({
            logs,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        console.error('Admin Documents API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
