import { NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { setupLemonSqueezy } from '@/lib/lemonsqueezy';
import { createClient } from '@/utils/supabase/server';

export async function POST(req) {
    try {
        setupLemonSqueezy();

        // 1. Get Variant ID from request
        const { variantId, planName } = await req.json();

        if (!variantId) {
            return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
        }

        // 2. Auth check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please sign in to continue.' }, { status: 401 });
        }

        const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
        const LS_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;

        if (!LS_API_KEY) {
            return NextResponse.json({ error: 'Server configuration error: LEMON_SQUEEZY_API_KEY is missing' }, { status: 500 });
        }
        if (!storeId) {
            return NextResponse.json({ error: 'Server configuration error: LEMON_SQUEEZY_STORE_ID is missing' }, { status: 500 });
        }

        // 3. Create Checkout using the official SDK
        const { data, error } = await createCheckout(storeId, variantId, {
            checkoutData: {
                email: user.email,
                custom: {
                    user_id: user.id,
                    plan_name: planName || 'Unknown'
                },
            },
            productOptions: {
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            },
        });

        if (error) {
            console.error('Lemon Squeezy SDK Error:', error);
            return NextResponse.json({ 
                error: 'Lemon Squeezy Error', 
                details: error.message 
            }, { status: 500 });
        }

        // 4. Return the checkout URL
        return NextResponse.json({ 
            checkoutUrl: data.data.attributes.url,
            url: data.data.attributes.url 
        });

    } catch (error) {
        console.error('Unexpected error in /api/checkout:', error);
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: error.message 
        }, { status: 500 });
    }
}
