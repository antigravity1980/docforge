import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function DebugPage() {
    const cookieStore = await cookies();

    // Manual check for supabase token
    const allCookies = cookieStore.getAll();
    const supabaseCookies = allCookies.filter(c => c.name.startsWith('sb-'));

    // Try to get session
    let sessionUser = 'No session';
    try {
        const supabase = createServerComponentClient({ cookies: () => cookieStore });
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            sessionUser = data.session.user.email;
        }
    } catch (e) {
        sessionUser = 'Error getting session: ' + e.message;
    }

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace', background: '#fff', color: '#000' }}>
            <h1>Debug Info</h1>
            <p><strong>Time:</strong> {new Date().toISOString()}</p>
            <hr />
            <h2>Session Status</h2>
            <p>User: <strong>{sessionUser}</strong></p>
            <hr />
            <h2>Cookies ({allCookies.length})</h2>
            <ul>
                {allCookies.map(c => (
                    <li key={c.name}>
                        <strong>{c.name}</strong>: {c.value.substring(0, 10)}... (Path: {c.path}, Secure: {c.secure ? 'Yes' : 'No'})
                    </li>
                ))}
            </ul>
        </div>
    );
}
