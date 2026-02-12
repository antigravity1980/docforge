'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import ReactMarkdown from 'react-markdown'; // Removed
import Link from 'next/link';
import ReactDOMServer from 'react-dom/server';
import Logo from '@/components/Logo';
import Editor from '@/components/Editor'; // Added
import ReactMarkdown from 'react-markdown'; // Keep for fallback

export default function GenerateDocumentClient({ locale, config, ui, user }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [editorHtml, setEditorHtml] = useState('');
    const router = useRouter();

    // We use 'ui' prop for translations now
    const g = ui || {};

    const [error, setError] = useState(null);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(''); // Reset editor state on new generation

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: config.slug, // Ensure config has slug
                    locale,
                    data: formData
                })
            });

            if (!res.ok) throw new Error('Failed to generate');

            const data = await res.json();
            setResult(data.document);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const handlePrint = () => {
        const logoHtml = ReactDOMServer.renderToStaticMarkup(<Logo showText={true} width={40} height={40} fontSize="24px" />);

        // Use edited HTML if available, otherwise fallback to initial markdown
        let contentHtml;
        if (editorHtml) {
            contentHtml = editorHtml;
        } else {
            contentHtml = ReactDOMServer.renderToStaticMarkup(
                <div className="markdown-content">
                    <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            );
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>${config.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            
            @page {
                size: A4;
                margin: 0; /* Remove browser headers/footers */
            }
            
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 20mm; /* Add content margin back */
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
        // We'll use the print logic but inside a hidden iframe or temporary div to grab canvas?
        // Actually, easiest way compatible with current CSS is using html2canvas on a temporary rendered element.
        // But html2canvas often misses styles. 
        // A better approach for "Download without Print Dialog" using our exact print layout
        // is tricky purely client-side without using window.print() to PDF (which is manual).
        // Standard jsPDF 'html' method:

        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = 40;
        const scale = 0.8; // Adjust to fit width

        // Element to capture
        // We need to render the content into a hidden div that mimics the print layout
        // For simplicity, let's capture the 'editor' content if possible, or construct a temporary node.

        const tempDiv = document.createElement('div');
        tempDiv.style.width = '595pt'; // A4 width in pt
        tempDiv.style.padding = '40px';
        tempDiv.style.background = '#fff';
        tempDiv.style.color = '#000';
        tempDiv.style.fontFamily = 'Inter, sans-serif';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';

        // Logo
        const logoHtml = ReactDOMServer.renderToStaticMarkup(<Logo showText={true} width={40} height={40} fontSize="24px" />);

        // Content
        let contentHtml;
        if (editorHtml) {
            contentHtml = editorHtml;
        } else {
            contentHtml = ReactDOMServer.renderToStaticMarkup(
                <div className="markdown-content">
                    <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            );
        }

        tempDiv.innerHTML = `
            <div style="margin-bottom: 40px;">${logoHtml}</div>
            <div class="pdf-content" style="font-size: 12px; line-height: 1.5;">
                ${contentHtml}
            </div>
            <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 10px; color: #999; text-align: center;">
                ${g.disclaimer}
            </div>
        `;

        document.body.appendChild(tempDiv);

        try {
            doc.html(tempDiv, {
                callback: function (doc) {
                    doc.save(`${config.title}.pdf`);
                    document.body.removeChild(tempDiv);
                },
                x: 0,
                y: 0,
                width: 595, // target width in the PDF document
                windowWidth: 800, // window width in CSS pixels
                margin: [20, 20, 20, 20],
                autoPaging: 'text',
                html2canvas: {
                    scale: 0.75, // Adjust scale to fit
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
                    <button onClick={() => router.push(`/${locale}/templates`)} style={s.backBtn}>← {g.backToDocs || 'Back'}</button>
                    <div style={s.headerIcon}>{config.icon}</div>
                    <h1 className="responsive-title">{config.title}</h1>
                    <p style={s.subtitle}>{config.subtitle}</p>
                </div>

                {result ? (
                    <div style={s.resultSection}>
                        <div style={s.resultHeader}>
                            <h2 style={s.resultTitle}>{g.docGenerated}</h2>
                            <div style={s.resultActions}>
                                <button onClick={() => { navigator.clipboard.writeText(editorHtml || result); }} className="btn btn-secondary btn-sm">
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
                            <Editor initialContent={result} onChange={setEditorHtml} />
                        </div>

                        <div style={s.disclaimer}>
                            {g.disclaimer}
                        </div>

                        <button onClick={() => { setResult(null); setEditorHtml(null); }} className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }}>
                            {g.genAnother}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={s.form}>
                        {config.fields.map((field) => (
                            <div key={field.name} className="form-group">
                                <label className="form-label" htmlFor={field.name}>
                                    {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                                </label>
                                {field.type === 'select' ? (
                                    <select
                                        id={field.name}
                                        className="form-select"
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        required={field.required}
                                    >
                                        <option value="">{g.select}</option>
                                        {field.options && field.options.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        className="form-textarea"
                                        placeholder={field.placeholder}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        required={field.required}
                                    />
                                ) : (
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        className="form-input"
                                        placeholder={field.placeholder}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        required={field.required}
                                    />
                                )}
                            </div>
                        ))}

                        {error && (
                            <div style={s.error}>
                                ❌ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: '18px', height: '18px' }} />
                                    {g.generating}
                                </>
                            ) : (
                                <>{g.genBtn}</>
                            )}
                        </button>

                        <p style={s.freeNote}>
                            {g.freeNote} · <Link href={`/${locale}/pricing`} style={{ color: '#818cf8' }}>{g.upgradeMore}</Link>
                        </p>
                    </form>
                )}
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
    form: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    freeNote: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#6b6b80',
    },
    error: {
        padding: '12px 16px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '10px',
        color: '#ef4444',
        fontSize: '14px',
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
    resultText: {
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        lineHeight: 1.8,
        color: '#d0d0e0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
};
