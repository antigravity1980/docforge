'use client';

export default function Logo({ width = 32, height = 32, showText = true, fontSize = '20px' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg
                width={width}
                height={height}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))' }}
            >
                <defs>
                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                </defs>
                {/* Forge / Shield Shape */}
                <path
                    d="M50 5 L85 20 L85 55 C85 75 50 95 50 95 C50 95 15 75 15 55 L15 20 L50 5Z"
                    fill="url(#logo-gradient)"
                />
                {/* Document Silhouette */}
                <path
                    d="M35 30 H65 V70 L50 60 L35 70 V30Z"
                    fill="white"
                    fillOpacity="0.9"
                />
                {/* AI Spark */}
                <circle cx="50" cy="45" r="4" fill="#6366f1" />
            </svg>

            {showText && (
                <span style={{
                    fontSize: fontSize,
                    fontWeight: 800,
                    color: '#f0f0f5',
                    letterSpacing: '-0.5px'
                }}>
                    Doc<span style={{
                        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Forge</span> AI
                </span>
            )}
        </div>
    );
}
