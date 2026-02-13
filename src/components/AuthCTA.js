'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthCTA({
    locale,
    className,
    children,
    defaultHref = '/auth/signup',
    authHref = '/dashboard',
    style = {}
}) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsLoggedIn(true);
            }
            setChecked(true);
        };
        checkSession();
    }, []);

    const handleClick = (e) => {
        e.preventDefault();

        // If still checking, default to the href (signup) or wait? 
        // Better to just let router handle it if we are sure.
        // If we know they are logged in, go to dashboard.
        if (checked && isLoggedIn) {
            router.push(`/${locale}${authHref}`);
        } else {
            router.push(`/${locale}${defaultHref}`);
        }
    };

    // We render a Link but hijack the click.
    // This allows SEO to see the 'signup' link (default behavior) which is good.
    return (
        <Link
            href={`/${locale}${defaultHref}`}
            onClick={handleClick}
            className={className}
            style={style}
        >
            {children}
        </Link>
    );
}
