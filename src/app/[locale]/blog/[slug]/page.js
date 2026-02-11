import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { BLOG_POSTS as STATIC_BLOG_POSTS } from '@/lib/blog-data';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }) {
    const { slug, locale } = await params;
    const dict = await getDictionary(locale);
    const post = STATIC_BLOG_POSTS.find(p => p.slug === slug);

    if (!post) return {};

    const localized = dict.blog_posts?.find(p => p.slug === slug);
    const finalPost = localized ? { ...post, ...localized } : post;

    return {
        title: `${finalPost.title} | ${dict.blog.title}`,
        description: finalPost.description,
    };
}

export default async function BlogPostPage({ params }) {
    const { slug, locale } = await params;
    const dict = await getDictionary(locale);
    const t = dict.blog;

    const post = STATIC_BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    const localized = dict.blog_posts?.find(p => p.slug === slug);
    const finalPost = localized ? { ...post, ...localized } : post;

    return (
        <div style={styles.page}>
            <div className="container">
                <Link href={`/${locale}/blog`} style={styles.backLink}>{t.back}</Link>

                <article style={styles.article}>
                    <header style={styles.articleHeader}>
                        <div style={styles.meta}>
                            <span style={styles.category}>{finalPost.category}</span>
                            <span style={styles.date}>{finalPost.date}</span>
                        </div>
                        <h1 style={styles.title}>{finalPost.title}</h1>
                        <div style={styles.author}>{t.by} {finalPost.author}</div>
                    </header>

                    <div style={styles.content} className="markdown-content">
                        <ReactMarkdown>{finalPost.content}</ReactMarkdown>
                    </div>

                    <footer style={styles.articleFooter}>
                        <h3>{t.wantMore}</h3>
                        <p>{t.newsletter}</p>
                        <div style={styles.ctaGroup}>
                            <Link href={`/${locale}/generate`} className="btn btn-primary">{t.startGen}</Link>
                            <Link href={`/${locale}/pricing`} className="btn btn-secondary">{t.viewPricing}</Link>
                        </div>
                    </footer>
                </article>
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: '80px 0',
        background: 'var(--bg-primary)',
    },
    backLink: {
        display: 'inline-block',
        marginBottom: '32px',
        color: '#818cf8',
        fontSize: '15px',
        textDecoration: 'none',
    },
    article: {
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '32px',
        padding: '64px',
    },
    articleHeader: {
        marginBottom: '48px',
        textAlign: 'center',
    },
    meta: {
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '24px',
    },
    category: {
        fontSize: '12px',
        fontWeight: 700,
        color: '#818cf8',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    date: {
        fontSize: '14px',
        color: '#6b6b80',
    },
    title: {
        fontSize: '40px',
        fontWeight: 800,
        lineHeight: 1.2,
        color: '#fff',
        marginBottom: '24px',
    },
    author: {
        fontSize: '15px',
        color: '#6b6b80',
    },
    content: {
        color: '#a0a0b8',
        fontSize: '18px',
        lineHeight: 1.8,
    },
    articleFooter: {
        marginTop: '64px',
        paddingTop: '48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
    },
    ctaGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '24px',
    },
};

// Global styles for raw markdown
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .markdown-content h2 { color: #f0f0f5; font-size: 28px; font-weight: 700; margin: 40px 0 20px; }
        .markdown-content h3 { color: #f0f0f5; font-size: 22px; font-weight: 600; margin: 32px 0 16px; }
        .markdown-content p { margin-bottom: 24px; }
        .markdown-content ul, .markdown-content ol { margin-bottom: 24px; padding-left: 20px; }
        .markdown-content li { margin-bottom: 12px; }
        .markdown-content strong { color: #fff; font-weight: 700; }
        @media (max-width: 768px) {
            article { padding: 32px !important; }
            h1 { font-size: 32px !important; }
        }
    `;
    document.head.appendChild(style);
}
