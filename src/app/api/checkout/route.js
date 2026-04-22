import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({ 
            status: "success", 
            message: "API is reachable", 
            receivedVariantId: body.variantId 
        });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
