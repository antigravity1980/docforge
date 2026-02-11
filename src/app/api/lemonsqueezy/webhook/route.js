import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req) {
    try {
        const rawBody = await req.text();
        const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
        const digest = hmac.update(rawBody).digest('hex');
        const signature = req.headers.get('x-signature');

        if (signature !== digest) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        const customData = payload.meta.custom_data;

        const userId = customData?.user_id;

        if (!userId) {
            console.error('No user_id in webhook custom_data');
            return NextResponse.json({ error: 'No user_id found' }, { status: 400 });
        }

        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const planName = customData.plan_name || 'Pro'; // Fallback
            const status = payload.data.attributes.status;

            if (status === 'active') {
                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        plan: planName,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId);

                if (error) throw error;
            }
        }

        if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            const { error } = await supabaseAdmin
                .from('profiles')
                .update({
                    plan: 'Free',
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
    }
}
