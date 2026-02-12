'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/lib/config';

import Logo from './Logo';

export default function Footer({ dict }) {
    const pathname = usePathname();
    // Determine current locale
    const segments = pathname ? pathname.split('/') : [''];
    const currentLocale = locales.includes(segments[1]) ? segments[1] : 'en';
    const linkPrefix = currentLocale === 'en' ? '' : `/${currentLocale}`;

    // Fallback
    const t = dict?.footer || {};
    const g = dict?.generate?.docs || {};

    return (
        <footer style={styles.footer}>
            <div style={styles.inner}>
                <div className="grid-4" style={styles.grid}>
                    {/* Brand */}
                    <div style={styles.brand}>
                        <div style={styles.logoWrapper}>
                            <Logo />
                        </div>
                        <p style={styles.description}>
                            {t.description || "Generate professional documents in seconds with AI."}
                        </p>
                        <div style={styles.social}>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} aria-label="Twitter">𝕏</a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink} aria-label="LinkedIn">in</a>
                        </div>
                    </div>

                    {/* Legal Documents */}
                    <div style={styles.column}>
                        <h4 style={styles.columnTitle}>{t.legal || "Legal"}</h4>
                        <Link href={`${linkPrefix}/tools/nda-generator`} style={styles.link}>{g.nda?.name || "NDA Generator"}</Link>
                        <Link href={`${linkPrefix}/tools/privacy-policy-generator`} style={styles.link}>{g.privacy?.name || "Privacy Policy"}</Link>
                        <Link href={`${linkPrefix}/tools/terms-of-service-generator`} style={styles.link}>{g.tos?.name || "Terms of Service"}</Link>
                        <Link href={`${linkPrefix}/tools/freelance-contract-generator`} style={styles.link}>{g.freelance?.name || "Freelance Contract"}</Link>
                    </div>

                    {/* Business */}
                    <div style={styles.column}>
                        <h4 style={styles.columnTitle}>{t.business || "Business"}</h4>
                        <Link href={`${linkPrefix}/tools/invoice-generator`} style={styles.link}>{g.invoice?.name || "Invoice Generator"}</Link>
                        <Link href={`${linkPrefix}/tools/meta-tags-generator`} style={styles.link}>{g.meta?.name || "Meta Tags"}</Link>
                        <Link href={`${linkPrefix}/tools/business-proposal-generator`} style={styles.link}>{g.proposal?.name || "Business Proposal"}</Link>
                    </div>

                    {/* Company */}
                    <div style={styles.column}>
                        <h4 style={styles.columnTitle}>{t.company || "Company"}</h4>
                        <Link href={`${linkPrefix}/blog`} style={styles.link}>{dict?.nav?.blog || "Blog"}</Link>
                        <Link href={`${linkPrefix}/pricing`} style={styles.link}>{dict?.nav?.pricing || "Pricing"}</Link>
                        <Link href={`${linkPrefix}/generate`} style={styles.link}>{dict?.generate?.title ? dict.generate.title.split(' ')[0] : "Templates"}</Link>
                        <Link href={`${linkPrefix}/#faq`} style={styles.link}>{dict?.nav?.faq || "FAQ"}</Link>
                        <Link href={`${linkPrefix}/privacy`} style={styles.link}>{t.privacy || "Privacy"}</Link>
                    </div>
                </div>

                <div style={styles.bottom}>
                    <p style={styles.copyright}>&copy; {new Date().getFullYear()} DocForge AI. {t.copyright || "All rights reserved."}</p>
                    <p style={styles.disclaimer}>
                        {t.disclaimer}
                    </p>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#0a0f1d',
        padding: '64px 0 32px',
    },
    inner: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
    },
    grid: {
        marginBottom: '48px',
    },
    brand: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    logoWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    logoAccent: {
        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#6b6b80',
        maxWidth: '280px',
    },
    social: {
        display: 'flex',
        gap: '12px',
    },
    socialLink: {
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#a0a0b8',
        fontSize: '14px',
        fontWeight: 700,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    columnTitle: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#f0f0f5',
        marginBottom: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    link: {
        fontSize: '14px',
        color: '#6b6b80',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
    },
    bottom: {
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
    },
    copyright: {
        fontSize: '13px',
        color: '#6b6b80',
    },
    disclaimer: {
        fontSize: '12px',
        color: '#4a4a5c',
        fontStyle: 'italic',
    },
};
