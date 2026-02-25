export const locales = ['en', 'fr', 'de', 'es', 'it', 'pt'];
export const defaultLocale = 'en';

// Admin emails: read from env var (comma-separated) with hardcoded fallback
const envAdmins = process.env.ADMIN_EMAILS;
export const ADMIN_EMAILS = envAdmins
    ? envAdmins.split(',').map(e => e.trim()).filter(Boolean)
    : ['artpavelalex@gmail.com', 'antigravity1980@gmail.com'];
