/**
 * AI Provider abstraction for DocForge AI
 * Supports Groq (free tier) and DeepSeek (cheap fallback)
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Generate text using AI (Groq first, DeepSeek fallback)
 */
export async function generateWithAI(systemPrompt, userPrompt) {
    // Try Groq first (free tier)
    if (process.env.GROQ_API_KEY) {
        try {
            const result = await callGroq(systemPrompt, userPrompt);
            return result;
        } catch (err) {
            console.error('Groq API error, trying DeepSeek fallback:', err.message);
        }
    }

    // Fallback 1: DeepSeek
    if (process.env.DEEPSEEK_API_KEY) {
        try {
            const result = await callDeepSeek(systemPrompt, userPrompt);
            return result;
        } catch (err) {
            console.error('DeepSeek API error, trying OpenRouter fallback:', err.message);
        }
    }

    // Fallback 2: OpenRouter (The "Nuclear" backup - accesses all models)
    if (process.env.OPENROUTER_API_KEY) {
        try {
            const result = await callOpenRouter(systemPrompt, userPrompt);
            return result;
        } catch (err) {
            console.error('OpenRouter API error:', err.message);
            throw new Error('All AI providers are currently unavailable. Please try again in a few minutes.');
        }
    }

    throw new Error('No AI API key configured or all providers reached limits. Please check your environment variables.');
}

async function callGroq(systemPrompt, userPrompt) {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
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

async function callDeepSeek(systemPrompt, userPrompt) {
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

async function callOpenRouter(systemPrompt, userPrompt) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://docforge.site',
            'X-Title': 'DocForge AI',
        },
        body: JSON.stringify({
            model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-70b-instruct',
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
