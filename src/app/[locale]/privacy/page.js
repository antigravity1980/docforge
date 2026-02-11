'use client';

import { use, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getDictionary } from '@/lib/get-dictionary';
import Link from 'next/link';

export default function PrivacyPage({ params }) {
    const { locale } = use(params);
    const [dict, setDict] = useState(null);

    useEffect(() => {
        getDictionary(locale).then(setDict);
    }, [locale]);

    if (!dict) return <div style={styles.loading}>Loading...</div>;

    const t = dict.privacy;

    return (
        <div style={styles.page}>
            <div className="container">
                <Link href={`/${locale}`} style={styles.backLink}>← {dict.common?.home || "Home"}</Link>

                <article style={styles.article}>
                    <h1 style={styles.title}>{t?.title || "Privacy Policy"}</h1>
                    <div className="markdown-content" style={styles.content}>
                        <ReactMarkdown>{t?.content || "Coming soon..."}</ReactMarkdown>
                    </div>
                </article>
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: '80px 0',
        minHeight: '80vh',
        background: 'var(--bg-primary)',
    },
    loading: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b6b80',
    },
    backLink: {
        display: 'inline-block',
        marginBottom: '32px',
        color: '#818cf8',
        fontSize: '15px',
        textDecoration: 'none',
    },
    article: {
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '32px',
        padding: '64px',
    },
    title: {
        fontSize: '40px',
        fontWeight: 800,
        color: '#fff',
        marginBottom: '32px',
        textAlign: 'center',
    },
    content: {
        color: '#a0a0b8',
        fontSize: '17px',
        lineHeight: '1.8',
    }
};
