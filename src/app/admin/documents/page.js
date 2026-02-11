'use client';

import { useState, useEffect } from 'react';

export default function adminDocuments() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDocs();
    }, [page, search]);

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ page, search });
            const res = await fetch(`/api/admin/documents?${query}`);
            const data = await res.json();
            if (data.logs) {
                setLogs(data.logs);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <div style={s.search}>
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by Doc ID or user..."
                        style={s.searchInput}
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                {/* <div style={s.stats}>
                    <div style={s.statMini}>
                        <div style={s.statMiniLabel}>Today</div>
                        <div style={s.statMiniValue}>{total}</div>
                    </div>
                </div> */}
            </div>

            <div className="card" style={s.tableCard}>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th}>ID</th>
                            <th style={s.th}>User</th>
                            <th style={s.th}>Type</th>
                            {/* <th style={s.th}>Tokens</th> */}
                            <th style={s.th}>Time</th>
                            <th style={s.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ ...s.td, textAlign: 'center' }}>Loading...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan="5" style={{ ...s.td, textAlign: 'center' }}>No documents found.</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} style={s.tr}>
                                    <td style={s.td}><code style={s.code}>{log.id.slice(0, 8)}...</code></td>
                                    <td style={s.td}><span style={s.userEmail}>{log.user}</span></td>
                                    <td style={s.td}>{log.type}</td>
                                    {/* <td style={s.td}>{log.tokens}</td> */}
                                    <td style={s.td}>{log.time}</td>
                                    <td style={s.td}>
                                        <span style={{
                                            ...s.statusBadge,
                                            color: log.status === 'Success' ? '#10b981' : '#ef4444'
                                        }}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div style={s.pagination}>
                    <span style={s.paginationInfo}>
                        Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} docs
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
    },
    search: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        width: '350px',
    },
    searchInput: {
        background: 'none',
        border: 'none',
        color: '#f0f0f5',
        padding: '12px',
        fontSize: '14px',
        width: '100%',
    },
    stats: {
        display: 'flex',
        gap: '24px',
    },
    statMini: {
        textAlign: 'right',
    },
    statMiniLabel: {
        fontSize: '11px',
        color: '#6b6b80',
        textTransform: 'uppercase',
    },
    statMiniValue: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#818cf8',
    },
    tableCard: {
        padding: 0,
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    },
    tr: {
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    },
    td: {
        padding: '16px 24px',
        fontSize: '14px',
    },
    code: {
        background: 'rgba(255,255,255,0.05)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#a78bfa',
    },
    userEmail: {
        color: '#a0a0b8',
    },
    statusBadge: {
        fontSize: '12px',
        fontWeight: 600,
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
