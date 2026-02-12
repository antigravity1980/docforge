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
    const [editorHtml, setEditorHtml] = useState(null); // Added state

    // Config based on doc type, similar to generator
    const docConfig = g.docs && g.docs[doc.type] ? g.docs[doc.type] : {
        name: doc.title,
        desc: doc.type,
        icon: '📄'
    };

    // ... imports

    const handlePrint = () => {
        const logoHtml = ReactDOMServer.renderToStaticMarkup(<Logo showText={true} width={40} height={40} fontSize="24px" />);

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
        tempDiv.style.color = '#000';
        tempDiv.style.fontFamily = 'Inter, sans-serif';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';

        const logoHtml = ReactDOMServer.renderToStaticMarkup(<Logo showText={true} width={40} height={40} fontSize="24px" />);

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

        tempDiv.innerHTML = `
            <div style="margin-bottom: 30px;">${logoHtml}</div>
            <div class="pdf-content" style="font-size: 11pt; line-height: 1.6; color: #000;">
                ${contentHtml}
            </div>
            <div style="margin-top: 50px; padding-top: 15px; border-top: 0.5pt solid #eee; font-size: 9pt; color: #666; text-align: center; font-style: italic;">
                ${g.disclaimer}
            </div>
        `;

        document.body.appendChild(tempDiv);

        try {
            docPDF.html(tempDiv, {
                callback: function (pdf) {
                    pdf.save(`${doc.title}.pdf`);
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
                    logging: false,
                    letterRendering: true,
                    useCORS: true
                }
            });
        } catch (e) {
            console.error(e);
            alert("Error generating PDF. Please try 'Print' instead.");
            document.body.removeChild(tempDiv);
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
                        <h2 style={s.resultTitle}>{g.docGenerated || "Document Content"}</h2>
                        <div style={s.resultActions}>
                            <button onClick={() => { navigator.clipboard.writeText(editorHtml || doc.content); }} className="btn btn-secondary btn-sm">
                                📋 {g.copy || 'Copy'}
                            </button>
                            <button onClick={handleDownload} className="btn btn-primary btn-sm">
                                💾 {g.downloadPdf || 'Download PDF'}
                            </button>
                            <button onClick={handlePrint} className="btn btn-secondary btn-sm">
                                🖨️ {g.print || 'Print'}
                            </button>
                        </div>
                    </div>

                    <div style={s.resultContent}>
                        <Editor initialContent={doc.content} onChange={setEditorHtml} />
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
