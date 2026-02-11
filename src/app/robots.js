export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.docforge.site';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/_next/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
