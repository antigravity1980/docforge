'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import ReactMarkdown from 'react-markdown'; // Removed
import Link from 'next/link';
import ReactDOMServer from 'react-dom/server';
import Logo from '@/components/Logo';
import Editor from '@/components/Editor'; // Added
import ReactMarkdown from 'react-markdown'; // Keep for fallback
import { createClient } from '@/utils/supabase/client';

export default function GenerateDocumentClient({ locale, config, ui, isAdmin, userPlan }) {
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
            // Check auth on the client side via Supabase browser client
            const supabase = createClient();
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (!currentUser) {
                router.push(`/${locale}/auth/signin`);
                return;
            }

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
        const logoHtml = `<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><img src="data:image/png;base64,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" alt="DocForge" style="height:48px;object-fit:contain;" /><span style="font-size:20px;font-weight:700;color:#111;font-family:'Inter',sans-serif;letter-spacing:-0.5px;">DocForge.site</span></div>`;

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
          <title>${config.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            
            @page {
                size: A4;
                margin: 20mm; /* Use native print margins for all pages */
            }
            
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 0; /* Let @page handle margins */
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
        const html2canvas = (await import('html2canvas')).default;

        const logoHtml = `<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><img src="data:image/png;base64,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" alt="DocForge" style="height:48px;object-fit:contain;" /><span style="font-size:20px;font-weight:700;color:#111;font-family:'Inter',sans-serif;letter-spacing:-0.5px;">DocForge.site</span></div>`;

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

        // Create a hidden iframe to render the content (same approach as working print)
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.left = '-9999px';
        iframe.style.top = '0';
        iframe.style.width = '794px'; // A4 width in px at 96dpi
        iframe.style.height = '1123px'; // A4 height
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        padding: 60px 50px;
                        color: #111;
                        background: #fff;
                        -webkit-print-color-adjust: exact;
                    }
                    .header-branding { margin-bottom: 30px; }
                    .content { font-size: 13px; line-height: 1.7; color: #000; }
                    .content h1 { font-size: 22px; font-weight: 800; margin-bottom: 12px; color: #000; }
                    .content h2 { font-size: 17px; font-weight: 700; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; }
                    .content h3 { font-size: 15px; font-weight: 600; margin-top: 18px; margin-bottom: 10px; color: #444; }
                    .content p { margin-bottom: 12px; text-align: justify; }
                    .content ul, .content ol { margin-bottom: 12px; padding-left: 24px; }
                    .content li { margin-bottom: 6px; }
                    .content strong { font-weight: 700; color: #000; }
                    .content em { font-style: italic; }
                    .disclaimer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #eee; font-size: 9px; color: #888; text-align: center; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="header-branding">${logoHtml}</div>
                <div class="content">${contentHtml}</div>
                <div class="disclaimer">${g.disclaimer || ''}</div>
            </body>
            </html>
        `);
        iframeDoc.close();

        try {
            // Wait for iframe content + fonts to fully load
            await new Promise((resolve) => {
                iframe.onload = resolve;
                setTimeout(resolve, 2000); // Fallback timeout
            });

            // Additional wait for fonts
            if (iframe.contentDocument?.fonts?.ready) {
                await iframe.contentDocument.fonts.ready;
            }
            // Small extra delay to ensure rendering is complete
            await new Promise(r => setTimeout(r, 300));

            const body = iframeDoc.body;
            const canvas = await html2canvas(body, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: 794,
                windowWidth: 794,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const margin = 20; // 20mm margins

            const contentWidth = pageWidth - (margin * 2);
            const contentHeight = pageHeight - (margin * 2);

            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = margin; // Set start position below top margin

            // First page
            pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);

            // Mask bottom margin to hide overspilling image
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, pageHeight - margin, pageWidth, margin, 'F');

            heightLeft -= contentHeight;

            // Additional pages if content is taller than one page's content area
            while (heightLeft > 0) {
                position -= contentHeight; // Shift image up by the height of the content area
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);

                // Mask the top margin
                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, 0, pageWidth, margin, 'F');

                // Mask the bottom margin
                pdf.rect(0, pageHeight - margin, pageWidth, margin, 'F');

                heightLeft -= contentHeight;
            }

            pdf.save(`${config.name || 'document'}.pdf`);
        } catch (e) {
            console.error('PDF generation error:', e);
            alert("Error generating PDF. Please try 'Print' instead.");
        } finally {
            document.body.removeChild(iframe);
        }
    };

    return (
        <section style={s.page}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={s.header}>
                    <button onClick={() => router.push(`/${locale}/generate`)} style={s.backBtn}>← {g.backToDocs || 'Back'}</button>
                    <div style={s.headerIcon}>{config.icon || '📄'}</div>
                    <h1 className="responsive-title">{config.name || 'Document Generator'}</h1>
                    <p style={s.subtitle}>{config.desc}</p>
                </div>

                {!config.fields ? (
                    <div style={s.error}>
                        ❌ {g.notFound || 'Document type not found. Please go back and select a valid document.'}
                    </div>
                ) : result ? (
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

                        {!isAdmin && userPlan !== 'Professional' && (
                            <p style={s.freeNote}>
                                {g.freeNote} · <Link href={`/${locale}/pricing`} style={{ color: '#818cf8' }}>
                                    {userPlan === 'Starter' ? g.upgradeToPro : g.upgradeMore}
                                </Link>
                            </p>
                        )}
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
