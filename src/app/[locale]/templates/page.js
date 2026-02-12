import { getDictionary } from '@/lib/get-dictionary';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        title: 'Document Template Catalog — DocForge AI',
        description: 'Browse our extensive library of legal, business, and personal document templates. All powered by AI and free to start.',
    };
}

export default async function TemplatesPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);
    const g = dict.generate;
    const t = g.docs;

    // Reusing the same category structure (in a real app, extract this to a shared config)
    const CATEGORIES = [
        {
            title: g.categories.legal,
            icon: '⚖️',
            items: [
                { name: t['employment-agreement'].name, slug: 'employment-agreement' },
                { name: t.nda.name, slug: 'nda' },
                { name: t['contractor-agreement'].name, slug: 'contractor-agreement' },
                { name: t['non-compete'].name, slug: 'non-compete' },
                { name: t['partnership-agreement'].name, slug: 'partnership-agreement' },
                { name: t['msa'].name, slug: 'msa' },
                { name: t['power-of-attorney'].name, slug: 'power-of-attorney' },
                { name: t['living-will'].name, slug: 'living-will' },
                { name: t.affidavit.name, slug: 'affidavit' },
                { name: t['cease-and-desist'].name, slug: 'cease-and-desist' },
                { name: t['demand-letter'].name, slug: 'demand-letter' },
                { name: t['child-travel-consent'].name, slug: 'child-travel-consent' },
            ]
        },
        {
            title: "Real Estate",
            icon: '🏠',
            items: [
                { name: t['residential-lease'].name, slug: 'residential-lease' },
                { name: t['commercial-lease'].name, slug: 'commercial-lease' },
                { name: t['eviction-notice'].name, slug: 'eviction-notice' },
                { name: t['roommate-agreement'].name, slug: 'roommate-agreement' },
                { name: t['sublease-agreement'].name, slug: 'sublease-agreement' },
                { name: t['intent-to-vacate'].name, slug: 'intent-to-vacate' },
                { name: t['rent-increase-notice'].name, slug: 'rent-increase-notice' },
            ]
        },
        {
            title: "HR & Employment",
            icon: '👥',
            items: [
                { name: t['offer-letter'].name, slug: 'offer-letter' },
                { name: t['termination-letter'].name, slug: 'termination-letter' },
                { name: t['recommendation-letter'].name, slug: 'recommendation-letter' },
                { name: t['resignation-letter'].name, slug: 'resignation-letter' },
                { name: t['employee-handbook'].name, slug: 'employee-handbook' },
                { name: t['remote-work-policy'].name, slug: 'remote-work-policy' },
                { name: t['social-media-policy'].name, slug: 'social-media-policy' },
            ]
        },
        {
            title: g.categories.business,
            icon: '💼',
            items: [
                { name: t.invoice.name, slug: 'invoice' },
                { name: t['business-plan'].name, slug: 'business-plan' },
                { name: t['service-agreement'].name, slug: 'service-agreement' },
                { name: t['sales-agreement'].name, slug: 'sales-agreement' },
                { name: t['meeting-minutes'].name, slug: 'meeting-minutes' },
                { name: t['board-resolution'].name, slug: 'board-resolution' },
                { name: t['marketing-plan'].name, slug: 'marketing-plan' },
                { name: t['swot-analysis'].name, slug: 'swot-analysis' },
                { name: t.memo.name, slug: 'memo' },
                { name: t['letter-of-intent'].name, slug: 'letter-of-intent' },
                { name: t['partnership-dissolution'].name, slug: 'partnership-dissolution' },
            ]
        },
        {
            title: "Sales & Finance",
            icon: '💰',
            items: [
                { name: t['promissory-note'].name, slug: 'promissory-note' },
                { name: t['loan-agreement'].name, slug: 'loan-agreement' },
                { name: t['purchase-order'].name, slug: 'purchase-order' },
                { name: t.receipt.name, slug: 'receipt' },
                { name: t['bill-of-sale-car'].name, slug: 'bill-of-sale-car' },
                { name: t['bill-of-sale-general'].name, slug: 'bill-of-sale-general' },
                { name: t['debt-settlement'].name, slug: 'debt-settlement' },
            ]
        },
        {
            title: "Standard & Web",
            icon: '🌐',
            items: [
                { name: t['privacy-policy'].name, slug: 'privacy-policy' },
                { name: t.tos.name, slug: 'tos' },
                { name: dict.page.features.items.meta.name, slug: 'meta-tags-generator' },
                { name: dict.page.features.items.blog.name, slug: 'seo-blog-outline-generator' },
            ]
        }
    ];

    return (
        <section style={s.page}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={s.header}>
                    <h1 style={s.title}>Document Template Catalog</h1>
                    <p style={s.subtitle}>
                        Explore our complete library of professional templates.
                        Each document is generated by AI, tailored to your specific inputs,
                        and ready to download in seconds.
                    </p>
                </div>

                <div style={s.grid}>
                    {CATEGORIES.map((cat, i) => (
                        <div key={i} style={s.categoryCard}>
                            <div style={s.catHeader}>
                                <span style={s.icon}>{cat.icon}</span>
                                <h2 style={s.catTitle}>{cat.title}</h2>
                            </div>
                            <ul style={s.list}>
                                {cat.items.map((item, j) => (
                                    <li key={j} style={s.listItem}>
                                        <Link href={`/${locale}/generate/${item.slug}`} style={s.link}>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const s = {
    page: {
        padding: '60px 0 100px',
        minHeight: '100vh',
        background: '#0a0a0f',
    },
    header: {
        textAlign: 'center',
        marginBottom: '60px',
    },
    title: {
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 800,
        color: '#f0f0f5',
        marginBottom: '16px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#a0a0b8',
        lineHeight: 1.6,
        maxWidth: '600px',
        margin: '0 auto',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '32px',
    },
    categoryCard: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
    },
    catHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '16px',
    },
    icon: {
        fontSize: '24px',
    },
    catTitle: {
        fontSize: '20px',
        fontWeight: 700,
        color: '#f0f0f5',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    listItem: {
        display: 'block',
    },
    link: {
        color: '#a0a0b8',
        textDecoration: 'none',
        fontSize: '15px',
        transition: 'color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ':hover': {
            color: '#6366f1',
        }
    },
};
