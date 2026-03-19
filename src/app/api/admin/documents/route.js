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
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (search) {
            query = query.or(`title.ilike.%${search}%,id.eq.${search}`);
        }

        const { data: docs, count, error } = await query;

        if (error) throw error;

        // Fetch user emails separately to avoid foreign key schema constraints
        const userIds = [...new Set(docs.map(d => d.user_id))];
        let userMap = {};
        
        if (userIds.length > 0) {
            const { data: profiles, error: profileError } = await supabaseAdmin
                .from('profiles')
                .select('id, email')
                .in('id', userIds);
            
            if (!profileError && profiles) {
                profiles.forEach(p => {
                    userMap[p.id] = p.email;
                });
            }
        }

        // Transform data for UI
        const logs = docs.map(d => ({
            id: d.id,
            user: userMap[d.user_id] || 'Unknown User',
            type: d.type || 'Unknown Topic',
            tokens: 'N/A',
            time: new Date(d.created_at).toLocaleString(),
            status: 'Success'
        }));

        // Fetch overall stats by template type
        let stats = [];
        const { data: allTypes, error: statsError } = await supabaseAdmin
            .from('documents')
            .select('type');
        
        if (!statsError && allTypes) {
            const counts = allTypes.reduce((acc, doc) => {
                const t = doc.type || 'Uncategorized';
                acc[t] = (acc[t] || 0) + 1;
                return acc;
            }, {});
            
            stats = Object.entries(counts)
                .map(([type, count]) => ({ type, count }))
                .sort((a, b) => b.count - a.count);
        }

        return NextResponse.json({
            logs,
            stats,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        console.error('Admin Documents API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
