import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ADMIN_EMAILS } from '@/lib/config';

// GET: List all admins
export async function GET(request) {
    try {
        // 1. Fetch users from Supabase Auth (limit 1000 for now)
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
        });

        if (error) throw error;

        // 2. Filter users who have admin role OR are in the config whitelist
        const admins = users.filter(user => {
            const isConfigAdmin = ADMIN_EMAILS.includes(user.email);
            const isMetaAdmin = user.app_metadata?.role === 'admin';
            return isConfigAdmin || isMetaAdmin;
        }).map(user => ({
            id: user.id,
            email: user.email,
            last_sign_in: user.last_sign_in_at,
            source: ADMIN_EMAILS.includes(user.email) ? 'config' : 'database',
            role: user.app_metadata?.role || 'user'
        }));

        return NextResponse.json({ admins });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Add an admin (Promote user)
export async function POST(request) {
    try {
        const { email } = await request.json();

        // 1. Find user by email
        const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000 // Ineffecient for large scale, but works for MVP. Supabase doesn't have getUserByEmail in admin api directly exposed simply without id sometimes. 
            // Actually, strictly speaking `getUserByEmail' exists? No, only getUserById.
            // We have to list and find.
        });

        // Better: filtered list? No supported filter in listUsers for email.
        const user = users.find(u => u.email === email);

        if (!user) {
            return NextResponse.json({ error: 'User not found. They must sign up first.' }, { status: 404 });
        }

        // 2. Update app_metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { app_metadata: { role: 'admin' } }
        );

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, message: `${email} is now an admin.` });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove admin (Demote user)
export async function DELETE(request) {
    try {
        const { id, email } = await request.json();

        // Check if config admin (Safety net)
        if (email && ADMIN_EMAILS.includes(email)) {
            return NextResponse.json({ error: 'Cannot remove Super Admins defined in system config.' }, { status: 403 });
        }

        // Update app_metadata
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            id,
            { app_metadata: { role: 'user' } }
        );

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Admin rights revoked.' });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
