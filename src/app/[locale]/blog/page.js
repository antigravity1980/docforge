import { getDictionary } from '@/lib/get-dictionary';
import Link from 'next/link';
import { BLOG_POSTS as STATIC_BLOG_POSTS } from '@/lib/blog-data';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);
    return {
        title: `${dict.blog.title} | DocForge AI`,
        description: dict.blog.subtitle,
    };
}

export default async function BlogPage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);
    const t = dict.blog;

    // Map static posts to localized data if available
    const BLOG_POSTS = STATIC_BLOG_POSTS.map(post => {
        const localized = dict.blog_posts?.find(p => p.slug === post.slug);
        return localized ? { ...post, ...localized } : post;
    });

    return (
        <div style={styles.page}>
            <div className="container">
                <header style={styles.header}>
                    <h1 style={styles.title}>{t.title}</h1>
                    <p style={styles.subtitle}>{t.subtitle}</p>
                </header>

                <div style={styles.grid}>
                    {BLOG_POSTS.map((post) => (
                        <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} style={styles.card}>
                            <div style={styles.cardContent}>
                                <div style={styles.meta}>
                                    <span style={styles.category}>{post.category}</span>
                                    <span style={styles.date}>{post.date}</span>
                                </div>
                                <h2 style={styles.cardTitle}>{post.title}</h2>
                                <p style={styles.cardDesc}>{post.description}</p>
                                <div style={styles.author}>
                                    <span style={styles.authorName}>{t.by} {post.author}</span>
                                    <span style={styles.readMore}>{t.readMore}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: '80px 0',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '64px',
    },
    title: {
        fontSize: '48px',
        fontWeight: 800,
        marginBottom: '16px',
        background: 'linear-gradient(135deg, #fff 0%, #a0a0b8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: '18px',
        color: '#6b6b80',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '32px',
    },
    card: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        cursor: 'pointer',
    },
    cardContent: {
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    category: {
        fontSize: '12px',
        fontWeight: 700,
        color: '#818cf8',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    date: {
        fontSize: '13px',
        color: '#4a4a5c',
    },
    cardTitle: {
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: 1.3,
        color: '#fff',
        marginBottom: '16px',
    },
    cardDesc: {
        fontSize: '15px',
        lineHeight: 1.6,
        color: '#a0a0b8',
        marginBottom: '24px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    author: {
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
    },
    authorName: {
        fontSize: '13px',
        color: '#6b6b80',
    },
    readMore: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#818cf8',
    },
};
