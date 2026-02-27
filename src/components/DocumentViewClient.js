'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import ReactMarkdown from 'react-markdown'; // Removed
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import ReactDOMServer from 'react-dom/server';
import Logo from '@/components/Logo';
import Editor from '@/components/Editor'; // Added
import ReactMarkdown from 'react-markdown'; // Keep for fallback in PDF generation if needed

export default function DocumentViewClient({ doc, locale, dict }) {
    const router = useRouter();
    const g = dict.generate;
    const ui = g.ui || {};
    const [editorHtml, setEditorHtml] = useState(null); // Added state

    // Config based on doc type, similar to generator
    const docConfig = g.docs && g.docs[doc.type] ? g.docs[doc.type] : {
        name: doc.title,
        desc: doc.type,
        icon: '📄'
    };

    // ... imports

    const handlePrint = () => {
        const logoBase64 = "data:image/png;base64,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";
        const logoHtml = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${logoBase64}" alt="DocForge Logo" style="width: 40px; height: 40px;" />
                <span style="font-size: 24px; font-weight: 800; color: #111; letter-spacing: -0.5px; font-family: 'Inter', sans-serif;">
                    Doc<span style="color: #f59e0b;">Forge</span> AI
                </span>
            </div>
        `;

        // Use edited HTML if available, otherwise generate from initial markdown
        let contentHtml;
        if (editorHtml) {
            contentHtml = editorHtml;
        } else {
            contentHtml = ReactDOMServer.renderToStaticMarkup(
                <div className="markdown-content">
                    <ReactMarkdown>{doc.content}</ReactMarkdown>
                </div>
            );
        }

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
                padding: 20mm;
                color: #111;
                -webkit-print-color-adjust: exact;
            }

            .print-container {
                width: 100%;
                margin: 0;
            }

            /* Logo Styling */
            .header-branding { margin-bottom: 40px; }
            
            /* Content Styling (Shared for Markdown & Editor HTML) */
            .content { font-size: 14px; line-height: 1.6; }
            .content h1 { font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #000; }
            .content h2 { font-size: 18px; font-weight: 700; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; }
            .content h3 { font-size: 16px; font-weight: 600; margin-top: 24px; margin-bottom: 12px; color: #444; }
            .content p { margin-bottom: 16px; text-align: justify; }
            .content ul, .content ol { margin-bottom: 16px; padding-left: 24px; }
            .content li { margin-bottom: 8px; }
            
            /* Bold/Italic Fixes */
            .content strong { font-weight: 800; color: #000; }
            .content em { font-style: italic; }
            
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

    const handleDownload = async () => {
        const { jsPDF } = await import('jspdf');
        const docPDF = new jsPDF('p', 'pt', 'a4');

        const tempDiv = document.createElement('div');
        tempDiv.style.width = '595pt';
        tempDiv.style.padding = '40px';
        tempDiv.style.background = '#fff';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-10000px';
        tempDiv.style.top = '0';

        const logoBase64 = "data:image/png;base64,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";
        const logoHtml = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${logoBase64}" alt="DocForge Logo" style="width: 40px; height: 40px;" />
                <span style="font-size: 24px; font-weight: 800; color: #111; letter-spacing: -0.5px; font-family: 'Inter', sans-serif;">
                    Doc<span style="color: #f59e0b;">Forge</span> AI
                </span>
            </div>
        `;

        let contentHtml;
        if (editorHtml) {
            contentHtml = editorHtml;
        } else {
            contentHtml = ReactDOMServer.renderToStaticMarkup(
                <div className="markdown-content">
                    <ReactMarkdown>{doc.content}</ReactMarkdown>
                </div>
            );
        }

        // Inject styles directly for html2canvas to capture
        tempDiv.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                .pdf-container { font-family: 'Inter', sans-serif; color: #111; }
                .header-branding { margin-bottom: 30px; }
                .pdf-content { font-size: 11pt; line-height: 1.6; color: #000; }
                .pdf-content h1 { font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #000; }
                .pdf-content h2 { font-size: 18px; font-weight: 700; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; }
                .pdf-content h3 { font-size: 16px; font-weight: 600; margin-top: 18px; margin-bottom: 10px; color: #444; }
                .pdf-content p { margin-bottom: 12px; text-align: justify; }
                .pdf-content ul, .pdf-content ol { margin-bottom: 12px; padding-left: 20px; }
                .pdf-content li { margin-bottom: 6px; }
                .pdf-content strong { font-weight: 800; color: #000; }
                .disclaimer { margin-top: 50px; padding-top: 15px; border-top: 0.5pt solid #eee; font-size: 9pt; color: #666; text-align: center; font-style: italic; }
            </style>
            <div class="pdf-container">
                <div class="header-branding">${logoHtml}</div>
                <div class="pdf-content">
                    ${contentHtml}
                </div>
                <div class="disclaimer">
                    ${ui.disclaimer}
                </div>
            </div>
        `;

        document.body.appendChild(tempDiv);

        try {
            await docPDF.html(tempDiv, {
                callback: function (pdf) {
                    pdf.save(`${doc.title || 'document'}.pdf`);
                    document.body.removeChild(tempDiv);
                },
                x: 0,
                y: 0,
                width: 595,
                windowWidth: 800,
                margin: [20, 20, 20, 20],
                autoPaging: 'text',
                html2canvas: {
                    scale: 0.75,
                    useCORS: true,
                    logging: false
                }
            });
        } catch (e) {
            console.error(e);
            alert("Error generating PDF. Please try 'Print' instead.");
            if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
            }
        }
    };

    return (
        <section style={s.page}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={s.header}>
                    <Link href={`/${locale}/documents`} style={s.backBtn}>← {dict.dashboard.viewAll}</Link>
                    <div style={s.headerIcon}>{docConfig.icon || '📄'}</div>
                    <h1 className="responsive-title">{doc.title}</h1>
                    <p style={s.subtitle}>{new Date(doc.created_at).toLocaleDateString(locale)} · {doc.type}</p>
                </div>

                <div style={s.resultSection}>
                    <div style={s.resultHeader}>
                        <h2 style={s.resultTitle}>{ui.docGenerated || "Document Content"}</h2>
                        <div style={s.resultActions}>
                            <button onClick={() => { navigator.clipboard.writeText(editorHtml || doc.content); }} className="btn btn-secondary btn-sm">
                                📋 {ui.copy || 'Copy'}
                            </button>
                            <button onClick={handleDownload} className="btn btn-primary btn-sm">
                                💾 {ui.downloadPdf || 'Download PDF'}
                            </button>
                            <button onClick={handlePrint} className="btn btn-secondary btn-sm">
                                🖨️ {ui.print || 'Print'}
                            </button>
                        </div>
                    </div>

                    <div style={s.resultContent}>
                        <Editor initialContent={doc.content} onChange={setEditorHtml} />
                    </div>

                    <div style={s.disclaimer}>
                        {ui.disclaimer}
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
        // Handled by .responsive-title
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
