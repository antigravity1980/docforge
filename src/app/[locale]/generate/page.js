import { getDictionary } from '@/lib/get-dictionary';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);
    return {
        title: `${dict.common.generate} — DocForge AI`,
        description: dict.hero.subtitle,
    };
}

export default async function GeneratePage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);
    const g = dict.generate;
    const t = g.docs;

    const CATEGORIES = [
        {
            title: g.categories.legal,
            icon: '⚖️',
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            docs: [
                { name: t['employment-agreement'].name, desc: t['employment-agreement'].desc, slug: 'employment-agreement', popular: true },
                { name: t.nda.name, desc: t.nda.desc, slug: 'nda', popular: true },
                { name: t['contractor-agreement'].name, desc: t['contractor-agreement'].desc, slug: 'contractor-agreement' },
                { name: t['non-compete'].name, desc: t['non-compete'].desc, slug: 'non-compete' },
                { name: t['partnership-agreement'].name, desc: t['partnership-agreement'].desc, slug: 'partnership-agreement' },
                { name: t['msa'].name, desc: t['msa'].desc, slug: 'msa' },
                { name: t['power-of-attorney'].name, desc: t['power-of-attorney'].desc, slug: 'power-of-attorney' },
                { name: t['living-will'].name, desc: t['living-will'].desc, slug: 'living-will' },
                { name: t.affidavit.name, desc: t.affidavit.desc, slug: 'affidavit' },
                { name: t['cease-and-desist'].name, desc: t['cease-and-desist'].desc, slug: 'cease-and-desist' },
                { name: t['demand-letter'].name, desc: t['demand-letter'].desc, slug: 'demand-letter' },
                { name: t['child-travel-consent'].name, desc: t['child-travel-consent'].desc, slug: 'child-travel-consent' },
            ],
        },
        {
            title: "Real Estate",
            icon: '🏠',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            docs: [
                { name: t['residential-lease'].name, desc: t['residential-lease'].desc, slug: 'residential-lease', popular: true },
                { name: t['commercial-lease'].name, desc: t['commercial-lease'].desc, slug: 'commercial-lease' },
                { name: t['eviction-notice'].name, desc: t['eviction-notice'].desc, slug: 'eviction-notice' },
                { name: t['roommate-agreement'].name, desc: t['roommate-agreement'].desc, slug: 'roommate-agreement' },
                { name: t['sublease-agreement'].name, desc: t['sublease-agreement'].desc, slug: 'sublease-agreement' },
                { name: t['intent-to-vacate'].name, desc: t['intent-to-vacate'].desc, slug: 'intent-to-vacate' },
                { name: t['rent-increase-notice'].name, desc: t['rent-increase-notice'].desc, slug: 'rent-increase-notice' },
            ],
        },
        {
            title: "HR & Employment",
            icon: '👥',
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
            docs: [
                { name: t['offer-letter'].name, desc: t['offer-letter'].desc, slug: 'offer-letter', popular: true },
                { name: t['termination-letter'].name, desc: t['termination-letter'].desc, slug: 'termination-letter' },
                { name: t['recommendation-letter'].name, desc: t['recommendation-letter'].desc, slug: 'recommendation-letter' },
                { name: t['resignation-letter'].name, desc: t['resignation-letter'].desc, slug: 'resignation-letter' },
                { name: t['employee-handbook'].name, desc: t['employee-handbook'].desc, slug: 'employee-handbook' },
                { name: t['remote-work-policy'].name, desc: t['remote-work-policy'].desc, slug: 'remote-work-policy' },
                { name: t['social-media-policy'].name, desc: t['social-media-policy'].desc, slug: 'social-media-policy' },
            ],
        },
        {
            title: g.categories.business,
            icon: '💼',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            docs: [
                { name: t.invoice.name, desc: t.invoice.desc, slug: 'invoice', popular: true },
                { name: t['business-plan'].name, desc: t['business-plan'].desc, slug: 'business-plan', popular: true },
                { name: t['service-agreement'].name, desc: t['service-agreement'].desc, slug: 'service-agreement' },
                { name: t['sales-agreement'].name, desc: t['sales-agreement'].desc, slug: 'sales-agreement' },
                { name: t['meeting-minutes'].name, desc: t['meeting-minutes'].desc, slug: 'meeting-minutes' },
                { name: t['board-resolution'].name, desc: t['board-resolution'].desc, slug: 'board-resolution' },
                { name: t['marketing-plan'].name, desc: t['marketing-plan'].desc, slug: 'marketing-plan' },
                { name: t['swot-analysis'].name, desc: t['swot-analysis'].desc, slug: 'swot-analysis' },
                { name: t.memo.name, desc: t.memo.desc, slug: 'memo' },
                { name: t['letter-of-intent'].name, desc: t['letter-of-intent'].desc, slug: 'letter-of-intent' },
                { name: t['partnership-dissolution'].name, desc: t['partnership-dissolution'].desc, slug: 'partnership-dissolution' },
            ],
        },
        {
            title: "Sales & Finance",
            icon: '💰',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981, #34d399)',
            docs: [
                { name: t['promissory-note'].name, desc: t['promissory-note'].desc, slug: 'promissory-note', popular: true },
                { name: t['loan-agreement'].name, desc: t['loan-agreement'].desc, slug: 'loan-agreement' },
                { name: t['purchase-order'].name, desc: t['purchase-order'].desc, slug: 'purchase-order' },
                { name: t.receipt.name, desc: t.receipt.desc, slug: 'receipt' },
                { name: t['bill-of-sale-car'].name, desc: t['bill-of-sale-car'].desc, slug: 'bill-of-sale-car' },
                { name: t['bill-of-sale-general'].name, desc: t['bill-of-sale-general'].desc, slug: 'bill-of-sale-general' },
                { name: t['debt-settlement'].name, desc: t['debt-settlement'].desc, slug: 'debt-settlement' },
            ],
        },
        {
            title: g.categories.seo, // Standard & Web
            icon: '🌐',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            docs: [
                { name: t['privacy-policy'].name, desc: t['privacy-policy'].desc, slug: 'privacy-policy', popular: true },
                { name: t.tos.name, desc: t.tos.desc, slug: 'tos', popular: true },
            ],
        },
    ];

    return (
        <section style={s.page}>
            <div className="container">
                <div style={s.header}>
                    <h1 style={s.title}>{g.title} <span className="gradient-text">{g.titleAccent}</span>?</h1>
                    <p style={s.subtitle}>{g.subtitle}</p>
                </div>

                {CATEGORIES.map((cat, ci) => (
                    <div key={ci} style={s.category}>
                        <div style={s.catHeader}>
                            <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                            <h2 style={s.catTitle}>{cat.title}</h2>
                            <span style={s.catCount}>{cat.docs.length} {g.templates}</span>
                        </div>
                        <div style={s.docsGrid}>
                            {cat.docs.map((doc, di) => (
                                <Link key={di} href={`/${locale}/generate/${doc.slug}`} style={s.docCard}>
                                    <div style={s.docCardTop}>
                                        <h3 style={s.docName}>{doc.name}</h3>
                                        {doc.popular && <span style={{ ...s.popularBadge, background: cat.gradient }}>{g.popular}</span>}
                                    </div>
                                    <p style={s.docDesc}>{doc.desc}</p>
                                    <span style={{ ...s.docArrow, color: cat.color }}>{g.button}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

const s = {
    page: {
        padding: '40px 0 80px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '48px',
    },
    title: {
        fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
        fontWeight: 800,
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#6b6b80',
    },
    category: {
        marginBottom: '48px',
    },
    catHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
    },
    catTitle: {
        fontSize: '22px',
        fontWeight: 700,
    },
    catCount: {
        fontSize: '13px',
        color: '#6b6b80',
        background: 'rgba(255,255,255,0.05)',
        padding: '2px 10px',
        borderRadius: '20px',
    },
    docsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
    },
    docCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    docCardTop: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
    },
    docName: {
        fontSize: '15px',
        fontWeight: 600,
        color: '#f0f0f5',
    },
    popularBadge: {
        fontSize: '10px',
        fontWeight: 700,
        color: 'white',
        padding: '2px 8px',
        borderRadius: '10px',
        flexShrink: 0,
    },
    docDesc: {
        fontSize: '13px',
        color: '#6b6b80',
        lineHeight: 1.5,
        flex: 1,
    },
    docArrow: {
        fontSize: '13px',
        fontWeight: 600,
        opacity: 0.7,
        transition: 'opacity 0.2s ease',
    },
};
