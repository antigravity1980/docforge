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

        // 2. Auth check (optional but recommended for tracking)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        // If user is not logged in, we can still allow checkout but won't have their ID 
        // unless we pass it in custom data if they are in the process of signing up.
        // However, the existing logic requires auth, so we'll stick to that for safety.
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

        // 3. Create Checkout using the official SDK (more reliable than manual fetch)
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
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 4. Return the checkout URL
        return NextResponse.json({ 
            checkoutUrl: data.data.attributes.url, // Matches the guide's expected key
            url: data.data.attributes.url // For compatibility with existing components
        });

    } catch (error) {
        console.error('Unexpected error in /api/checkout:', error);
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        }, { status: 500 });
    }
}
