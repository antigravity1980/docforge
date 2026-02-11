import { TOOLS } from '@/lib/tools-data';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.docforge.site';

    // Static pages
    const routes = ['', '/pricing', '/auth/signin', '/auth/signup', '/blog'].map(
        (route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: route === '' ? 1 : 0.8,
        })
    );

    // Dynamic tool pages
    const toolRoutes = Object.keys(TOOLS).map((slug) => ({
        url: `${baseUrl}/tools/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.9,
    }));

    // Blog posts
    const blogRoutes = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...routes, ...toolRoutes, ...blogRoutes];
}
