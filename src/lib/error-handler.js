import { NextResponse } from 'next/server';

/**
 * Standardized API Error Handler
 * @param {Error} error - The error object
 * @param {string} context - Context string for logging (e.g., "Generate API")
 * @returns {NextResponse}
 */
export function handleApiError(error, context = 'API Error') {
    // 1. Log the full error on the server
    console.error(`❌ [${context}]:`, error);

    // 2. Determine status code
    const status = error.status || 500;

    // 3. Determine safe message for client
    // In production, mask generic 500 errors. In dev, show message.
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction && status === 500
        ? 'An unexpected error occurred. Please try again later.'
        : error.message || 'Unknown error';

    return NextResponse.json(
        { error: message },
        { status }
    );
}
