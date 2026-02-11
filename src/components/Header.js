'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Logo from './Logo';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/lib/config';

export default function Header({ dict }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [session, setSession] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    // Determine current locale from pathname
    const segments = pathname ? pathname.split('/') : [''];
    const currentLocale = locales.includes(segments[1]) ? segments[1] : 'en';

    // Fallback if dict is missing (e.g. initial render or error)
    const t = dict?.nav || {
        features: "Features",
        howItWorks: "How It Works",
        pricing: "Pricing",
        faq: "FAQ"
    };
    const common = dict?.common || {
        dashboard: "Dashboard",
        login: "Sign In",
        signup: "Get Started Free",
        logout: "Sign Out"
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };
    return (
        <header style={styles.header}>
            <div style={styles.inner}>
                <Link href={`/${currentLocale}`} style={styles.logoLink}>
                    <Logo />
                </Link>

                <nav style={styles.nav}>
                    <Link href={`/${currentLocale}/#features`} style={styles.navLink}>{t.features}</Link>
                    <Link href={`/${currentLocale}/#how-it-works`} style={styles.navLink}>{t.howItWorks}</Link>
                    <Link href={`/${currentLocale}/pricing`} style={styles.navLink}>{t.pricing}</Link>
                    <Link href={`/${currentLocale}/#faq`} style={styles.navLink}>{t.faq}</Link>
                </nav>

                <div style={styles.actions}>
                    <select
                        value={currentLocale}
                        onChange={(e) => {
                            const newLocale = e.target.value;
                            const segments = pathname.split('/');
                            // segments[0] is always empty for absolute paths
                            if (locales.includes(segments[1])) {
                                segments[1] = newLocale;
                            } else {
                                // If no locale prefix found, insert it
                                segments.splice(1, 0, newLocale);
                            }
                            const newPathname = segments.join('/');
                            router.push(newPathname);
                        }}
                        style={styles.langSelect}
                    >
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="de">DE</option>
                        <option value="es">ES</option>
                        <option value="it">IT</option>
                        <option value="pt">PT</option>
                    </select>

                    {session ? (
                        <>
                            <Link href={`/${currentLocale}/dashboard`} className="btn btn-secondary btn-sm">{common.dashboard}</Link>
                            <button onClick={handleSignOut} className="btn btn-primary btn-sm">{common.logout}</button>
                        </>
                    ) : (
                        <>
                            <Link href={`/${currentLocale}/auth/signin`} className="btn btn-secondary btn-sm">{common.login}</Link>
                            <Link href={`/${currentLocale}/auth/signup`} className="btn btn-primary btn-sm">{common.signup}</Link>
                        </>
                    )}
                </div>

                <button
                    style={styles.menuBtn}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span style={{
                        ...styles.menuLine,
                        transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                    }} />
                    <span style={{
                        ...styles.menuLine,
                        opacity: mobileMenuOpen ? 0 : 1,
                    }} />
                    <span style={{
                        ...styles.menuLine,
                        transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                    }} />
                </button>
            </div>

            {mobileMenuOpen && (
                <div style={styles.mobileMenu}>
                    <Link href={`/${currentLocale}/#features`} style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>{t.features}</Link>
                    <Link href={`/${currentLocale}/#how-it-works`} style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>{t.howItWorks}</Link>
                    <Link href={`/${currentLocale}/pricing`} style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>{t.pricing}</Link>
                    <Link href={`/${currentLocale}/#faq`} style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>{t.faq}</Link>
                    <div style={styles.mobileActions}>
                        {session ? (
                            <>
                                <Link href={`/${currentLocale}/dashboard`} className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>{common.dashboard}</Link>
                                <button onClick={handleSignOut} className="btn btn-primary" style={{ width: '100%' }}>{common.logout}</button>
                            </>
                        ) : (
                            <>
                                <Link href={`/${currentLocale}/auth/signin`} className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>{common.login}</Link>
                                <Link href={`/${currentLocale}/auth/signup`} className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>{common.signup}</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

const styles = {
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        height: '72px',
    },
    inner: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
    },
    logoLink: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
    },
    logoAccent: {
        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
    },
    navLink: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#a0a0b8',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    menuBtn: {
        display: 'none',
        flexDirection: 'column',
        gap: '5px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
    },
    menuLine: {
        display: 'block',
        width: '22px',
        height: '2px',
        background: '#f0f0f5',
        borderRadius: '2px',
        transition: 'all 0.3s ease',
    },
    mobileMenu: {
        position: 'absolute',
        top: '72px',
        left: 0,
        right: 0,
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    },
    mobileLink: {
        fontSize: '16px',
        fontWeight: 500,
        color: '#a0a0b8',
        padding: '8px 0',
    },
    mobileActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '8px',
    },
    langSelect: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '6px',
        color: '#a0a0b8',
        fontSize: '12px',
        fontWeight: 600,
        padding: '4px 8px',
        cursor: 'pointer',
        outline: 'none',
        marginRight: '8px',
    },
};

// CSS media query override for mobile
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    @media (max-width: 768px) {
      header nav { display: none !important; }
      header > div > div:last-of-type { display: none !important; }
      header button[aria-label="Toggle menu"] { display: flex !important; }
    }
    header a[style]:hover { color: #f0f0f5 !important; }
  `;
    document.head.appendChild(style);
}
