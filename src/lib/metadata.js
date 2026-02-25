// src/lib/metadata.js
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://docforge.site';

export function getUrl(locale, routePath) {
    // Clean up routePath to ensure proper formatting
    let path = routePath || '';
    if (path === 'page.js') path = ''; // Extra clean up just in case

    if (path && !path.startsWith('/')) {
        path = '/' + path;
    }

    if (locale === 'en') {
        // We rewrite/redirect default locale out of the URL
        return `${baseUrl}${path}`;
    }

    // For other locales, the prefix is required
    return `${baseUrl}/${locale}${path}`;
}

export function generateAlternates(locale, routePath) {
    const languages = {
        'en': getUrl('en', routePath),
        'fr': getUrl('fr', routePath),
        'de': getUrl('de', routePath),
        'es': getUrl('es', routePath),
        'it': getUrl('it', routePath),
        'pt': getUrl('pt', routePath),
    };

    return {
        canonical: getUrl(locale, routePath),
        languages: languages,
    };
}
