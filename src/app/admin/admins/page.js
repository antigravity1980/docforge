'use client';

import { useState, useEffect } from 'react';

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admin/admins');
            if (res.ok) {
                const data = await res.json();
                setAdmins(data.admins);
            }
        } catch (err) {
            console.error('Failed to fetch admins');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setAdding(true);
        setError('');

        try {
            const res = await fetch('/api/admin/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newAdminEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                setNewAdminEmail('');
                fetchAdmins();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveAdmin = async (id, email) => {
        if (!confirm(`Are you sure you want to revoke admin rights from ${email}?`)) return;

        try {
            const res = await fetch('/api/admin/admins', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, email }),
            });

            if (res.ok) {
                fetchAdmins();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to remove admin');
            }
        } catch (err) {
            alert('Something went wrong');
        }
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <h2 style={s.title}>Admin Management</h2>
                <p style={s.subtitle}>
                    View and manage users with administrative privileges.
                    <br />
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        Note: &quot;Config Admins&quot; are hardcoded and cannot be removed here. &quot;Database Admins&quot; are managed via Supabase Auth metadata.
                    </span>
                </p>
            </div>

            {/* Add Admin Form */}
            <div style={s.card}>
                <h3 style={s.cardTitle}>Add New Admin</h3>
                <form onSubmit={handleAddAdmin} style={s.form}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="email"
                            placeholder="user@example.com"
                            className="form-input"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={adding}>
                        {adding ? 'Adding...' : 'Promote to Admin'}
                    </button>
                </form>
                {error && <div style={s.error}>{error}</div>}
            </div>

            {/* Admin List */}
            <div style={{ ...s.card, marginTop: '24px' }}>
                <h3 style={s.cardTitle}>Current Administrators</h3>
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6b6b80' }}>Loading...</div>
                ) : (
                    <div style={s.list}>
                        {admins.map((admin) => (
                            <div key={admin.id} style={s.item}>
                                <div style={s.itemInfo}>
                                    <div style={s.itemEmail}>{admin.email}</div>
                                    <div style={s.itemMeta}>
                                        <span style={{
                                            ...s.badge,
                                            background: admin.source === 'config' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: admin.source === 'config' ? '#818cf8' : '#10b981'
                                        }}>
                                            {admin.source === 'config' ? 'Super Admin (Config)' : 'Admin (DB)'}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#6b6b80' }}>
                                            Last Active: {admin.last_sign_in ? new Date(admin.last_sign_in).toLocaleDateString() : 'Never'}
                                        </span>
                                    </div>
                                </div>
                                {admin.source !== 'config' && (
                                    <button
                                        onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                                        className="btn btn-secondary btn-sm"
                                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                    >
                                        Revoke
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const s = {
    container: {
        maxWidth: '800px',
    },
    header: {
        marginBottom: '32px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 700,
        marginBottom: '8px',
    },
    subtitle: {
        color: '#6b6b80',
        lineHeight: 1.6,
    },
    card: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 600,
        marginBottom: '16px',
    },
    form: {
        display: 'flex',
        gap: '12px',
    },
    error: {
        marginTop: '12px',
        color: '#ef4444',
        fontSize: '13px',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    itemEmail: {
        fontSize: '15px',
        fontWeight: 500,
        color: '#f0f0f5',
    },
    itemMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    badge: {
        fontSize: '11px',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '10px',
    },
};
