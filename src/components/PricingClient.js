'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';


export default function PricingClient({ dict, locale, prices = { starter: '29', pro: '79' } }) {
    const t = dict.pricing_page;
    const searchParams = useSearchParams();
    const [isYearly, setIsYearly] = useState(searchParams.get('bill') === 'year');
    const [loading, setLoading] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const common = dict.common;

    const PLANS = [
        {
            name: t.plans.free.name,
            id: 'Free',
            monthlyPrice: 0,
            yearlyPrice: 0,
            description: t.plans.free.desc,
            features: [
                { text: dict.page.pricing.features.docs3, included: true },
                { text: dict.page.pricing.features.allTypes, included: true },
                { text: dict.page.pricing.features.pdf, included: true },
                { text: dict.page.pricing.features.watermark, included: false },
                { text: dict.page.pricing.features.history, included: false },
                { text: dict.page.pricing.features.priority, included: false },
            ],
            cta: t.plans.free.cta,
            ctaStyle: 'btn btn-secondary',
            popular: false,
        },
        {
            name: t.plans.starter.name,
            id: 'Starter',
            monthlyPrice: parseFloat(prices.starter),
            yearlyPrice: parseFloat(prices.starterYearly),
            description: t.plans.starter.desc,
            lemonSqueezyMonthlyId: process.env.NEXT_PUBLIC_LS_STARTER_MONTH_ID || 'variant_1',
            lemonSqueezyYearlyId: process.env.NEXT_PUBLIC_LS_STARTER_YEAR_ID || 'variant_2',
            features: [
                { text: dict.page.pricing.features.docs30, included: true },
                { text: dict.page.pricing.features.allTypes, included: true },
                { text: dict.page.pricing.features.noWatermark, included: true },
                { text: dict.page.pricing.features.history, included: true },
                { text: dict.page.pricing.features.emailSupport, included: true },
                { text: dict.page.pricing.features.priority, included: false },
            ],
            cta: t.plans.starter.cta,
            ctaStyle: 'btn btn-primary',
            popular: true,
        },
        {
            name: t.plans.pro.name,
            id: 'Professional',
            monthlyPrice: parseFloat(prices.pro),
            yearlyPrice: parseFloat(prices.proYearly),
            description: t.plans.pro.desc,
            lemonSqueezyMonthlyId: process.env.NEXT_PUBLIC_LS_PRO_MONTH_ID || 'variant_3',
            lemonSqueezyYearlyId: process.env.NEXT_PUBLIC_LS_PRO_YEAR_ID || 'variant_4',
            features: [
                { text: dict.page.pricing.features.docsUnlimited, included: true },
                { text: dict.page.pricing.features.allTypes, included: true },
                { text: dict.page.pricing.features.noWatermark, included: true },
                { text: dict.page.pricing.features.history, included: true },
                { text: dict.page.pricing.features.priority, included: true },
                { text: dict.page.pricing.features.branding, included: true },
            ],
            cta: t.plans.pro.cta,
            ctaStyle: 'btn btn-secondary',
            popular: false,
        },
    ];

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkUser();
    }, []);

    const handleSelectPlan = async (plan) => {
        if (plan.id === 'Free') {
            router.push(user ? `/${locale}/dashboard` : `/${locale}/auth/signup`);
            return;
        }

        if (!user) {
            router.push(`/${locale}/auth/signup?redirect=/pricing`);
            return;
        }

        setLoading(plan.id);
        try {
            const response = await fetch('/api/lemonsqueezy/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    variantId: isYearly ? plan.lemonSqueezyYearlyId : plan.lemonSqueezyMonthlyId,
                    userId: user.id,
                    userEmail: user.email,
                    planName: plan.id
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.assign(data.url);
            } else {
                alert(data.error || t.error);
                setLoading(null);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Payment system error. Please try again later.');
            setLoading(null);
        }
    };

    return (
        <section style={s.page}>
            <div className="container">
                <div style={s.header}>
                    <h1 style={s.title}>{t.title} <span className="gradient-text">{t.titleAccent}</span></h1>
                    <p style={s.subtitle}>{t.subtitle}</p>

                    <div style={s.toggle}>
                        <span style={{ ...s.toggleLabel, color: !isYearly ? '#f0f0f5' : '#6b6b80' }}>{t.toggle.monthly}</span>
                        <button
                            style={s.toggleBtn}
                            onClick={() => setIsYearly(!isYearly)}
                            aria-label="Toggle yearly pricing"
                        >
                            <span style={{
                                ...s.toggleDot,
                                transform: isYearly ? 'translateX(24px)' : 'translateX(2px)',
                            }} />
                        </button>
                        <span style={{ ...s.toggleLabel, color: isYearly ? '#f0f0f5' : '#6b6b80' }}>
                            {t.toggle.yearly} <span style={s.saveBadge}>{t.toggle.save}</span>
                        </span>
                    </div>
                </div>

                <div style={s.grid}>
                    {PLANS.map((plan, i) => (
                        <div key={i} className="card" style={{
                            ...s.card,
                            ...(plan.popular ? s.popularCard : {}),
                        }}>
                            {plan.popular && <div style={s.popularBadge}>{dict.page.pricing.plans.popular}</div>}
                            <h3 style={s.planName}>{plan.name}</h3>
                            <p style={s.planDesc}>{plan.description}</p>
                            <div style={s.priceRow}>
                                <span style={s.currency}>$</span>
                                <span style={s.price}>
                                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                </span>
                                <span style={s.period}>{dict.page.pricing.periods.month}</span>
                            </div>
                            {isYearly && plan.monthlyPrice > 0 && (
                                <p style={s.yearlyNote}>
                                    {t.billed} ${(plan.yearlyPrice * 12).toFixed(2)}{t.year}
                                </p>
                            )}

                            <button
                                onClick={() => handleSelectPlan(plan)}
                                className={plan.ctaStyle}
                                style={{ width: '100%', marginTop: '16px' }}
                                disabled={loading === plan.id}
                            >
                                {loading === plan.id ? t.connecting : plan.cta}
                            </button>

                            <ul style={s.features}>
                                {plan.features.map((f, fi) => (
                                    <li key={fi} style={{
                                        ...s.feature,
                                        color: f.included ? '#a0a0b8' : '#4a4a5c',
                                    }}>
                                        <span style={{
                                            ...s.featureIcon,
                                            color: f.included ? '#10b981' : '#4a4a5c',
                                        }}>
                                            {f.included ? '✓' : '✗'}
                                        </span>
                                        {f.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={s.guarantee}>
                    <span style={{ fontSize: '24px' }}>🛡️</span>
                    <div>
                        <h4 style={s.guaranteeTitle}>
                            {typeof t.guarantee === 'string' ? t.guarantee : t.guarantee?.title}
                        </h4>
                        {typeof t.guarantee !== 'string' && (
                            <p style={s.guaranteeText}>
                                {t.guarantee?.text}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

const s = {
    page: {
        padding: '80px 0 120px',
        background: 'radial-gradient(ellipse at top, #1a1a3e 0%, #0a0a0f 70%)',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '64px',
    },
    title: {
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 800,
        marginBottom: '12px',
        letterSpacing: '-1px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#a0a0b8',
        marginBottom: '32px',
    },
    toggle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
    },
    toggleLabel: {
        fontSize: '14px',
        fontWeight: 500,
        transition: 'color 0.2s ease',
    },
    toggleBtn: {
        width: '50px',
        height: '26px',
        borderRadius: '13px',
        background: '#1a1a2e',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        position: 'relative',
        padding: 0,
    },
    toggleDot: {
        display: 'block',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', // Amber gradient
        transition: 'transform 0.2s ease',
    },
    saveBadge: {
        fontSize: '11px',
        fontWeight: 700,
        color: '#10b981',
        background: 'rgba(16, 185, 129, 0.1)',
        padding: '2px 8px',
        borderRadius: '10px',
        marginLeft: '4px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        maxWidth: '960px',
        margin: '0 auto',
    },
    card: {
        padding: '36px',
        textAlign: 'center',
        position: 'relative',
    },
    popularCard: {
        borderColor: '#f59e0b', // Amber
        boxShadow: '0 0 40px rgba(245, 158, 11, 0.2)', // Amber shadow
        transform: 'scale(1.02)',
    },
    popularBadge: {
        position: 'absolute',
        top: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', // Amber gradient
        color: 'white',
        padding: '4px 20px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
    },
    planName: {
        fontSize: '22px',
        fontWeight: 700,
        marginBottom: '4px',
    },
    planDesc: {
        fontSize: '14px',
        color: '#6b6b80',
        marginBottom: '24px',
    },
    priceRow: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: '2px',
    },
    currency: {
        fontSize: '20px',
        fontWeight: 600,
        color: '#a0a0b8',
        alignSelf: 'flex-start',
        marginTop: '8px',
    },
    price: {
        fontSize: '56px',
        fontWeight: 800,
        lineHeight: 1,
    },
    period: {
        fontSize: '16px',
        color: '#6b6b80',
    },
    yearlyNote: {
        fontSize: '13px',
        color: '#6b6b80',
        marginTop: '4px',
    },
    features: {
        listStyle: 'none',
        padding: 0,
        marginTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        textAlign: 'left',
    },
    feature: {
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    featureIcon: {
        fontSize: '14px',
        fontWeight: 700,
        flexShrink: 0,
    },
    guarantee: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '500px',
        margin: '64px auto 0',
        padding: '24px',
        background: 'rgba(245, 158, 11, 0.05)', // Amber background
        border: '1px solid rgba(245, 158, 11, 0.15)', // Amber border
        borderRadius: '12px',
        textAlign: 'left',
    },
    guaranteeTitle: {
        fontSize: '15px',
        fontWeight: 600,
        marginBottom: '4px',
    },
    guaranteeText: {
        fontSize: '13px',
        color: '#a0a0b8',
        lineHeight: 1.5,
    },
};
