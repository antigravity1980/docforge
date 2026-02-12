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
    // Load English fallback if current locale is not English
    const limitDict = locale === 'en' ? dict : await getDictionary('en');

    // Helper to safely get doc name
    const getName = (slug) => {
        // Try current locale
        let val = dict.generate?.docs?.[slug];
        if (val?.name) return val.name;

        // Try fallback (English)
        val = limitDict.generate?.docs?.[slug];
        if (val?.name) return val.name;

        // Fallback to slug title case
        return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    // Reusing the same category structure (in a real app, extract this to a shared config)
    const CATEGORIES = [
        {
            title: dict.generate?.categories?.legal || "Legal",
            icon: '⚖️',
            items: [
                { name: getName('employment-agreement'), slug: 'employment-agreement' },
                { name: getName('nda'), slug: 'nda' },
                { name: getName('contractor-agreement'), slug: 'contractor-agreement' },
                { name: getName('non-compete'), slug: 'non-compete' },
                { name: getName('partnership-agreement'), slug: 'partnership-agreement' },
                { name: getName('msa'), slug: 'msa' },
                { name: getName('power-of-attorney'), slug: 'power-of-attorney' },
                { name: getName('living-will'), slug: 'living-will' },
                { name: getName('affidavit'), slug: 'affidavit' },
                { name: getName('cease-and-desist'), slug: 'cease-and-desist' },
                { name: getName('demand-letter'), slug: 'demand-letter' },
                { name: getName('child-travel-consent'), slug: 'child-travel-consent' },
            ]
        },
        {
            title: "Real Estate",
            icon: '🏠',
            items: [
                { name: getName('residential-lease'), slug: 'residential-lease' },
                { name: getName('commercial-lease'), slug: 'commercial-lease' },
                { name: getName('eviction-notice'), slug: 'eviction-notice' },
                { name: getName('roommate-agreement'), slug: 'roommate-agreement' },
                { name: getName('sublease-agreement'), slug: 'sublease-agreement' },
                { name: getName('intent-to-vacate'), slug: 'intent-to-vacate' },
                { name: getName('rent-increase-notice'), slug: 'rent-increase-notice' },
            ]
        },
        {
            title: "HR & Employment",
            icon: '👥',
            items: [
                { name: getName('offer-letter'), slug: 'offer-letter' },
                { name: getName('termination-letter'), slug: 'termination-letter' },
                { name: getName('recommendation-letter'), slug: 'recommendation-letter' },
                { name: getName('resignation-letter'), slug: 'resignation-letter' },
                { name: getName('employee-handbook'), slug: 'employee-handbook' },
                { name: getName('remote-work-policy'), slug: 'remote-work-policy' },
                { name: getName('social-media-policy'), slug: 'social-media-policy' },
            ]
        },
        {
            title: dict.generate?.categories?.business || "Business",
            icon: '💼',
            items: [
                { name: getName('invoice'), slug: 'invoice' },
                { name: getName('business-plan'), slug: 'business-plan' },
                { name: getName('service-agreement'), slug: 'service-agreement' },
                { name: getName('sales-agreement'), slug: 'sales-agreement' },
                { name: getName('meeting-minutes'), slug: 'meeting-minutes' },
                { name: getName('board-resolution'), slug: 'board-resolution' },
                { name: getName('marketing-plan'), slug: 'marketing-plan' },
                { name: getName('swot-analysis'), slug: 'swot-analysis' },
                { name: getName('memo'), slug: 'memo' },
                { name: getName('letter-of-intent'), slug: 'letter-of-intent' },
                { name: getName('partnership-dissolution'), slug: 'partnership-dissolution' },
            ]
        },
        {
            title: "Sales & Finance",
            icon: '💰',
            items: [
                { name: getName('promissory-note'), slug: 'promissory-note' },
                { name: getName('loan-agreement'), slug: 'loan-agreement' },
                { name: getName('purchase-order'), slug: 'purchase-order' },
                { name: getName('receipt'), slug: 'receipt' },
                { name: getName('bill-of-sale-car'), slug: 'bill-of-sale-car' },
                { name: getName('bill-of-sale-general'), slug: 'bill-of-sale-general' },
                { name: getName('debt-settlement'), slug: 'debt-settlement' },
            ]
        },
        {
            title: "Standard & Web",
            icon: '🌐',
            items: [
                { name: getName('privacy-policy'), slug: 'privacy-policy' },
                { name: getName('tos'), slug: 'tos' },
                { name: "Meta Tags Generator", slug: 'meta-tags-generator' },
                { name: "SEO Blog Outline", slug: 'seo-blog-outline-generator' },
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
