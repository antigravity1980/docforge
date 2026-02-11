'use client';

const USERS = [];

export default function adminUsers() {
    return (
        <div style={s.container}>
            <div style={s.header}>
                <div style={s.search}>
                    <span>🔍</span>
                    <input type="text" placeholder="Search users by name or email..." style={s.searchInput} />
                </div>
                <div style={s.filters}>
                    <select style={s.filterSelect}>
                        <option>All Plans</option>
                        <option>Pro</option>
                        <option>Starter</option>
                        <option>Free</option>
                    </select>
                    <button className="btn btn-secondary btn-sm">Export CSV</button>
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
                            <th style={s.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {USERS.map((user) => (
                            <tr key={user.id} style={s.tr}>
                                <td style={s.td}>
                                    <div style={s.userInfo}>
                                        <div style={s.avatar}>{user.name[0]}</div>
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
                                <td style={s.td}>
                                    <button style={s.actionBtn}>•••</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={s.pagination}>
                    <span style={s.paginationInfo}>Showing 1 to 5 of 142 users</span>
                    <div style={s.paginationBtns}>
                        <button style={s.pageBtn} disabled>Previous</button>
                        <button style={{ ...s.pageBtn, background: '#6366f1', color: 'white' }}>1</button>
                        <button style={s.pageBtn}>2</button>
                        <button style={s.pageBtn}>3</button>
                        <button style={s.pageBtn}>Next</button>
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
