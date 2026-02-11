'use client';

const LOGS = [];

export default function adminDocuments() {
    return (
        <div style={s.container}>
            <div style={s.header}>
                <div style={s.search}>
                    <span>🔍</span>
                    <input type="text" placeholder="Search by Doc ID or user..." style={s.searchInput} />
                </div>
                <div style={s.stats}>
                    <div style={s.statMini}>
                        <div style={s.statMiniLabel}>Today</div>
                        <div style={s.statMiniValue}>142</div>
                    </div>
                    <div style={s.statMini}>
                        <div style={s.statMiniLabel}>Error Rate</div>
                        <div style={s.statMiniValue}>0.3%</div>
                    </div>
                </div>
            </div>

            <div className="card" style={s.tableCard}>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th}>ID</th>
                            <th style={s.th}>User</th>
                            <th style={s.th}>Type</th>
                            <th style={s.th}>Tokens</th>
                            <th style={s.th}>Time</th>
                            <th style={s.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LOGS.map((log) => (
                            <tr key={log.id} style={s.tr}>
                                <td style={s.td}><code style={s.code}>{log.id}</code></td>
                                <td style={s.td}><span style={s.userEmail}>{log.user}</span></td>
                                <td style={s.td}>{log.type}</td>
                                <td style={s.td}>{log.tokens}</td>
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
                        ))}
                    </tbody>
                </table>
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
};
