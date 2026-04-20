'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const CORRECT_PIN = '090116'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 30 // Sekunden
const STORAGE_KEY = 'sj_auth'
const SESSION_MS = 8 * 60 * 60 * 1000

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

function vibrate(pattern) {
    if (typeof navigator === 'undefined') return
    if (navigator.vibrate) {
        try { navigator.vibrate(pattern) } catch { }
    }
}

export default function PinOverlay({ onUnlocked }) {
    const [pin, setPin] = useState('')
    const [attempts, setAttempts] = useState(0)
    const [lockedUntil, setLockedUntil] = useState(null)
    const [countdown, setCountdown] = useState(0)
    const [shake, setShake] = useState(false)
    const [hint, setHint] = useState('')
    const [unlocked, setUnlocked] = useState(false)
    const totalLockoutRef = useRef(0)

    // Auth-State beim Start laden
    useEffect(() => {
        const state = getAuthState()
        if (!state) return

        if (state.unlockedAt) {
            const elapsed = Date.now() - state.unlockedAt
            if (elapsed < SESSION_MS) {
                setUnlocked(true)
                onUnlocked()
                return
            }
        }

        if (state.lockedUntil && state.lockedUntil > Date.now()) {
            setLockedUntil(state.lockedUntil)
            setAttempts(state.attempts || 0)
            totalLockoutRef.current = state.totalLockout || (state.lockedUntil - Date.now())
        } else if (state.attempts) {
            setAttempts(state.attempts)
        }
    }, [onUnlocked])

    // Countdown Timer (250ms für smoothen Progress-Ring)
    useEffect(() => {
        if (!lockedUntil) return
        const tick = () => {
            const remaining = (lockedUntil - Date.now()) / 1000
            if (remaining <= 0) {
                setLockedUntil(null)
                setCountdown(0)
                setHint('')
                setAuthState({ attempts: 0 })
                return false
            }
            setCountdown(Math.ceil(remaining))
            return true
        }
        tick()
        const interval = setInterval(() => { if (!tick()) clearInterval(interval) }, 250)
        return () => clearInterval(interval)
    }, [lockedUntil])

    const triggerShake = () => {
        setShake(true)
        vibrate([60, 50, 60])
        setTimeout(() => setShake(false), 500)
    }

    const checkPin = useCallback((inputPin) => {
        if (inputPin === CORRECT_PIN) {
            vibrate([30, 60, 30])
            setUnlocked(true)
            setAuthState({ unlockedAt: Date.now(), attempts: 0 })
            setTimeout(() => onUnlocked(), 700)
        } else {
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            setPin('')
            triggerShake()

            const remaining = MAX_ATTEMPTS - newAttempts

            if (newAttempts >= MAX_ATTEMPTS) {
                const multiplier = Math.pow(2, Math.floor(newAttempts / MAX_ATTEMPTS) - 1)
                const lockoutMs = LOCKOUT_DURATION * 1000 * multiplier
                const until = Date.now() + lockoutMs
                totalLockoutRef.current = lockoutMs
                setLockedUntil(until)
                setHint('')
                setAuthState({ lockedUntil: until, attempts: newAttempts, totalLockout: lockoutMs })
            } else {
                setHint(remaining === 1
                    ? 'Letzter Versuch vor Sperrung'
                    : `${remaining} Versuche verbleibend`)
                setAuthState({ attempts: newAttempts })
            }
        }
    }, [attempts, onUnlocked])

    const handleDigit = useCallback((digit) => {
        if (lockedUntil) return
        if (pin.length >= 6) return
        vibrate(8)
        setPin(prev => {
            const next = prev + digit
            if (next.length === 6) setTimeout(() => checkPin(next), 100)
            return next
        })
        setHint('')
    }, [pin, lockedUntil, checkPin])

    const handleDelete = useCallback(() => {
        if (lockedUntil) return
        vibrate(5)
        setPin(prev => prev.slice(0, -1))
        setHint('')
    }, [lockedUntil])

    // Keyboard Support
    useEffect(() => {
        const handler = (e) => {
            if (unlocked) return
            if (e.key >= '0' && e.key <= '9') handleDigit(e.key)
            if (e.key === 'Backspace') handleDelete()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [handleDigit, handleDelete, unlocked])

    // Success-State
    if (unlocked) {
        return (
            <div style={styles.overlay}>
                <div style={{ animation: 'successPulse 600ms ease both' }}>
                    <svg viewBox="0 0 56 56" width="88" height="88" style={{ display: 'block' }}>
                        <circle
                            cx="28" cy="28" r="25"
                            fill="rgba(212,168,83,0.08)"
                            stroke="#D4A853"
                            strokeWidth="1.5"
                            style={{
                                strokeDasharray: 157,
                                strokeDashoffset: 157,
                                animation: 'checkmarkCircle 500ms ease forwards',
                            }}
                        />
                        <path
                            d="M17 28l8 8 14-16"
                            fill="none"
                            stroke="#D4A853"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: 40,
                                strokeDashoffset: 40,
                                animation: 'checkmarkCheck 400ms 450ms ease forwards',
                            }}
                        />
                    </svg>
                </div>
            </div>
        )
    }

    const isLocked = lockedUntil && lockedUntil > Date.now()
    const lockoutMultiplier = Math.floor(attempts / MAX_ATTEMPTS)
    const totalLockout = totalLockoutRef.current / 1000
    const progress = isLocked && totalLockout > 0
        ? Math.max(0, Math.min(1, countdown / totalLockout))
        : 0
    const RING_CIRCUMFERENCE = 226 // 2 * PI * 36

    return (
        <div style={styles.overlay}>
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
                    {isLocked ? 'Kurz durchatmen' : 'PIN eingeben'}
                </p>

                {/* Countdown Ring (nur wenn gesperrt) ODER PIN Dots */}
                {isLocked ? (
                    <div style={styles.ringWrap}>
                        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                            <circle
                                cx="40" cy="40" r="36"
                                fill="none"
                                stroke="rgba(245,240,232,0.08)"
                                strokeWidth="2"
                            />
                            <circle
                                cx="40" cy="40" r="36"
                                fill="none"
                                stroke="#E8956D"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray={RING_CIRCUMFERENCE}
                                strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
                                style={{ transition: 'stroke-dashoffset 300ms linear' }}
                            />
                        </svg>
                        <div style={styles.ringCenter}>
                            <span style={styles.ringNumber}>{countdown}</span>
                            <span style={styles.ringUnit}>Sek</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ ...styles.dotsRow, animation: shake ? 'shake 500ms ease' : 'none' }}>
                        {[0, 1, 2, 3, 4, 5].map(i => (
                            <div
                                key={i}
                                style={{
                                    ...styles.dot,
                                    background: pin.length > i ? '#D4A853' : 'rgba(245,240,232,0.14)',
                                    borderColor: pin.length > i ? '#D4A853' : 'rgba(212,168,83,0.35)',
                                    transform: pin.length > i ? 'scale(1.2)' : 'scale(1)',
                                    boxShadow: pin.length > i
                                        ? '0 0 12px rgba(212,168,83,0.4)'
                                        : 'none',
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Hint / Error */}
                <p style={{
                    ...styles.hint,
                    color: isLocked
                        ? '#E8956D'
                        : hint.includes('Letzter')
                            ? '#E8956D'
                            : 'rgba(245,240,232,0.4)',
                    animation: isLocked ? 'pulse 2.4s ease infinite' : 'none',
                }}>
                    {isLocked
                        ? `Zu viele Versuche${lockoutMultiplier > 1 ? ` (Sperrung ${lockoutMultiplier}x verlängert)` : ''}`
                        : hint || ' '}
                </p>

                {/* Numpad */}
                <div style={{
                    ...styles.numpad,
                    opacity: isLocked ? 0.25 : 1,
                    pointerEvents: isLocked ? 'none' : 'auto',
                    transition: 'opacity 400ms ease',
                }}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, i) => {
                        if (key === '') return <div key={i} />
                        const isDelete = key === '⌫'
                        return (
                            <button
                                key={i}
                                className={isDelete ? 'pin-key pin-key-delete' : 'pin-key'}
                                onClick={() => isDelete ? handleDelete() : handleDigit(key)}
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
                                transform: i < attempts ? 'scale(1.1)' : 'scale(1)',
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
        padding: '20px',
        paddingTop: 'max(20px, env(safe-area-inset-top))',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
    },
    card: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '36px 28px 32px',
        width: '100%', maxWidth: 340,
        animation: 'fadeIn 500ms ease both',
    },
    logoWrap: {
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(212,168,83,0.08)',
        border: '1px solid rgba(212,168,83,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
    },
    logo: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    title: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 22, color: '#F5F0E8', fontWeight: 400,
        marginBottom: 4, letterSpacing: '0.01em',
    },
    subtitle: {
        fontSize: 13, fontWeight: 300, color: 'rgba(245,240,232,0.4)',
        marginBottom: 26, letterSpacing: '0.05em',
    },
    dotsRow: {
        display: 'flex', gap: 16, marginBottom: 14,
        height: 16, alignItems: 'center',
    },
    dot: {
        width: 12, height: 12, borderRadius: '50%',
        border: '1.5px solid rgba(212,168,83,0.4)',
        transition: 'all 200ms ease',
    },
    ringWrap: {
        position: 'relative',
        width: 80, height: 80,
        marginBottom: 14,
    },
    ringCenter: {
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
    },
    ringNumber: {
        fontFamily: "'DM Serif Display', serif",
        fontSize: 28, color: '#E8956D', lineHeight: 1,
    },
    ringUnit: {
        fontSize: 10, color: 'rgba(232,149,109,0.6)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        marginTop: 2,
    },
    hint: {
        fontSize: 12, fontWeight: 300,
        letterSpacing: '0.04em', marginBottom: 24,
        minHeight: 18, textAlign: 'center',
        transition: 'color 300ms ease',
    },
    numpad: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10, width: '100%', maxWidth: 260,
    },
    attemptsRow: {
        display: 'flex', gap: 8, marginTop: 22,
    },
    attemptDot: {
        width: 7, height: 7, borderRadius: '50%',
        transition: 'all 300ms ease',
    },
}