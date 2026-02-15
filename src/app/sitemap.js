import { getDictionary } from '@/lib/get-dictionary';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://docforge.site';
    const locales = ['en', 'fr', 'de', 'es', 'it', 'pt'];

    // Static routes
    const routes = [
        '',
        '/pricing',
        '/generate',
        '/privacy',
        '/terms',
        '/blog'
    ];

    const sitemapEntries = [];

    // 1. Static pages for each locale
    for (const locale of locales) {
        for (const route of routes) {
            // Logic to hide /en prefix
            let url;
            if (locale === 'en') {
                url = `${baseUrl}${route}`;
            } else {
                url = `${baseUrl}/${locale}${route}`;
            }

            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8,
            });
        }
    }

    // 2. Dynamic template pages
    // We only need to load one dictionary (e.g., 'en') to get the keys
    const dict = await getDictionary('en');
    const docs = dict.generate?.docs ? Object.keys(dict.generate.docs) : [];

    for (const slug of docs) {
        for (const locale of locales) {
            let url;
            if (locale === 'en') {
                url = `${baseUrl}/generate/${slug}`;
            } else {
                url = `${baseUrl}/${locale}/generate/${slug}`;
            }

            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.9,
            });
        }
    }

    return sitemapEntries;
}
