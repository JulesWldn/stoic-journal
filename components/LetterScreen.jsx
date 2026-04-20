'use client'
import { SS } from '@/lib/styles'
import { useEffect, useRef, useState } from 'react'
import { haptic } from '@/lib/haptics'
import CharacterPlaceholder from './CharacterPlaceholder'
import content from '@/data/content.json'

export default function LetterScreen({ onBack, onSave }) {
    const [body, setBody] = useState('')
    const [dur, setDur] = useState(null)
    const [sent, setSent] = useState(false)
    const textareaRef = useRef(null)

    // Auto-Resize
    useEffect(() => {
        const ta = textareaRef.current
        if (!ta) return
        ta.style.height = 'auto'
        ta.style.height = Math.max(160, ta.scrollHeight) + 'px'
    }, [body])

    const previewDate = (i) => {
        if (i === null) return null
        const d = new Date()
        d.setDate(d.getDate() + content.letterDurations[i].days)
        return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    const selectDur = (i) => { haptic('select'); setDur(i) }

    const send = () => {
        if (!body.trim() || dur === null) return
        haptic('complete')
        const unlockDate = new Date()
        unlockDate.setDate(unlockDate.getDate() + content.letterDurations[dur].days)
        onSave({ body, unlock_date: unlockDate.toISOString(), label: content.letterDurations[dur].label })
        setSent(true)
        setTimeout(onBack, 3500)
    }

    const handleBack = () => {
        if (body.trim() && !confirm('Deinen Brief verwerfen?')) return
        haptic('tap'); onBack()
    }

    const chars = body.length
    const words = body.trim() ? body.trim().split(/\s+/).length : 0

    if (sent) return (
        <div style={{ ...SS.full, background: '#F5F0E8' }}>
            <div style={{ animation: 'fadeIn 800ms ease both' }}>
                <CharacterPlaceholder type="letter" size={120} />
            </div>
            <p style={{ ...SS.cQ, color: '#2C2C2C', fontSize: 19 }}>Dein Brief wartet auf dich.</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: '#9A9085', marginTop: 8 }}>
                In {content.letterDurations[dur].label} wird er sich öffnen.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: '#C4724A', marginTop: 4 }}>
                {previewDate(dur)}
            </p>
        </div>
    )

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F5F0E8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 8px' }}>
                <button style={SS.bk} onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round">
                        <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#2C2C2C', fontWeight: 400 }}>
                    Brief an mein Ich
                </h2>
            </div>

            <div style={{ padding: '8px 28px 0', animation: 'fadeIn 500ms ease both' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    <CharacterPlaceholder type="letter" size={90} />
                </div>
                <p style={{
                    fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
                    fontSize: 15, color: '#9A9085', textAlign: 'center', lineHeight: 1.5, marginBottom: 20,
                }}>
                    Schreib deinem zukünftigen Ich. Wenn du den Brief wieder liest, wirst du sehen,
                    was geblieben ist - und was sich von allein aufgelöst hat.
                </p>
            </div>

            <div style={{ flex: 1, padding: '0 28px', overflowY: 'auto' }}>
                <textarea
                    ref={textareaRef}
                    style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300,
                        lineHeight: 1.8, color: '#2C2C2C', border: 'none',
                        background: 'transparent', width: '100%', minHeight: 160,
                        resize: 'none', caretColor: '#C4724A', overflow: 'hidden',
                    }}
                    placeholder="Liebes zukünftiges Ich..."
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    autoFocus
                />
                {words > 0 && (
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                        letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9085',
                        marginTop: 8, opacity: 0.6, textAlign: 'right',
                    }}>
                        {words} {words === 1 ? 'Wort' : 'Wörter'} · {chars} Zeichen
                    </p>
                )}
            </div>

            <div style={{ padding: '16px 28px 28px' }}>
                <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9A9085', marginBottom: 10,
                }}>
                    Öffnen in
                </p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    {content.letterDurations.map((d, i) => (
                        <button key={i} onClick={() => selectDur(i)} style={{
                            flex: 1, padding: '10px 0', borderRadius: 12,
                            border: dur === i ? '2px solid #C4724A' : '1.5px solid rgba(154,144,133,0.25)',
                            background: dur === i ? 'rgba(196,114,74,0.08)' : 'transparent',
                            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                            color: dur === i ? '#C4724A' : '#9A9085',
                            cursor: 'pointer', transition: 'all 200ms ease',
                        }}>
                            {d.label}
                        </button>
                    ))}
                </div>
                <p style={{
                    fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
                    fontSize: 12, color: dur !== null ? '#C4724A' : 'transparent',
                    textAlign: 'center', marginBottom: 14, minHeight: 18,
                    transition: 'color 300ms ease',
                }}>
                    {dur !== null ? `Öffnet sich am ${previewDate(dur)}` : ' '}
                </p>
                <button
                    style={{ ...SS.cta, width: '100%', opacity: body.trim() && dur !== null ? 1 : 0.35 }}
                    onClick={send}
                    disabled={!body.trim() || dur === null}
                >
                    Versiegeln
                </button>
            </div>
        </div>
    )
}