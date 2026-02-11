import { getDictionary } from '@/lib/get-dictionary';
import { Logo } from '@/components/Logo';

export const metadata = {
    title: 'Maintenance Mode | DocForge AI',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function MaintenancePage({ params }) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoWrapper}>
                    <Logo className="w-12 h-12" />
                </div>
                <h1 style={styles.title}>Under Maintenance</h1>
                <p style={styles.description}>
                    We are currently upgrading DocForge AI to serve you better.
                    Please check back in a few minutes.
                </p>
                <div style={styles.status}>
                    <span style={styles.dot}></span>
                    System Upgrade inside
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0f1016',
        color: 'white',
        padding: '24px',
    },
    card: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '500px',
        textAlign: 'center',
    },
    logoWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '32px',
    },
    title: {
        fontSize: '32px',
        fontWeight: 700,
        marginBottom: '16px',
        background: 'linear-gradient(to right, #fff, #a5b4fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    description: {
        fontSize: '16px',
        color: '#a0a0b8',
        lineHeight: 1.6,
        marginBottom: '32px',
    },
    status: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        color: '#818cf8',
        fontWeight: 500,
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#818cf8',
        boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)',
    },
};
