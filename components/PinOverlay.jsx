'use client'
import { useState, useEffect, useCallback } from 'react'

const CORRECT_PIN = '090116'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 30 // Sekunden

const STORAGE_KEY = 'sj_auth'

function getAuthState() {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

function setAuthState(state) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export default function PinOverlay({ onUnlocked }) {
    const [pin, setPin] = useState('')
    const [attempts, setAttempts] = useState(0)
    const [lockedUntil, setLockedUntil] = useState(null)
    const [countdown, setCountdown] = useState(0)
    const [shake, setShake] = useState(false)
    const [hint, setHint] = useState('')
    const [unlocked, setUnlocked] = useState(false)

    // Auth-State beim Start laden
    useEffect(() => {
        const state = getAuthState()
        if (!state) return

        // Bereits entsperrt und Session noch gültig (8 Stunden)
        if (state.unlockedAt) {
            const elapsed = Date.now() - state.unlockedAt
            if (elapsed < 8 * 60 * 60 * 1000) {
                setUnlocked(true)
                onUnlocked()
                return
            }
        }

        // Lockout wiederherstellen
        if (state.lockedUntil && state.lockedUntil > Date.now()) {
            setLockedUntil(state.lockedUntil)
            setAttempts(state.attempts || 0)
        } else if (state.attempts) {
            setAttempts(state.attempts)
        }
    }, [onUnlocked])

    // Countdown Timer
    useEffect(() => {
        if (!lockedUntil) return
        const interval = setInterval(() => {
            const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
            if (remaining <= 0) {
                setLockedUntil(null)
                setCountdown(0)
                setHint('')
                setAuthState({ attempts: 0 })
                clearInterval(interval)
            } else {
                setCountdown(remaining)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [lockedUntil])

    const triggerShake = () => {
        setShake(true)
        setTimeout(() => setShake(false), 500)
    }

    const handleDigit = useCallback((digit) => {
        if (lockedUntil) return
        if (pin.length >= 6) return
        setPin(prev => {
            const next = prev + digit
            if (next.length === 6) {
                // Sofort prüfen wenn 6 Stellen erreicht
                setTimeout(() => checkPin(next), 80)
            }
            return next
        })
        setHint('')
    }, [pin, lockedUntil])

    const handleDelete = useCallback(() => {
        setPin(prev => prev.slice(0, -1))
        setHint('')
    }, [])

    const checkPin = useCallback((inputPin) => {
        if (inputPin === CORRECT_PIN) {
            // Erfolg
            setUnlocked(true)
            setAuthState({ unlockedAt: Date.now(), attempts: 0 })
            setTimeout(() => onUnlocked(), 400)
        } else {
            // Falsch
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            setPin('')
            triggerShake()

            const remaining = MAX_ATTEMPTS - newAttempts

            if (newAttempts >= MAX_ATTEMPTS) {
                // Lockout aktivieren - mit jeder weiteren Sperrung wird die Zeit länger
                const lockoutMs = LOCKOUT_DURATION * 1000 * Math.pow(2, Math.floor(newAttempts / MAX_ATTEMPTS) - 1)
                const until = Date.now() + lockoutMs
                setLockedUntil(until)
                setHint('')
                setAuthState({ lockedUntil: until, attempts: newAttempts })
            } else {
                setHint(remaining === 1
                    ? 'Letzter Versuch vor Sperrung'
                    : `${remaining} Versuche verbleibend`)
                setAuthState({ attempts: newAttempts })
            }
        }
    }, [attempts, onUnlocked])

    // Keyboard Support
    useEffect(() => {
        const handler = (e) => {
            if (unlocked) return
            if (e.key >= '0' && e.key <= '9') handleDigit(e.key)
            if (e.key === 'Backspace') handleDelete()
            if (e.key === 'Enter' && pin.length === 6) checkPin(pin)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [handleDigit, handleDelete, checkPin, pin, unlocked])

    if (unlocked) {
        return (
            <div style={styles.overlay}>
                <div style={{ animation: 'fadeIn 400ms ease both', textAlign: 'center' }}>
                    <div style={styles.checkmark}>✓</div>
                </div>
            </div>
        )
    }

    const isLocked = lockedUntil && lockedUntil > Date.now()
    const lockoutMultiplier = Math.floor(attempts / MAX_ATTEMPTS)

    return (
        <div style={styles.overlay}>
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .pin-dot-filled { animation: none; }
      `}</style>

            <div style={styles.card}>
                {/* Logo / Icon */}
                <div style={styles.logoWrap}>
                    <div style={styles.logo}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="14" stroke="#D4A853" strokeWidth="1.5" opacity="0.6" />
                            <circle cx="16" cy="16" r="6" fill="#D4A853" opacity="0.8" />
                        </svg>
                    </div>
                </div>

                <p style={styles.title}>Stoic Journal</p>
                <p style={styles.subtitle}>
                    {isLocked
                        ? `Gesperrt für ${countdown}s`
                        : 'PIN eingeben'}
                </p>

                {/* PIN Dots */}
                <div style={{ ...styles.dotsRow, animation: shake ? 'shake 500ms ease' : 'none' }}>
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            style={{
                                ...styles.dot,
                                background: pin.length > i
                                    ? '#D4A853'
                                    : isLocked
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'rgba(255,255,255,0.15)',
                                transform: pin.length > i ? 'scale(1.15)' : 'scale(1)',
                                transition: 'all 150ms ease',
                            }}
                        />
                    ))}
                </div>

                {/* Hint / Error */}
                <p style={{
                    ...styles.hint,
                    color: isLocked ? '#E8956D' : hint.includes('Letzter') ? '#E8956D' : 'rgba(245,240,232,0.4)',
                    animation: isLocked ? 'pulse 2s ease infinite' : 'none',
                }}>
                    {isLocked
                        ? `Zu viele Versuche${lockoutMultiplier > 1 ? ` (Sperrung ${lockoutMultiplier}x verlängert)` : ''}`
                        : hint || ' '}
                </p>

                {/* Numpad */}
                <div style={{ ...styles.numpad, opacity: isLocked ? 0.3 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, i) => {
                        if (key === '') return <div key={i} />
                        const isDelete = key === '⌫'
                        return (
                            <button
                                key={i}
                                onClick={() => isDelete ? handleDelete() : handleDigit(key)}
                                style={{
                                    ...styles.key,
                                    background: isDelete ? 'transparent' : 'rgba(245,240,232,0.06)',
                                    border: isDelete ? 'none' : '1px solid rgba(245,240,232,0.08)',
                                    color: isDelete ? 'rgba(245,240,232,0.5)' : '#F5F0E8',
                                    fontSize: isDelete ? 20 : 22,
                                }}
                                onPointerDown={e => {
                                    e.currentTarget.style.background = isDelete ? 'rgba(245,240,232,0.05)' : 'rgba(212,168,83,0.15)'
                                    e.currentTarget.style.borderColor = 'rgba(212,168,83,0.3)'
                                }}
                                onPointerUp={e => {
                                    e.currentTarget.style.background = isDelete ? 'transparent' : 'rgba(245,240,232,0.06)'
                                    e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)'
                                }}
                                onPointerLeave={e => {
                                    e.currentTarget.style.background = isDelete ? 'transparent' : 'rgba(245,240,232,0.06)'
                                    e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)'
                                }}
                            >
                                {key}
                            </button>
                        )
                    })}
                </div>

                {/* Versuche Indikator */}
                {attempts > 0 && !isLocked && (
                    <div style={styles.attemptsRow}>
                        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                            <div key={i} style={{
                                ...styles.attemptDot,
                                background: i < attempts ? '#E8956D' : 'rgba(245,240,232,0.15)',
                            }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(180deg, #2A1C14 0%, #1A1208 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
    },
    card: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 32px 36px', width: '100%', maxWidth: 340,
        animation: 'fadeIn 500ms ease both',
    },
    logoWrap: {
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(212,168,83,0.08)',
        border: '1px solid rgba(212,168,83,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
    },
    logo: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    title: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 22, color: '#F5F0E8', fontWeight: 400,
        marginBottom: 4, letterSpacing: '0.01em',
    },
    subtitle: {
        fontSize: 13, fontWeight: 300, color: 'rgba(245,240,232,0.4)',
        marginBottom: 32, letterSpacing: '0.05em',
    },
    dotsRow: {
        display: 'flex', gap: 16, marginBottom: 16,
    },
    dot: {
        width: 12, height: 12, borderRadius: '50%',
        border: '1.5px solid rgba(212,168,83,0.4)',
    },
    hint: {
        fontSize: 12, fontWeight: 300,
        letterSpacing: '0.04em', marginBottom: 28,
        minHeight: 18, textAlign: 'center',
        transition: 'color 300ms ease',
    },
    numpad: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, width: '100%', maxWidth: 260,
    },
    key: {
        height: 64, borderRadius: 16,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300, cursor: 'pointer',
        transition: 'background 100ms ease, border-color 100ms ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        letterSpacing: '0.02em',
    },
    checkmark: {
        fontSize: 48, color: '#D4A853',
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(212,168,83,0.1)',
        border: '2px solid rgba(212,168,83,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto',
    },
    attemptsRow: {
        display: 'flex', gap: 8, marginTop: 24,
    },
    attemptDot: {
        width: 8, height: 8, borderRadius: '50%',
        transition: 'background 300ms ease',
    },
}