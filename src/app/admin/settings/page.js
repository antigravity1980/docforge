import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        siteName: 'DocForge AI',
        supportEmail: 'support@docforge.ai',
        maintenanceMode: false,
        aiModel: 'llama-3.3-70b-versatile',
        maxFreeDocs: 3,
        priceStarter: '29',
        pricePro: '79'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setMessage('✅ Settings saved successfully');
                setTimeout(() => setMessage(''), 3000);
            } else {
                const data = await res.json();
                setMessage('❌ Error: ' + (data.error || 'Failed to save'));
            }
        } catch (err) {
            setMessage('❌ Network error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={s.container}>
            <h2 style={s.sectionTitle}>Global System Settings</h2>

            <form onSubmit={handleSave} style={s.card}>
                <div style={s.grid}>
                    <div className="form-group">
                        <label className="form-label">SaaS Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={settings.siteName}
                            onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Support Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={settings.supportEmail}
                            onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Primary AI Model</label>
                        <select
                            className="form-select"
                            value={settings.aiModel}
                            onChange={e => setSettings({ ...settings, aiModel: e.target.value })}
                        >
                            <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Fast/Free)</option>
                            <option value="llama-3-70b-8192">Llama 3 70B</option>
                            <option value="deepseek-chat">DeepSeek Chat (V3)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Free Plan Documents Limit</label>
                        <input
                            type="number"
                            className="form-input"
                            value={settings.maxFreeDocs}
                            onChange={e => setSettings({ ...settings, maxFreeDocs: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Starter Plan Price ($)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={settings.priceStarter}
                            onChange={e => setSettings({ ...settings, priceStarter: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Pro Plan Price ($)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={settings.pricePro}
                            onChange={e => setSettings({ ...settings, pricePro: e.target.value })}
                        />
                    </div>
                </div>

                <div style={s.divider} />

                <div style={s.toggleSection}>
                    <div>
                        <div style={s.toggleLabel}>Maintenance Mode</div>
                        <div style={s.toggleSub}>When enabled, users will see a &quot;Site under maintenance&quot; page.</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                        style={{
                            ...s.toggleBtn,
                            background: settings.maintenanceMode ? '#ef4444' : 'rgba(255,255,255,0.05)'
                        }}
                    >
                        {settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}
                    </button>
                </div>

                {message && <div style={s.successMsg}>{message}</div>}

                <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>

            <div style={{ ...s.card, marginTop: '32px', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <h3 style={{ ...s.sectionTitle, color: '#ef4444', marginBottom: '16px' }}>Danger Zone</h3>
                <p style={s.toggleSub}>These actions are irreversible and affect the entire application.</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button className="btn btn-secondary" style={{ color: '#ef4444' }}>Clear All Session Logs</button>
                    <button className="btn btn-secondary" style={{ color: '#ef4444' }}>Reset Usage Statistics</button>
                </div>
            </div>
        </div>
    );
}

const s = {
    container: {
        maxWidth: '800px',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 700,
        marginBottom: '24px',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '32px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
    },
    divider: {
        height: '1px',
        background: 'rgba(255, 255, 255, 0.06)',
        margin: '32px 0',
    },
    toggleSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: '15px',
        fontWeight: 600,
    },
    toggleSub: {
        fontSize: '13px',
        color: '#6b6b80',
        marginTop: '4px',
    },
    toggleBtn: {
        padding: '8px 20px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        fontSize: '12px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    successMsg: {
        marginTop: '20px',
        padding: '12px',
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        borderRadius: '10px',
        fontSize: '14px',
        textAlign: 'center',
    },
};
