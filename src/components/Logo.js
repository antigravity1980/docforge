'use client';
import Image from 'next/image';

export default function Logo({ width = 32, height = 32, showText = true, fontSize = '20px', className = '' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className={className}>
            <Image
                src="/logo.svg"
                alt="DocForge Logo"
                width={width}
                height={height}
                priority
            />

            {showText && (
                <span style={{
                    fontSize: fontSize,
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.5px'
                }}>
                    Doc<span style={{
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Forge</span> AI
                </span>
            )}
        </div>
    );
}
