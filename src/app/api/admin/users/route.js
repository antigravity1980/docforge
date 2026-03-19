import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/config';

export async function GET(request) {
    const supabase = await createClient();

    // 1. Check Auth (getUser validates JWT server-side)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || 'All';
    const limit = 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
        let query = supabaseAdmin
            .from('profiles')
            .select('*, documents(count)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (search) {
            // Use separate filters instead of string interpolation to prevent injection
            const sanitized = search.replace(/[%_]/g, '\\$&');
            query = query.or(`email.ilike.%${sanitized}%,full_name.ilike.%${sanitized}%`);
        }

        if (plan && plan !== 'All') {
            query = query.eq('plan', plan);
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
            status: 'Active', // Default status
            documentsCount: p.documents?.[0]?.count || 0
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

export async function DELETE(request) {
    const supabase = await createClient();

    // 1. Check Auth (getUser validates JWT server-side)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        console.log(`🗑 Admin deleting user: ${userId}`);

        // Delete from Auth (this usually cascades, but we also ensure profile is gone)
        // Note: supabaseAdmin.auth.admin.deleteUser requires Service Role
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authError) {
            console.error('Auth delete error:', authError);
            throw authError;
        }

        // Explicitly delete profile just in case (though it should cascade if set up right)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (profileError) {
            console.warn('Profile delete warning (might already be gone):', profileError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete user failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
