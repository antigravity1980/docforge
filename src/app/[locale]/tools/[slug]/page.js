import { getDictionary } from '@/lib/get-dictionary';
import { TOOLS as STATIC_TOOLS } from '@/lib/tools-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { slug, locale } = await params;
    const dict = await getDictionary(locale);
    const tool = STATIC_TOOLS[slug];

    if (!tool) return {};

    const localized = dict.tools_data?.[slug];
    const finalTool = localized ? { ...tool, ...localized } : tool;

    return {
        title: `${finalTool.title} | DocForge AI`,
        description: finalTool.description,
    };
}

export default async function ToolPage({ params }) {
    const { slug, locale } = await params;
    const tool = STATIC_TOOLS[slug];

    if (!tool) {
        notFound();
    }

    const dict = await getDictionary(locale);
    const t = dict.tool_page || {
        badge: "AI-Powered Generator",
        start: "Start Generating",
        pricing: "View Pricing",
        faq: "Frequently Asked Questions",
        ctaTitle: "Ready to generate your",
        ctaSub: "Join thousands of professionals who trust DocForge AI."
    };

    const localizedData = dict.tools_data?.[slug];
    const finalTool = localizedData ? { ...tool, ...localizedData } : tool;

    return (
        <div style={styles.page}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <header style={styles.header}>
                    <div style={styles.badge}>{t.badge}</div>
                    <h1 style={styles.title}>{finalTool.title}</h1>
                    <p style={styles.description}>{finalTool.description}</p>
                    <div style={styles.ctaGroup}>
                        <Link href={`/${locale}/generate/${slug}`} className="btn btn-primary btn-lg">
                            {t.start}
                        </Link>
                        <Link href={`/${locale}/pricing`} className="btn btn-secondary btn-lg">
                            {t.pricing}
                        </Link>
                    </div>
                </header>

                <div style={styles.grid}>
                    <div style={styles.main}>
                        <div style={styles.features}>
                            {finalTool.features.map((feature, i) => (
                                <div key={i} style={styles.feature}>
                                    <span style={{ color: '#818cf8', fontWeight: 700 }}>✓</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <section style={styles.faqSection}>
                    <h2 style={styles.faqTitle}>{t.faq}</h2>
                    <div style={styles.faqGrid}>
                        {finalTool.faq?.map((item, i) => (
                            <div key={i} style={styles.faqItem}>
                                <h3 style={styles.question}>{item.q}</h3>
                                <p style={styles.answer}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={styles.bottomCta}>
                    <h2 style={styles.bottomTitle}>{t.ctaTitle} <span className="gradient-text">{finalTool.title}</span>?</h2>
                    <p style={styles.bottomSub}>{t.ctaSub}</p>
                    <Link href={`/${locale}/generate/${slug}`} className="btn btn-primary btn-lg" style={{ marginTop: '32px' }}>
                        {t.start}
                    </Link>
                </section>
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: '80px 0',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '80px',
    },
    badge: {
        display: 'inline-block',
        padding: '6px 16px',
        borderRadius: '20px',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        color: '#818cf8',
        fontSize: '14px',
        fontWeight: 600,
        marginBottom: '24px',
    },
    title: {
        fontSize: '56px',
        fontWeight: 800,
        marginBottom: '24px',
        letterSpacing: '-1px',
    },
    description: {
        fontSize: '20px',
        color: '#a0a0b8',
        maxWidth: '700px',
        margin: '0 auto 40px',
        lineHeight: 1.6,
    },
    ctaGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
    },
    grid: {
        marginBottom: '80px',
    },
    main: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '32px',
        padding: '48px',
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
    },
    feature: {
        display: 'flex',
        gap: '12px',
        fontSize: '16px',
        color: '#d0d0e0',
    },
    faqSection: {
        marginBottom: '80px',
        padding: '80px 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    faqTitle: {
        fontSize: '32px',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '48px',
    },
    faqGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px',
    },
    faqItem: {
        background: 'rgba(255,255,255,0.02)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.04)',
    },
    question: {
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '12px',
        color: '#fff',
    },
    answer: {
        fontSize: '15px',
        lineHeight: 1.6,
        color: '#a0a0b8',
    },
    bottomCta: {
        textAlign: 'center',
        padding: '80px 48px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
        borderRadius: '40px',
        border: '1px solid rgba(99, 102, 241, 0.2)',
    },
    bottomTitle: {
        fontSize: '36px',
        fontWeight: 800,
        marginBottom: '16px',
    },
    bottomSub: {
        fontSize: '18px',
        color: '#a0a0b8',
    },
};
