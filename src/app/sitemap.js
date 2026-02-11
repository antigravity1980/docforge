import { TOOLS } from '@/lib/tools-data';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.docforge.site';
    const locales = ['en', 'fr', 'de', 'es', 'it', 'pt'];

    // Base routes to include in sitemap
    const routes = [
        '',
        '/pricing',
        '/auth/signin',
        '/auth/signup',
        '/blog',
        '/terms' // Added Terms page
    ];

    let sitemapEntries = [];

    // 1. Generate static routes for all locales
    routes.forEach(route => {
        locales.forEach(locale => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date().toISOString(),
                changeFrequency: route === '' ? 'daily' : 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    // 2. Generate Tool pages for all locales
    Object.keys(TOOLS).forEach(slug => {
        locales.forEach(locale => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/tools/${slug}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        });
    });

    // 3. Generate Blog pages for all locales
    BLOG_POSTS.forEach(post => {
        locales.forEach(locale => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    });

    return sitemapEntries;
}
