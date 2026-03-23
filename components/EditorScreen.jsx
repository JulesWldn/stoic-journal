'use client'
import { SS } from '@/lib/styles'
import { fmtSec } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import content from '@/data/content.json'

export default function EditorScreen({ note, onChange, onClose, saved }) {
    const [isRec, setIsRec] = useState(false)
    const [recT, setRecT] = useState(0)
    const recRef = useRef(null)
    const recInt = useRef(null)
    const bPh = content.bodyPlaceholders[Math.floor(Math.random() * content.bodyPlaceholders.length)]

    const stopRec = () => {
        if (recRef.current) { try { recRef.current.stop() } catch (_) { } recRef.current = null }
        setIsRec(false)
        if (recInt.current) clearInterval(recInt.current)
        setRecT(0)
    }

    const startRec = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SR) { alert('Spracherkennung wird von deinem Browser nicht unterstützt.'); return }
        const r = new SR()
        r.lang = 'de-DE'; r.continuous = true; r.interimResults = true
        r.onresult = (e) => {
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) {
                    const t = e.results[i][0].transcript
                    onChange(p => ({ ...p, body: (p.body ? p.body + ' ' : '') + t }))
                }
            }
        }
        r.onerror = () => stopRec()
        r.onend = () => { if (recRef.current) { try { r.start() } catch (_) { stopRec() } } }
        recRef.current = r; r.start(); setIsRec(true); setRecT(0)
        recInt.current = setInterval(() => setRecT(t => t + 1), 1000)
    }

    useEffect(() => () => stopRec(), [])

    const handleClose = () => { stopRec(); onClose() }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F5F0E8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 8px' }}>
                <button style={SS.bk} onClick={handleClose}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round">
                        <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>
                <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: '#9A9085',
                    opacity: saved ? 1 : 0,
                    animation: saved ? 'savedFade 1.5s ease forwards' : 'none',
                }}>
                    Gespeichert
                </span>
            </div>

            <div style={{ flex: 1, padding: '8px 28px', overflowY: 'auto' }}>
                <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9A9085', marginBottom: 20,
                }}>
                    {note.timestamp}
                </p>
                <input
                    style={{
                        fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 24,
                        color: '#2C2C2C', border: 'none', background: 'transparent',
                        width: '100%', marginBottom: 20, lineHeight: 1.3,
                    }}
                    placeholder="Unbenannter Gedanke..."
                    value={note.title || ''}
                    onChange={e => onChange(p => ({ ...p, title: e.target.value }))}
                />
                <textarea
                    style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300,
                        lineHeight: 1.8, color: '#2C2C2C', border: 'none',
                        background: 'transparent', width: '100%', minHeight: 280,
                        resize: 'none', caretColor: '#C4724A',
                    }}
                    placeholder={bPh}
                    value={note.body || ''}
                    onChange={e => onChange(p => ({ ...p, body: e.target.value }))}
                    autoFocus
                />
            </div>

            <div style={{ padding: '14px 28px 28px', borderTop: '1px solid rgba(154,144,133,0.15)' }}>
                {isRec ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={stopRec} style={{
                            width: 38, height: 38, borderRadius: '50%',
                            border: '2px solid #C4724A', background: 'rgba(196,114,74,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', position: 'relative', flexShrink: 0,
                        }}>
                            <div style={{
                                position: 'absolute', width: 38, height: 38, borderRadius: '50%',
                                border: '2px solid #C4724A', animation: 'recRing 1.5s ease-out infinite',
                                top: -2, left: -2,
                            }} />
                            <div style={{ width: 14, height: 14, borderRadius: 3, background: '#C4724A' }} />
                        </button>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: '#C4724A' }}>
                            {fmtSec(recT)}
                        </span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: '#9A9085', marginLeft: 'auto' }}>
                            Sprich frei...
                        </span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <button onClick={startRec} style={{
                            width: 38, height: 38, borderRadius: '50%',
                            border: '1.5px solid rgba(154,144,133,0.3)',
                            background: 'rgba(245,240,232,0.6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0,
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="#9A9085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                        </button>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: '#9A9085' }}>
                            Tippen oder sprechen
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}