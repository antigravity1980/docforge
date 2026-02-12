import { getDictionary } from '@/lib/get-dictionary';
import GenerateDocumentClient from '@/components/GenerateDocumentClient';

export async function generateMetadata({ params }) {
    const { locale, type } = await params;
    const dict = await getDictionary(locale);
    const doc = dict.generate?.docs?.[type];

    if (!doc) {
        return {
            title: 'Document Generator — DocForge AI',
            description: 'Generate professional documents with AI.',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://docforge.site';

    // Helper to format URL (hide 'en' prefix if that's the logic, 
    // but explicitly defining languages in alternates is usually fine with /en too 
    // if the server handles it via rewrite. However, to be cleaner let's follow the public pattern)
    // Actually for 'alternates', Google expects the exact URL. 
    // If /en redirects to /, we should use / for en.

    const getUrl = (l, t) => {
        if (l === 'en') return `${baseUrl}/generate/${t}`;
        return `${baseUrl}/${l}/generate/${t}`;
    }

    return {
        title: `${doc.name} Generator — Free AI Template`,
        description: `Create a professional ${doc.name} in seconds with AI. ${doc.desc} Simple, fast, and legally compliant templates.`,
        alternates: {
            canonical: getUrl(locale, type),
            languages: {
                'en': getUrl('en', type),
                'es': getUrl('es', type),
                'fr': getUrl('fr', type),
                'de': getUrl('de', type),
                'it': getUrl('it', type),
                'pt': getUrl('pt', type),
            },
        },
        openGraph: {
            title: `${doc.name} Generator | DocForge AI`,
            description: doc.desc,
            type: 'website',
        },
    };
}

export default async function GenerateDocumentPage({ params }) {
    const { locale, type } = await params;
    const dict = await getDictionary(locale);

    // Extract only necessary data to reduce payload
    const docConfig = dict.generate?.docs?.[type] || {};
    // Add slug to config as it's needed for API
    const config = { ...docConfig, slug: type };

    const ui = dict.generate?.ui || {};

    return <GenerateDocumentClient locale={locale} config={config} ui={ui} />;
}
