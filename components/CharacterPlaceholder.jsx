'use client'
import { useState } from 'react'

const CONFIGS = {
    reading: { color: '#8B6B4A', label: 'Leser' },
    inviting: { color: '#4A7B6B', label: 'Einladend' },
    contemplating: { color: '#6B5A8B', label: 'Kontemplierend' },
    morning: { color: '#D4A853', label: 'Morgen' },
    evening: { color: '#4A5B8B', label: 'Abend' },
    letter: { color: '#8B4A6B', label: 'Brief' },
    bust: { color: '#6B8B4A', label: 'Stoiker' },
}

export default function CharacterPlaceholder({ type = 'reading', size = 100 }) {
    const [imgError, setImgError] = useState(false)
    const cfg = CONFIGS[type] || CONFIGS.reading

    if (!imgError) {
        return (
            <img
                src={`/characters/${type}.png`}
                width={size}
                height={size}
                style={{ objectFit: 'contain', display: 'block' }}
                onError={() => setImgError(true)}
                alt=""
            />
        )
    }

    // Fallback - sieht intentional aus, nicht wie ein Fehler
    return (
        <div style={{
            width: size, height: size,
            borderRadius: '50%',
            background: `${cfg.color}18`,
            border: `2px dashed ${cfg.color}50`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
            flexShrink: 0,
        }}>
            <svg
                width={size * 0.32} height={size * 0.32}
                viewBox="0 0 24 24" fill="none"
                stroke={`${cfg.color}70`} strokeWidth="1.5" strokeLinecap="round"
            >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span style={{
                fontSize: Math.max(size * 0.09, 8),
                color: `${cfg.color}70`,
                fontFamily: 'sans-serif',
                letterSpacing: '0.05em',
            }}>
                {cfg.label}
            </span>
        </div>
    )
}