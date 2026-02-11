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
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (search) {
            query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
        }

        const { data: profiles, count, error } = await query;

        if (error) throw error;

        // Transform data for UI
        const users = profiles.map(p => ({
            id: p.id,
            name: p.full_name || 'No Name',
            email: p.email,
            plan: p.plan || 'Free',
            registered: new Date(p.created_at).toLocaleDateString(),
            status: 'Active' // Default status
        }));

        return NextResponse.json({
            users,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        console.error('Admin Users API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
