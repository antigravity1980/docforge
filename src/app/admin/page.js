'use client';

const ADMIN_STATS = [
    { label: 'Total Revenue', value: '$0.00', change: '0%', icon: '💰', color: '#10b981' },
    { label: 'New Users', value: '0', change: '0%', icon: '👤', color: '#6366f1' },
    { label: 'Docs Generated', value: '0', change: '0%', icon: '📝', color: '#8b5cf6' },
    { label: 'Conversion Rate', value: '0%', change: '0%', icon: '📈', color: '#f59e0b' },
];

const RECENT_ACTIVITY = [];

export default function AdminDashboard() {
    return (
        <div style={s.container}>
            {/* Stats Grid */}
            <div style={s.statsGrid}>
                {ADMIN_STATS.map((stat, i) => (
                    <div key={i} className="card" style={s.statCard}>
                        <div style={s.statHeader}>
                            <div style={{ ...s.statIcon, background: `${stat.color}20`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <span style={s.statChange}>{stat.change}</span>
                        </div>
                        <div style={s.statValue}>{stat.value}</div>
                        <div style={s.statLabel}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={s.lowerGrid}>
                {/* Main Chart Placeholder */}
                <div className="card" style={s.chartCard}>
                    <div style={s.cardHeader}>
                        <h3 style={s.cardTitle}>Revenue & Usage</h3>
                        <select style={s.chartSelect}>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div style={s.chartPlaceholder}>
                        {/* Simulated Chart */}
                        <div style={s.chartLines}>
                            {[60, 40, 80, 50, 90, 70, 100].map((h, i) => (
                                <div key={i} style={{ ...s.chartBar, height: `${h}%` }}>
                                    <div style={s.chartBarTooltip}>${(h * 15).toFixed(0)}</div>
                                </div>
                            ))}
                        </div>
                        <div style={s.chartLabels}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(l => (
                                <span key={l} style={s.chartLabel}>{l}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card" style={s.activityCard}>
                    <h3 style={s.cardTitle}>Recent Activity</h3>
                    <div style={s.activityList}>
                        {RECENT_ACTIVITY.map((act, i) => (
                            <div key={i} style={s.activityItem}>
                                <div style={s.activityInfo}>
                                    <div style={s.activityUser}>{act.user}</div>
                                    <div style={s.activityAction}>{act.action}</div>
                                </div>
                                <div style={s.activityMeta}>
                                    {act.amount && <span style={s.activityAmount}>{act.amount}</span>}
                                    <div style={s.activityTime}>{act.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button style={s.viewAllBtn}>View all activity →</button>
                </div>
            </div>
        </div>
    );
}

const s = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
    },
    statCard: {
        padding: '24px',
    },
    statHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    statIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
    },
    statChange: {
        fontSize: '12px',
        fontWeight: 600,
        color: '#10b981',
        background: 'rgba(16, 185, 129, 0.1)',
        padding: '2px 8px',
        borderRadius: '10px',
    },
    statValue: {
        fontSize: '28px',
        fontWeight: 800,
        marginBottom: '4px',
    },
    statLabel: {
        fontSize: '13px',
        color: '#6b6b80',
        fontWeight: 500,
    },
    lowerGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
    },
    chartCard: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 700,
    },
    chartSelect: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        color: '#a0a0b8',
        padding: '4px 12px',
        fontSize: '12px',
        cursor: 'pointer',
    },
    chartPlaceholder: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 10px',
    },
    chartLines: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '240px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '12px',
    },
    chartBar: {
        width: '32px',
        background: 'linear-gradient(180deg, #6366f1 0%, rgba(99, 102, 241, 0.2) 100%)',
        borderRadius: '6px 6px 2px 2px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    chartBarTooltip: {
        position: 'absolute',
        top: '-35px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1a1a2e',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        opacity: 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    chartLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
    },
    chartLabel: {
        fontSize: '11px',
        color: '#6b6b80',
        width: '32px',
        textAlign: 'center',
    },
    activityCard: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
    },
    activityList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '24px',
        flex: 1,
    },
    activityItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    },
    activityUser: {
        fontSize: '13px',
        fontWeight: 600,
        marginBottom: '2px',
    },
    activityAction: {
        fontSize: '12px',
        color: '#6b6b80',
    },
    activityMeta: {
        textAlign: 'right',
    },
    activityAmount: {
        display: 'block',
        fontSize: '12px',
        fontWeight: 700,
        color: '#10b981',
        marginBottom: '2px',
    },
    activityTime: {
        fontSize: '11px',
        color: '#4a4a5c',
    },
    viewAllBtn: {
        background: 'none',
        border: 'none',
        color: '#818cf8',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        marginTop: '20px',
        textAlign: 'center',
        width: '100%',
    },
};

// CSS for chart hover
// Removed unsafe document.head.appendChild
