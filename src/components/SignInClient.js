'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Logo from './Logo';

export default function SignInClient({ locale, dict }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const t = dict.auth;

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push(`/${locale}/dashboard`);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <section style={s.page}>
            <div style={s.card}>
                <div style={s.header}>
                    <Link href={`/${locale}`} style={s.logo}>
                        <Logo />
                    </Link>
                    <h1 style={s.title}>{t.signInTitle}</h1>
                    <p style={s.subtitle}>{t.signInSub}</p>
                </div>

                <button style={s.googleBtn} onClick={handleGoogleSignIn} disabled={loading}>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    {t.google}
                </button>

                <div style={s.divider}>
                    <span style={s.dividerLine} />
                    <span style={s.dividerText}>{t.or}</span>
                    <span style={s.dividerLine} />
                </div>

                <form onSubmit={handleEmailSignIn} style={s.form}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">{t.email}</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">{t.password}</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>
                            ❌ {error}
                        </div>
                    )}

                    <div style={s.forgotRow}>
                        <Link href={`/${locale}/auth/forgot-password`} style={s.forgotLink}>{t.forgot}</Link>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? t.signingIn : t.signInBtn}
                    </button>
                </form>

                <p style={s.footerText}>
                    {t.noAccount} <Link href={`/${locale}/auth/signup`} style={s.link}>{t.signUpFree}</Link>
                </p>
            </div>
        </section>
    );
}

const s = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: 'radial-gradient(ellipse at top, #1a1a3e 0%, #0a0a0f 70%)',
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logo: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
        marginBottom: '24px',
    },
    logoText: {
        fontSize: '22px',
        fontWeight: 800,
        color: '#f0f0f5',
    },
    title: {
        fontSize: '24px',
        fontWeight: 700,
        marginBottom: '4px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#6b6b80',
    },
    googleBtn: {
        width: '100%',
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: '#f0f0f5',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'all 0.2s ease',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        margin: '24px 0',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
    },
    dividerText: {
        fontSize: '13px',
        color: '#6b6b80',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
    },
    forgotRow: {
        textAlign: 'right',
        marginTop: '-8px',
    },
    forgotLink: {
        fontSize: '13px',
        color: '#818cf8',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#6b6b80',
    },
    link: {
        color: '#818cf8',
        fontWeight: 500,
    },
};
