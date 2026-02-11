'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function GenerateDocumentClient({ locale, dict }) {
    const params = useParams();
    const router = useRouter();
    const docType = params.type;
    const g = dict.generate;

    // Get document config from dictionary
    const docConfig = g.docs && g.docs[docType] ? g.docs[docType] : null;

    const DEFAULT_CONFIG = {
        title: g.formTitle || "Document Generator",
        subtitle: g.formSub || "AI-Powered",
        icon: '📄',
        fields: [
            { name: 'title', label: g.docTitleLabel || "Document Title", type: 'text', required: true },
            { name: 'content', label: g.describeLabel || "Describe what you need", type: 'textarea', placeholder: g.describePlaceholder || "Describe the document...", required: true },
        ],
    };

    const config = docConfig ? {
        title: docConfig.name,
        subtitle: docConfig.desc,
        icon: docConfig.icon || '📄',
        fields: docConfig.fields || DEFAULT_CONFIG.fields
    } : DEFAULT_CONFIG;

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: docType,
                    data: formData,
                    locale: locale
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Generation failed');
            }

            const data = await res.json();
            setResult(data.document);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
          <title>${config.title}</title>
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
            ${formatContent(result)}
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
                    <button onClick={() => router.push(`/${locale}/generate`)} style={s.backBtn}>{g.backToDocs}</button>
                    <div style={s.headerIcon}>{config.icon}</div>
                    <h1 style={s.title}>{config.title}</h1>
                    <p style={s.subtitle}>{config.subtitle}</p>
                </div>

                {result ? (
                    <div style={s.resultSection}>
                        <div style={s.resultHeader}>
                            <h2 style={s.resultTitle}>{g.docGenerated}</h2>
                            <div style={s.resultActions}>
                                <button onClick={() => { navigator.clipboard.writeText(result); }} className="btn btn-secondary btn-sm">
                                    {g.copy}
                                </button>
                                <button onClick={handleDownloadPDF} className="btn btn-primary btn-sm">
                                    {g.downloadPdf}
                                </button>
                            </div>
                        </div>

                        <div style={s.resultContent} className="markdown-content">
                            <ReactMarkdown>{result}</ReactMarkdown>
                        </div>

                        <div style={s.disclaimer}>
                            {g.disclaimer}
                        </div>

                        <button onClick={() => { setResult(null); }} className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }}>
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
        fontSize: '28px',
        fontWeight: 800,
        marginBottom: '4px',
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
