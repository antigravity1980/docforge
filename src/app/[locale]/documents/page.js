import { createClient } from '@/utils/supabase/server';
import { getDictionary } from '@/lib/get-dictionary';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DocumentsPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);
    const t = dict.dashboard;
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect(`/${locale}/auth/signin`);
    }

    const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    return (
        <section style={s.page}>
            <div className="container">
                <div style={s.header}>
                    <div>
                        <Link href={`/${locale}/dashboard`} style={s.backLink}>← {t.backToDashboard || 'Back'}</Link>
                        <h1 style={s.title}>{t.recentDocs}</h1>
                        <p style={s.subtitle}>{documents?.length || 0} documents</p>
                    </div>
                    <Link href={`/${locale}/generate`} className="btn btn-primary">
                        {t.newDoc}
                    </Link>
                </div>

                <div style={s.docsList}>
                    {documents && documents.length > 0 ? documents.map((doc) => (
                        <div key={doc.id} style={s.docItem}>
                            <div style={s.docIcon}>📄</div>
                            <div style={s.docInfo}>
                                <div style={s.docName}>{doc.title}</div>
                                <div style={s.docMeta}>{doc.type} · {new Date(doc.created_at).toLocaleDateString(locale)}</div>
                            </div>
                            <Link href={`/${locale}/documents/${doc.id}`} className="btn btn-sm btn-secondary">
                                {t.view}
                            </Link>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#6b6b80', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                            {t.noDocs}
                        </div>
                    )}
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
    backLink: {
        color: '#818cf8',
        textDecoration: 'none',
        fontSize: '14px',
        marginBottom: '8px',
        display: 'block',
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
    docsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    docItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '24px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        transition: 'all 0.2s ease',
    },
    docIcon: {
        fontSize: '24px',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.05)',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    docInfo: {
        flex: 1,
    },
    docName: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#f0f0f5',
        marginBottom: '4px',
    },
    docMeta: {
        fontSize: '13px',
        color: '#6b6b80',
    },
};
