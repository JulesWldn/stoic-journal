'use client'
import { SS } from '@/lib/styles'
import CharacterPlaceholder from './CharacterPlaceholder'

export default function ArchiveScreen({ notes, letters, onBack, onOpenNote }) {
    const locked = letters.filter(l => new Date(l.unlock_date) > new Date())
    const unlocked = letters.filter(l => new Date(l.unlock_date) <= new Date())

    const label = { fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9A9085', marginBottom: 8 }
    const ts = { fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9085', marginBottom: 4 }

    return (
        <div style={{ height: '100%', background: '#F5F0E8', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 8px' }}>
                <button style={SS.bk} onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round">
                        <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#2C2C2C', fontWeight: 400 }}>
                    Deine Notizen
                </h2>
            </div>

            {unlocked.length > 0 && (
                <div style={{ padding: '4px 20px 8px' }}>
                    <p style={{ ...label, color: '#D4A853' }}>Briefe - bereit zum Öffnen</p>
                    {unlocked.map((l, i) => (
                        <div key={i} style={{ padding: '18px 0 18px 14px', borderBottom: '1px solid rgba(154,144,133,0.15)', borderLeft: '3px solid #D4A853' }}>
                            <p style={ts}>{l.timestamp} · versiegelt für {l.label}</p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: '#2C2C2C', lineHeight: 1.5 }}>
                                {l.body.substring(0, 100)}{l.body.length > 100 ? '...' : ''}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {locked.length > 0 && (
                <div style={{ padding: '4px 20px 8px' }}>
                    <p style={label}>Versiegelte Briefe</p>
                    {locked.map((l, i) => {
                        const d = Math.ceil((new Date(l.unlock_date) - new Date()) / 86400000)
                        return (
                            <div key={i} style={{ padding: '18px 0', borderBottom: '1px solid rgba(154,144,133,0.15)', opacity: 0.6 }}>
                                <p style={ts}>{l.timestamp}</p>
                                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: '#9A9085', fontStyle: 'italic' }}>
                                    Öffnet sich in {d} {d === 1 ? 'Tag' : 'Tagen'}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}

            <div style={{ padding: '12px 20px 32px' }}>
                {notes.length === 0 && letters.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, textAlign: 'center' }}>
                        <CharacterPlaceholder type="inviting" size={100} />
                        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#2C2C2C', marginTop: 20 }}>
                            Noch keine Notizen.
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: '#9A9085', marginTop: 8, maxWidth: 260, lineHeight: 1.5 }}>
                            Deine Gedanken erscheinen hier, sobald du sie aufschreibst.
                        </p>
                    </div>
                ) : (
                    [...notes].reverse().map(n => (
                        <div
                            key={n.id}
                            style={{ padding: '18px 0', borderBottom: '1px solid rgba(154,144,133,0.15)', cursor: 'pointer' }}
                            onClick={() => onOpenNote(n)}
                        >
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9085', marginBottom: 4 }}>
                                {n.timestamp}
                                {n.is_guided && <span style={{ color: '#C4724A', marginLeft: 8 }}>●</span>}
                            </p>
                            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: '#2C2C2C', marginBottom: 4 }}>
                                {n.title || 'Unbenannt'}
                            </p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: '#9A9085', lineHeight: 1.5 }}>
                                {n.body ? n.body.substring(0, 80) + (n.body.length > 80 ? '...' : '') : 'Kein Inhalt'}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}