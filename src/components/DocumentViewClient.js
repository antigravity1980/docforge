'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function DocumentViewClient({ doc, locale, dict }) {
    const router = useRouter();
    const g = dict.generate;

    // Config based on doc type, similar to generator
    const docConfig = g.docs && g.docs[doc.type] ? g.docs[doc.type] : {
        name: doc.title,
        desc: doc.type,
        icon: '📄'
    };

    const handleDownloadPDF = () => {
        const formatContent = (text) => {
            return text
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*)\*/gim, '<em>$1</em>')
                .replace(/\n/g, '<br>');
        };

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>${doc.title}</title>
          <style>
            body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 40px; line-height: 1.6; color: #111; position: relative; }
            .header-branding { display: flex; flex-direction: column; margin-bottom: 30px; font-family: 'Inter', sans-serif; }
            .site-name { font-weight: 800; font-size: 16px; color: #111; }
            .site-url { font-size: 12px; color: #666; }
            h1 { font-size: 22px; text-align: center; margin-bottom: 25px; font-weight: bold; margin-top: 10px; }
            h2 { font-size: 18px; margin-top: 20px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            h3 { font-size: 16px; margin-top: 15px; font-weight: bold; }
            p { margin-bottom: 12px; }
            strong { font-weight: bold; }
            .disclaimer { 
                margin-top: 50px; 
                padding-top: 20px; 
                border-top: 1px solid #eee; 
                font-size: 10px; 
                color: #888; 
                text-align: center;
                font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="header-branding">
            <span class="site-name">⚡ DocForge AI</span>
            <span class="site-url">www.docforge.site</span>
          </div>
          <div class="content">
            ${formatContent(doc.content)}
          </div>
          <div class="disclaimer">
            ${g.disclaimer}
          </div>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <section style={s.page}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={s.header}>
                    <Link href={`/${locale}/documents`} style={s.backBtn}>← {dict.dashboard.viewAll}</Link>
                    <div style={s.headerIcon}>{docConfig.icon || '📄'}</div>
                    <h1 style={s.title}>{doc.title}</h1>
                    <p style={s.subtitle}>{new Date(doc.created_at).toLocaleDateString(locale)} · {doc.type}</p>
                </div>

                <div style={s.resultSection}>
                    <div style={s.resultHeader}>
                        <h2 style={s.resultTitle}>{g.docGenerated || "Document Content"}</h2>
                        <div style={s.resultActions}>
                            <button onClick={() => { navigator.clipboard.writeText(doc.content); }} className="btn btn-secondary btn-sm">
                                {g.copy}
                            </button>
                            <button onClick={handleDownloadPDF} className="btn btn-primary btn-sm">
                                {g.downloadPdf}
                            </button>
                        </div>
                    </div>

                    <div style={s.resultContent} className="markdown-content">
                        <ReactMarkdown>{doc.content}</ReactMarkdown>
                    </div>

                    <div style={s.disclaimer}>
                        {g.disclaimer}
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
        background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#818cf8',
        fontSize: '14px',
        cursor: 'pointer',
        marginBottom: '24px',
        display: 'inline-block',
        textDecoration: 'none',
    },
    headerIcon: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 800,
        marginBottom: '4px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#6b6b80',
    },
    resultSection: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '36px',
    },
    resultHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
    },
    resultTitle: {
        fontSize: '20px',
        fontWeight: 700,
    },
    resultActions: {
        display: 'flex',
        gap: '8px',
    },
    disclaimer: {
        padding: '12px 0',
        fontSize: '11px',
        color: '#4a4a5c',
        lineHeight: 1.4,
        textAlign: 'center',
        marginTop: '12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    resultContent: {
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '24px',
        maxHeight: '600px',
        overflowY: 'auto',
    },
};
