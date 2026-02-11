'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import '@/app/globals.css';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [balanceAlert, setBalanceAlert] = useState(null);

    const menuItems = [
        { name: 'Overview', href: '/admin', icon: '📊' },
        { name: 'Users', href: '/admin/users', icon: '👥' },
        { name: 'Documents', href: '/admin/documents', icon: '📄' },
        { name: 'Admins', href: '/admin/admins', icon: '🛡️' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
        { name: 'Back to Site', href: '/', icon: '👈' },
    ];

    // Check balance on mount (mocked for now as we don't have a direct API to call from client easily without a route)
    // Real implementation would fetch from an API route that uses getProviderBalance()
    useEffect(() => {
        // Placeholder for balance check
    }, []);

    return (
        <html lang="en">
            <body>
                <div style={s.layout}>
                    {/* Sidebar */}
                    <aside style={s.sidebar}>
                        <div style={s.logo}>
                            {/* <Image src="/logo.png" alt="DocForge Admin" width={32} height={32} /> */}
                            <span style={s.logoText}>DocForge <span style={{ color: '#818cf8' }}>Admin</span></span>
                        </div>

                        <nav style={s.nav}>
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        style={{
                                            ...s.navItem,
                                            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                            color: isActive ? '#818cf8' : '#a0a0b8',
                                            borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                                        }}
                                    >
                                        <span style={s.navIcon}>{item.icon}</span>
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div style={s.footer}>
                            <div style={s.adminProfile}>
                                <div style={s.avatar}>A</div>
                                <div>
                                    <div style={s.adminName}>Admin User</div>
                                    <div style={s.adminRole}>Super Admin</div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main style={s.main}>
                        <header style={s.topBar}>
                            <h1 style={s.pageTitle}>
                                {menuItems.find(m => m.href === pathname)?.name || 'Admin'}
                            </h1>
                            <div style={s.topActions}>
                                {/* <div style={s.search}>
                                    <span style={{ marginLeft: '12px', fontSize: '14px' }}>🔍</span>
                                    <input type="text" placeholder="Search..." style={s.searchInput} />
                                </div> */}
                                <div style={{ position: 'relative', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '20px' }} title="Notifications">🔔</span>
                                    {balanceAlert && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-2px',
                                            right: '-2px',
                                            width: '8px',
                                            height: '8px',
                                            background: '#ef4444',
                                            borderRadius: '50%'
                                        }} />
                                    )}
                                </div>
                            </div>
                        </header>
                        <div style={s.content}>
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}

const s = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#f0f0f5',
        fontFamily: "'Inter', sans-serif",
    },
    sidebar: {
        width: '260px',
        background: '#08080d',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
    },
    logo: {
        padding: '32px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    logoText: {
        fontSize: '18px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
    },
    nav: {
        flex: 1,
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
    },
    navIcon: {
        fontSize: '18px',
    },
    footer: {
        padding: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    },
    adminProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '14px',
        color: 'white',
    },
    adminName: {
        fontSize: '13px',
        fontWeight: 600,
        color: '#f0f0f5',
    },
    adminRole: {
        fontSize: '11px',
        color: '#6b6b80',
    },
    main: {
        flex: 1,
        marginLeft: '260px',
        display: 'flex',
        flexDirection: 'column',
    },
    topBar: {
        height: '72px',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
    },
    pageTitle: {
        fontSize: '20px',
        fontWeight: 700,
        color: '#f0f0f5',
    },
    topActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    search: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        width: '240px',
        padding: '0 12px',
    },
    searchInput: {
        background: 'none',
        border: 'none',
        color: '#f0f0f5',
        padding: '8px 12px',
        fontSize: '13px',
        width: '100%',
        outline: 'none',
    },
    notifBtn: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        opacity: 0.7,
        padding: '8px',
    },
    content: {
        padding: '32px',
        flex: 1,
    },
};
