'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import ReactDOMServer from 'react-dom/server';
import Logo from '@/components/Logo';

export default function DocumentViewClient({ doc, locale, dict }) {
    const router = useRouter();
    const g = dict.generate;

    // Config based on doc type, similar to generator
    const docConfig = g.docs && g.docs[doc.type] ? g.docs[doc.type] : {
        name: doc.title,
        desc: doc.type,
        icon: '📄'
    };

    // ... imports

    const handleDownloadPDF = () => {
        const logoHtml = ReactDOMServer.renderToStaticMarkup(<Logo showText={true} width={40} height={40} fontSize="24px" />);
        const contentHtml = ReactDOMServer.renderToStaticMarkup(
            <div className="markdown-content">
                <ReactMarkdown>{doc.content}</ReactMarkdown>
            </div>
        );

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>${doc.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            
            @page {
                size: A4;
                margin: 0;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 0;
                color: #111;
                -webkit-print-color-adjust: exact;
            }

            .print-container {
                padding: 20mm;
                max-width: 210mm;
                margin: 0 auto;
            }

            /* Logo Styling */
            .header-branding { margin-bottom: 40px; }
            
            /* Markdown Content Styling */
            .markdown-content { font-size: 14px; line-height: 1.6; }
            .markdown-content h1 { font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #000; }
            .markdown-content h2 { font-size: 18px; font-weight: 700; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; }
            .markdown-content h3 { font-size: 16px; font-weight: 600; margin-top: 24px; margin-bottom: 12px; color: #444; }
            .markdown-content p { margin-bottom: 16px; text-align: justify; }
            .markdown-content ul, .markdown-content ol { margin-bottom: 16px; padding-left: 24px; }
            .markdown-content li { margin-bottom: 8px; }
            
            /* Bold/Italic Fixes */
            .markdown-content strong { font-weight: 800; color: #000; }
            .markdown-content em { font-style: italic; }
            
            /* Disclaimer */
            .disclaimer { 
                margin-top: 60px; 
                padding-top: 20px; 
                border-top: 1px solid #eee; 
                font-size: 10px; 
                color: #999; 
                text-align: center;
                font-style: italic;
            }
            
            /* Hide URL/Title headers in some browsers */
            @media print {
                body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header-branding">
                ${logoHtml}
            </div>
            
            <div class="content">
                ${contentHtml}
            </div>

            <div class="disclaimer">
                ${g.disclaimer}
            </div>
          </div>
          <script>
            window.onload = () => {
                setTimeout(() => {
                    window.print();
                    window.close();
                }, 500);
            };
          </script>
        </body>
      </html>
    `);
        printWindow.document.close();
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
