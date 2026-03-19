'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ADMIN_EMAILS } from '@/lib/config';
import { PLAN_LIMITS } from '@/lib/plans';

export default function DashboardClient({ locale, dict }) {
    const supabase = createClient();
    const [profile, setProfile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const t = dict.dashboard;
    const auth = dict.auth;
    const p = dict.page;

    const QUICK_ACTIONS = [
        { icon: '📄', name: p.features.items.nda.name, slug: 'nda', color: '#6366f1' },
        { icon: '🔒', name: p.features.items.privacy.name, slug: 'privacy-policy', color: '#8b5cf6' },
        { icon: '📜', name: p.features.items.tos.name, slug: 'tos', color: '#a78bfa' },
        { icon: '💼', name: p.features.items.proposal.name, slug: 'business-plan', color: '#3b82f6' },
        { icon: '🧾', name: p.features.items.invoice.name, slug: 'invoice', color: '#10b981' },
        { icon: '📈', name: p.features.items.meta.name, slug: 'meta-tags', color: '#f59e0b' },
    ];

    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const userEmail = user.email;
            const adminStatus = ADMIN_EMAILS.includes(userEmail);
            setIsAdmin(adminStatus);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // Override plan for admin
            if (adminStatus && profileData) {
                profileData.plan = 'Professional'; // Or 'Admin'
            }

            setProfile(profileData);

            const { data: docsData } = await supabase
                .from('documents')
                .select('id, title, type, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            setDocuments(docsData || []);
            setLoading(false);
        }

        loadDashboardData();
    }, []);

    const limit = isAdmin ? 9999 : (PLAN_LIMITS[profile?.plan] || 1);
    const used = profile?.docs_generated_this_month || 0;
    const planName = isAdmin ? 'Admin Unlimited' : (profile?.plan || t.currentPlan);

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.loading}</div>;
    }

    return (
        <section style={s.page}>
            <div className="container">
                <div style={s.header}>
                    <div>
                        <h1 style={s.title}>{t.welcome}</h1>
                        <p style={s.subtitle}>{t.subtitle}</p>
                    </div>
                    <Link href={`/${locale}/generate`} className="btn btn-primary">
                        {t.newDoc}
                    </Link>
                </div>

                <div style={s.statsGrid}>
                    <div style={s.statCard}>
                        <div style={s.statIcon}>📄</div>
                        <div>
                            <div style={s.statValue}>{used}/{limit}</div>
                            <div style={s.statLabel}>{t.docsThisMonth}</div>
                        </div>
                        <div style={s.progressBar}>
                            <div style={{ ...s.progressFill, width: `${(used / limit) * 100}%` }} />
                        </div>
                    </div>
                    <div style={s.statCard}>
                        <div style={s.statIcon}>⭐</div>
                        <div>
                            <div style={s.statValue}>{planName}</div>
                            <div style={s.statLabel}>{t.currentPlan}</div>
                        </div>
                        {!isAdmin && (
                            <Link href={`/${locale}/pricing`} style={s.upgradeLink}>
                                {profile?.plan === 'Starter' ? t.upgradeToPro : t.upgrade}
                            </Link>
                        )}
                    </div>
                    <div style={s.statCard}>
                        <div style={s.statIcon}>📊</div>
                        <div>
                            <div style={s.statValue}>{documents.length}</div>
                            <div style={s.statLabel}>{t.recentCount}</div>
                        </div>
                    </div>
                </div>

                <div style={s.section}>
                    <h2 style={s.sectionTitle}>{t.quickGenerate}</h2>
                    <div style={s.quickGrid}>
                        {QUICK_ACTIONS.map((action, i) => (
                            <Link key={i} href={`/${locale}/generate/${action.slug}`} style={s.quickCard}>
                                <span style={{ fontSize: '28px' }}>{action.icon}</span>
                                <span style={s.quickName}>{action.name}</span>
                                <span style={s.quickArrow}>→</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div style={s.section}>
                    <div style={s.sectionHeader}>
                        <h2 style={s.sectionTitle}>{t.recentDocs}</h2>
                        <Link href={`/${locale}/documents`} style={s.viewAll}>{t.viewAll}</Link>
                    </div>
                    <div style={s.docsList}>
                        {documents.length > 0 ? documents.map((doc) => (
                            <div key={doc.id} style={s.docItem}>
                                <div style={s.docIcon}>📄</div>
                                <div style={s.docInfo}>
                                    <div style={s.docName}>{doc.title}</div>
                                    <div style={s.docMeta}>{doc.type} · {new Date(doc.created_at).toLocaleDateString(locale)}</div>
                                </div>
                                <span className="badge badge-success" style={{ fontSize: '11px' }}>
                                    {t.completed}
                                </span>
                                <Link href={`/${locale}/documents/${doc.id}`} className="btn btn-sm btn-secondary">
                                    {t.view}
                                </Link>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6b6b80', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                                {t.noDocs}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

const s = {
    page: {
        padding: '40px 0 80px',
        minHeight: '100vh',
        background: 'var(--gradient-dark)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 800,
    },
    subtitle: {
        fontSize: '15px',
        color: '#6b6b80',
        marginTop: '4px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
    },
    statCard: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden',
    },
    statIcon: {
        fontSize: '24px',
    },
    statValue: {
        fontSize: '24px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    statLabel: {
        fontSize: '13px',
        color: '#6b6b80',
    },
    progressBar: {
        height: '6px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '3px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
        borderRadius: '3px',
        transition: 'width 0.5s ease',
    },
    upgradeLink: {
        fontSize: '13px',
        color: '#818cf8',
        fontWeight: 500,
    },
    section: {
        marginBottom: '40px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 700,
        marginBottom: '20px',
    },
    viewAll: {
        fontSize: '13px',
        color: '#818cf8',
        fontWeight: 500,
        marginBottom: '20px',
    },
    quickGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
    },
    quickCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '20px 12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    quickName: {
        fontSize: '12px',
        fontWeight: 500,
        color: '#a0a0b8',
        textAlign: 'center',
    },
    quickArrow: {
        fontSize: '12px',
        color: '#6b6b80',
        opacity: 0,
        transition: 'opacity 0.2s ease',
    },
    docsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    docItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
    },
    docIcon: {
        fontSize: '20px',
        flexShrink: 0,
    },
    docInfo: {
        flex: 1,
        minWidth: 0,
    },
    docName: {
        fontSize: '14px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    docMeta: {
        fontSize: '13px',
        color: '#6b6b80',
        marginTop: '2px',
    },
};
