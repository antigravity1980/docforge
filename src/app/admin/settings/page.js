'use client';

import { useState, useEffect } from 'react';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: 'DocForge AI',
        supportEmail: '',
        maintenanceMode: false,
        aiProvider: 'groq',
        aiModel: 'llama-3.3-70b-versatile',
        maxFreeDocs: 3,
        priceStarter: 29,
        pricePro: 79,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.settings) {
                setSettings(prev => ({ ...prev, ...data.settings }));
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to save');
            }

            setMessage({ type: 'success', text: 'Settings saved successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    const getModelsForProvider = (provider) => {
        switch (provider) {
            case 'groq':
                return ['llama-3.3-70b-versatile', 'llama3-8b-8192', 'mixtral-8x7b-32768'];
            case 'deepseek':
                return ['deepseek-chat', 'deepseek-coder'];
            case 'openrouter':
                return ['meta-llama/llama-3.1-70b-instruct', 'anthropic/claude-3-opus', 'google/gemini-pro-1.5', 'openai/gpt-4o'];
            default:
                return [];
        }
    };

    const getProviderLink = (provider) => {
        switch (provider) {
            case 'groq': return 'https://console.groq.com/settings/billing';
            case 'deepseek': return 'https://platform.deepseek.com/top_up';
            case 'openrouter': return 'https://openrouter.ai/credits';
            default: return '#';
        }
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <h2 style={s.title}>Global Settings</h2>
                <button
                    style={s.saveBtn}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message && (
                <div style={{
                    ...s.message,
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? '#10b981' : '#ef4444',
                    border: message.type === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    {message.text}
                </div>
            )}

            <div style={s.grid}>
                {/* General Settings */}
                <div className="card" style={s.card}>
                    <h3 style={s.cardTitle}>General</h3>
                    <div style={s.formGroup}>
                        <label style={s.label}>Site Name</label>
                        <input
                            type="text"
                            style={s.input}
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        />
                    </div>
                    <div style={s.formGroup}>
                        <label style={s.label}>Support Email</label>
                        <input
                            type="text"
                            style={s.input}
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        />
                    </div>
                </div>

                {/* AI Configuration */}
                <div className="card" style={s.card}>
                    <h3 style={s.cardTitle}>AI Configuration</h3>
                    <div style={s.formGroup}>
                        <label style={s.label}>AI Provider</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <select
                                style={s.select}
                                value={settings.aiProvider}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    aiProvider: e.target.value,
                                    aiModel: getModelsForProvider(e.target.value)[0]
                                })}
                            >
                                <option value="groq">Groq (Fast & Free)</option>
                                <option value="deepseek">DeepSeek (Low Cost)</option>
                                <option value="openrouter">OpenRouter (All Models)</option>
                            </select>
                            <a
                                href={getProviderLink(settings.aiProvider)}
                                target="_blank"
                                className="btn"
                                style={{
                                    ...s.saveBtn,
                                    background: 'rgba(255,255,255,0.05)',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                    height: '42px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                Check Balance ↗
                            </a>
                        </div>
                    </div>
                    <div style={s.formGroup}>
                        <label style={s.label}>Model</label>
                        <select
                            style={s.select}
                            value={settings.aiModel}
                            onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                        >
                            {/* Always show current model even if not in list (legacy support) */}
                            {!getModelsForProvider(settings.aiProvider).includes(settings.aiModel) && settings.aiModel && (
                                <option value={settings.aiModel}>{settings.aiModel} (Custom/Legacy)</option>
                            )}
                            {getModelsForProvider(settings.aiProvider).map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Pricing & Limits */}
                <div className="card" style={s.card}>
                    <h3 style={s.cardTitle}>Pricing & Limits</h3>
                    <div style={s.formGroup}>
                        <label style={s.label}>Free Generation Limit (per month)</label>
                        <input
                            type="number"
                            style={s.input}
                            value={settings.maxFreeDocs}
                            onChange={(e) => setSettings({ ...settings, maxFreeDocs: parseInt(e.target.value) })}
                        />
                    </div>
                    <div style={s.row}>
                        <div style={s.formGroup}>
                            <label style={s.label}>Starter Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                style={s.input}
                                value={settings.priceStarter}
                                onChange={(e) => setSettings({ ...settings, priceStarter: e.target.value })}
                            />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.label}>Pro Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                style={s.input}
                                value={settings.pricePro}
                                onChange={(e) => setSettings({ ...settings, pricePro: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="card" style={{ ...s.card, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h3 style={{ ...s.cardTitle, color: '#ef4444' }}>Danger Zone</h3>
                    <div style={s.formGroup}>
                        <div style={s.checkboxRow}>
                            <input
                                type="checkbox"
                                id="maintenance"
                                checked={settings.maintenanceMode === 'true' || settings.maintenanceMode === true}
                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                            />
                            <label htmlFor="maintenance" style={{ ...s.label, marginBottom: 0 }}>Enable Maintenance Mode</label>
                        </div>
                        <p style={s.hint}>This will block access for all non-admin users.</p>
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
        maxWidth: '800px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '24px',
        fontWeight: 700,
    },
    saveBtn: {
        background: '#6366f1',
        color: 'white',
        border: 'none',
        padding: '0 24px',
        height: '42px',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    card: {
        padding: '24px',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 600,
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '12px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: 500,
        color: '#a0a0b8',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '12px',
        color: 'white',
        fontSize: '14px',
    },
    select: {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '12px',
        color: 'white',
        fontSize: '14px',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    message: {
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
    },
    checkboxRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    hint: {
        fontSize: '12px',
        color: '#6b6b80',
        marginTop: '6px',
        marginLeft: '24px',
    },
};
