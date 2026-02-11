/**
 * AI Provider abstraction for DocForge AI
 * Supports Groq, DeepSeek, and OpenRouter
 */

import { supabaseAdmin } from './supabase-admin';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'; // Corrected Endpoint
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_AUTH_URL = 'https://openrouter.ai/api/v1/auth/key';

/**
 * Fetch AI configuration from Settings
 */
export async function getAIConfig() {
    try {
        const { data } = await supabaseAdmin
            .from('settings')
            .select('*')
            .in('key', ['aiProvider', 'aiModel']);

        const config = {};
        data?.forEach(item => {
            config[item.key] = item.value;
        });

        // Defaults
        return {
            provider: config.aiProvider || 'groq',
            model: config.aiModel || 'llama-3.3-70b-versatile'
        };
    } catch (e) {
        console.warn('Failed to fetch AI config, using defaults:', e);
        return { provider: 'groq', model: 'llama-3.3-70b-versatile' };
    }
}

/**
 * Get Balance for the current provider (if supported)
 */
export async function getProviderBalance() {
    const config = await getAIConfig();

    if (config.provider === 'openrouter' && process.env.OPENROUTER_API_KEY) {
        try {
            const res = await fetch(OPENROUTER_AUTH_URL, {
                headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
            });
            const data = await res.json();
            // OpenRouter returns usage/limit, not always exact $ balance, but 'data.data.limit' or similar. 
            // Actually OpenRouter API for credits is separate, but auth/key gives info. 
            // Let's assume for now we return a link or basic info if available.
            return data?.data ? `Credits: $${(data.data.limit || 0).toFixed(2)}` : 'Unknown';
        } catch (e) {
            return 'Error fetching balance';
        }
    }

    // For Groq and DeepSeek, there is no standardized public API for balance checking 
    // without scraping or internal dashboards.
    return 'Check Provider Dashboard';
}

/**
 * Generate text using AI
 */
export async function generateWithAI(systemPrompt, userPrompt) {
    const config = await getAIConfig();
    console.log(`🤖 Generating with ${config.provider} (${config.model})`);

    try {
        switch (config.provider) {
            case 'deepseek':
                return await callDeepSeek(systemPrompt, userPrompt, config.model);
            case 'openrouter':
                return await callOpenRouter(systemPrompt, userPrompt, config.model);
            case 'groq':
            default:
                return await callGroq(systemPrompt, userPrompt, config.model);
        }
    } catch (err) {
        console.error(`${config.provider} failed:`, err.message);
        throw err;
    }
}

async function callGroq(systemPrompt, userPrompt, model) {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

    // Ensure model is valid for Groq
    const cleanModel = model && model.includes('/') ? 'llama-3.3-70b-versatile' : (model || 'llama-3.3-70b-versatile');

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: cleanModel,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 4096,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Groq API error: ${response.status} - ${err.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callDeepSeek(systemPrompt, userPrompt, model) {
    if (!process.env.DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY not configured');

    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 4096,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`DeepSeek API error: ${response.status} - ${err.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callOpenRouter(systemPrompt, userPrompt, model) {
    if (!process.env.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not configured');

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://docforge.site',
            'X-Title': 'DocForge AI',
        },
        body: JSON.stringify({
            model: model || 'meta-llama/llama-3.1-70b-instruct',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 4096,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter error: ${response.status} - ${err.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
