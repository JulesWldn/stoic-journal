'use client'
import { SS } from '@/lib/styles'
import { haptic } from '@/lib/haptics'
import CharacterPlaceholder from './CharacterPlaceholder'

export default function ProfileScreen({ notes, letters, onBack, onLock }) {
    const totalNotes = notes.length
    const guidedNotes = notes.filter(n => n.is_guided).length
    const freeNotes = totalNotes - guidedNotes
    const lockedLetters = letters.filter(l => new Date(l.unlock_date) > new Date()).length
    const unlockedLetters = letters.filter(l => new Date(l.unlock_date) <= new Date()).length

    // Tage seit Start (erste Notiz oder erster Brief)
    const allDates = [...notes, ...letters]
        .map(x => {
            const t = x.timestamp || x.unlock_date
            const d = new Date(t)
            return isNaN(d) ? null : d
        })
        .filter(Boolean)
        .sort((a, b) => a - b)
    const first = allDates[0]
    const days = first
        ? Math.max(1, Math.ceil((Date.now() - first.getTime()) / 86400000))
        : 0

    const handleLock = () => {
        if (!confirm('App jetzt sperren? Du musst deine PIN erneut eingeben.')) return
        haptic('medium')
        onLock()
    }

    const label = {
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
        letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9A9085',
    }

    const statCard = (value, text, key) => (
        <div key={key} style={{
            flex: 1,
            background: '#FDFAF4',
            border: '1px solid rgba(154,144,133,0.15)',
            borderRadius: 16,
            padding: '18px 14px',
            textAlign: 'center',
            minWidth: 0,
        }}>
            <p style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 28,
                color: '#2C2C2C', lineHeight: 1, fontWeight: 400,
            }}>{value}</p>
            <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#9A9085', marginTop: 8,
            }}>{text}</p>
        </div>
    )

    return (
        <div style={{ height: '100%', background: '#F5F0E8', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 8px' }}>
                <button style={SS.bk} onClick={() => { haptic('tap'); onBack() }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round">
                        <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#2C2C2C', fontWeight: 400 }}>
                    Profil
                </h2>
            </div>

            <div style={{ padding: '16px 20px 40px', animation: 'fadeIn 500ms ease both' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <CharacterPlaceholder type="contemplating" size={90} />
                </div>

                {days > 0 ? (
                    <p style={{
                        fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
                        fontSize: 15, color: '#9A9085', textAlign: 'center', marginBottom: 28,
                    }}>
                        Seit {days} {days === 1 ? 'Tag' : 'Tagen'} auf dem Weg.
                    </p>
                ) : (
                    <p style={{
                        fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
                        fontSize: 15, color: '#9A9085', textAlign: 'center', marginBottom: 28,
                    }}>
                        Ein neuer Weg beginnt.
                    </p>
                )}

                <p style={{ ...label, marginBottom: 10 }}>Deine Gedanken</p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {statCard(totalNotes, totalNotes === 1 ? 'Notiz' : 'Notizen', 'tn')}
                    {statCard(guidedNotes, 'Rituale', 'gn')}
                    {statCard(freeNotes, 'Freitext', 'fn')}
                </div>

                <p style={{ ...label, marginBottom: 10 }}>Deine Briefe</p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
                    {statCard(lockedLetters, 'Versiegelt', 'll')}
                    {statCard(unlockedLetters, 'Bereit', 'ul')}
                </div>

                <div style={{
                    background: '#FDFAF4',
                    border: '1px solid rgba(212,168,83,0.2)',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                }}>
                    <p style={{ ...label, marginBottom: 8 }}>Sicherheit</p>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300,
                        color: '#2C2C2C', lineHeight: 1.6, marginBottom: 14,
                    }}>
                        Deine App ist durch PIN geschützt. Du kannst sie jederzeit manuell sperren.
                    </p>
                    <button
                        onClick={handleLock}
                        style={{
                            background: 'transparent',
                            border: '1.5px solid rgba(196,114,74,0.4)',
                            color: '#C4724A',
                            padding: '10px 18px',
                            borderRadius: 12,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13, fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 180ms ease',
                        }}
                        onPointerDown={e => {
                            e.currentTarget.style.background = 'rgba(196,114,74,0.08)'
                        }}
                        onPointerUp={e => {
                            e.currentTarget.style.background = 'transparent'
                        }}
                        onPointerLeave={e => {
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        Jetzt sperren
                    </button>
                </div>

                <p style={{
                    fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
                    fontSize: 13, color: 'rgba(154,144,133,0.7)', textAlign: 'center',
                    marginTop: 20, letterSpacing: '0.02em',
                }}>
                    Stoic Journal
                </p>
            </div>
        </div>
    )
}