import { locales } from './config';

export async function getDictionary(locale) {
    if (!locales.includes(locale)) {
        locale = 'en';
    }
    return import(`@/messages/${locale}.json`).then((module) => module.default);
}
