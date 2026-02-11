'use client';

import { useState, useEffect } from 'react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ page, search });
            const res = await fetch(`/api/admin/users?${query}`);
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on search
    };

    const downloadCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Plan', 'Registered', 'Status'];
        const rows = users.map(u => [u.id, u.name, u.email, u.plan, u.registered, u.status]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers, ...rows].map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <div style={s.search}>
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        style={s.searchInput}
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <div style={s.filters}>
                    <button className="btn btn-secondary btn-sm" onClick={downloadCSV} disabled={users.length === 0}>
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="card" style={s.tableCard}>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th}>User</th>
                            <th style={s.th}>Plan</th>
                            <th style={s.th}>Registered</th>
                            <th style={s.th}>Status</th>
                            {/* <th style={s.th}>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ ...s.td, textAlign: 'center' }}>Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" style={{ ...s.td, textAlign: 'center' }}>No users found.</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} style={s.tr}>
                                    <td style={s.td}>
                                        <div style={s.userInfo}>
                                            <div style={s.avatar}>{user.name?.[0] || '?'}</div>
                                            <div>
                                                <div style={s.userName}>{user.name}</div>
                                                <div style={s.userEmail}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={s.td}>
                                        <span style={{
                                            ...s.planBadge,
                                            background: user.plan === 'Pro' ? 'rgba(99, 102, 241, 0.15)' :
                                                user.plan === 'Starter' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                                            color: user.plan === 'Pro' ? '#818cf8' :
                                                user.plan === 'Starter' ? '#a78bfa' : '#a0a0b8'
                                        }}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td style={s.td}>{user.registered}</td>
                                    <td style={s.td}>
                                        <span style={s.statusBadge}>
                                            <span style={s.statusDot} />
                                            {user.status}
                                        </span>
                                    </td>
                                    {/* <td style={s.td}>
                                        <button style={s.actionBtn}>•••</button>
                                    </td> */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div style={s.pagination}>
                    <span style={s.paginationInfo}>
                        Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} users
                    </span>
                    <div style={s.paginationBtns}>
                        <button
                            style={s.pageBtn}
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >Previous</button>

                        <span style={{ ...s.pageBtn, background: 'none', border: 'none' }}>{page} / {totalPages || 1}</span>

                        <button
                            style={s.pageBtn}
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const s = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
    },
    search: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        flex: 1,
        maxWidth: '400px',
    },
    searchInput: {
        background: 'none',
        border: 'none',
        color: '#f0f0f5',
        padding: '12px',
        fontSize: '14px',
        width: '100%',
    },
    filters: {
        display: 'flex',
        gap: '12px',
    },
    filterSelect: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        color: '#f0f0f5',
        padding: '0 16px',
        fontSize: '14px',
    },
    tableCard: {
        padding: 0,
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    },
    th: {
        padding: '16px 24px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#6b6b80',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(255,255,255,0.01)',
    },
    tr: {
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        transition: 'background 0.2s ease',
    },
    td: {
        padding: '16px 24px',
        fontSize: '14px',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        color: '#a0a0b8',
    },
    userName: {
        fontWeight: 600,
        color: '#f0f0f5',
    },
    userEmail: {
        fontSize: '12px',
        color: '#6b6b80',
    },
    planBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: '#10b981',
    },
    statusDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#10b981',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        color: '#6b6b80',
        cursor: 'pointer',
        fontSize: '16px',
    },
    pagination: {
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.01)',
    },
    paginationInfo: {
        fontSize: '13px',
        color: '#6b6b80',
    },
    paginationBtns: {
        display: 'flex',
        gap: '8px',
    },
    pageBtn: {
        padding: '6px 12px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        color: '#a0a0b8',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};
