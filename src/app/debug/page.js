'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
    const [cookies, setCookies] = useState('');
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get browser cookies
        setCookies(document.cookie);

        // 2. Get Supabase session (client-side)
        async function checkSession() {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        }
        checkSession();
    }, []);

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace', color: '#333' }}>
            <h1>Client-Side Debug</h1>
            <hr />
            <h3>Session:</h3>
            <pre>{loading ? 'Loading...' : (session ? `${session.user.email} (${session.user.id})` : 'NO SESSION')}</pre>

            <hr />
            <h3>Raw Cookies:</h3>
            <div style={{ wordBreak: 'break-all', background: '#f0f0f0', padding: '10px' }}>
                {cookies || 'No cookies found'}
            </div>
        </div>
    );
}
