import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Cron Job: Reset monthly document generation counters.
 * Triggered on the 1st of each month at 00:05 UTC via Vercel Cron.
 * 
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(request) {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error('❌ Cron: Unauthorized request');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('🔄 Cron: Resetting monthly document counters...');

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({ docs_generated_this_month: 0 })
            .gt('docs_generated_this_month', 0)
            .select('id');

        if (error) {
            console.error('❌ Cron: Reset failed:', error);
            throw error;
        }

        const resetCount = data?.length || 0;
        console.log(`✅ Cron: Reset ${resetCount} user counters to 0.`);

        return NextResponse.json({
            success: true,
            resetCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Cron Job Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
