import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/config';

export async function GET() {
    const supabase = await createClient();

    // 1. Check Auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        // 2. Fetch Stats using Admin Client (bypasses RLS for counts)

        // Total Users
        const { count: usersCount, error: usersError } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // New Users (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: newUsersCount, error: newUsersError } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', thirtyDaysAgo.toISOString());

        if (newUsersError) throw newUsersError;

        // Total Documents
        const { count: docsCount, error: docsError } = await supabaseAdmin
            .from('documents')
            .select('*', { count: 'exact', head: true });

        if (docsError) throw docsError;

        // Revenue (Mocked for now as we don't have a payments table yet, or it's empty)
        // In future: sum amount from 'payments' table
        const totalRevenue = 0;

        // 3. Mock Chart Data (until we have real historical data points)
        // We will generate a realistic looking chart based on the real counts if possible, 
        // or just keep the mock pattern but with dynamic scaling.

        const stats = [
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, change: '+0%', icon: '💰', color: '#10b981' },
            { label: 'Total Users', value: usersCount || 0, change: `+${newUsersCount || 0}`, icon: '👤', color: '#6366f1' },
            { label: 'Docs Generated', value: docsCount || 0, change: '+0%', icon: '📝', color: '#8b5cf6' },
            { label: 'Conversion Rate', value: '0%', change: '0%', icon: '📈', color: '#f59e0b' },
        ];

        return NextResponse.json({ stats });

    } catch (error) {
        console.error('Admin Stats API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
