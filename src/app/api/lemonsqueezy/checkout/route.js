import { NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { setupLemonSqueezy } from '@/lib/lemonsqueezy';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req) {
    try {
        setupLemonSqueezy();

        const { variantId, userEmail, userId, planName } = await req.json();

        if (!variantId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

        const { data, error } = await createCheckout(storeId, variantId, {
            checkoutData: {
                email: userEmail,
                custom: {
                    user_id: userId,
                    plan_name: planName
                },
            },
            productOptions: {
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            },
        });

        if (error) {
            console.error('Lemon Squeezy checkout error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ url: data.data.attributes.url });
    } catch (error) {
        console.error('Checkout API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
