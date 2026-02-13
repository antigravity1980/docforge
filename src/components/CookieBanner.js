'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner({ dict, locale }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShow(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShow(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'false');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg animate-fade-in-up">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 flex-1">
                    <p>
                        {dict.cookieBanner.text}{' '}
                        <Link href={`/${locale}/privacy`} className="text-primary hover:underline">
                            {dict.cookieBanner.link}
                        </Link>
                        .
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Optional Decline Button */}
                    {/* 
            <button 
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
                {dict.common.decline || 'Decline'}
            </button> 
            */}
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        {dict.cookieBanner.accept}
                    </button>
                </div>
            </div>
        </div>
    );
}
