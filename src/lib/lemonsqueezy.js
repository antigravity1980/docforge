import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

export const setupLemonSqueezy = () => {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    if (!apiKey) {
        throw new Error('LEMON_SQUEEZY_API_KEY is missing');
    }
    lemonSqueezySetup({ apiKey });
};
