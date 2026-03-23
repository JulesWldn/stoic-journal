'use client'
import { SS } from '@/lib/styles'
import { useState } from 'react'
import CharacterPlaceholder from './CharacterPlaceholder'

export default function Contemplation({ quote, onBack, onSave }) {
    const [step, setStep] = useState(0)
    const [ans, setAns] = useState(['', '', ''])
    const [vis, setVis] = useState(true)
    const [done, setDone] = useState(false)

    const next = () => {
        if (step < 3) {
            setVis(false)
            setTimeout(() => { setStep(s => s + 1); setTimeout(() => setVis(true), 30) }, 400)
        } else {
            onSave(ans)
            setDone(true)
            setTimeout(onBack, 2800)
        }
    }

    const bg = 'linear-gradient(180deg,#3D2B1F,#2A1C14)'

    if (done) return (
        <div style={{ ...SS.full, background: bg, animation: 'fadeIn 600ms ease both' }}>
            <div style={{ animation: 'nod 1.2s ease forwards' }}>
                <CharacterPlaceholder type="reading" size={110} />
            </div>
            <p style={{ ...SS.cQ, fontSize: 18, maxWidth: 260, marginTop: 24 }}>
                &bdquo;Die Seele wird gefärbt durch die Gedanken.&ldquo;
            </p>
            <p style={SS.cA}>- Marcus Aurelius</p>
        </div>
    )

    return (
        <div style={{ ...SS.guided, background: bg }}>
            {step > 0 && (
                <div style={SS.progW}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={SS.progBg}>
                            <div style={{ ...SS.progF, background: '#E8956D', width: i < step ? '100%' : '0%', opacity: i < step ? 1 : 0.3 }} />
                        </div>
                    ))}
                </div>
            )}

            <button style={SS.gBk} onClick={onBack}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
                </svg>
            </button>

            <div style={{ ...SS.gC, opacity: vis ? 1 : 0, transition: 'opacity 400ms ease' }}>
                {step === 0 ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                            <CharacterPlaceholder type="reading" size={85} />
                        </div>
                        <p style={{ ...SS.gQu, fontSize: 19, marginBottom: 16 }}>
                            &bdquo;{quote.text}&ldquo;
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: '#E8956D', marginBottom: 24 }}>
                            - {quote.author}
                        </p>
                        <div style={{ background: 'rgba(245,240,232,0.06)', borderRadius: 16, padding: '18px 20px', maxWidth: 340 }}>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4A853', marginBottom: 10 }}>
                                Hintergrund
                            </p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, lineHeight: 1.7, color: 'rgba(245,240,232,0.8)' }}>
                                {quote.context}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                            <CharacterPlaceholder type="contemplating" size={80} />
                        </div>
                        <p style={SS.pill}>Frage {step} von 3</p>
                        <p style={SS.gQu}>{quote.questions[step - 1]}</p>
                        <textarea
                            key={step}
                            style={{ ...SS.gIn, background: 'rgba(245,240,232,0.06)', borderColor: 'rgba(245,240,232,0.1)' }}
                            placeholder="Deine Gedanken..."
                            value={ans[step - 1]}
                            onChange={e => { const v = e.target.value; setAns(p => { const n = [...p]; n[step - 1] = v; return n }) }}
                            autoFocus
                        />
                    </>
                )}
            </div>

            <button
                style={{ ...SS.cta, background: '#E8956D', opacity: step === 0 || ans[step - 1]?.trim() ? 1 : 0.4 }}
                onClick={next}
                disabled={step > 0 && !ans[step - 1]?.trim()}
            >
                {step === 0 ? 'Vertiefen' : step < 3 ? 'Weiter' : 'Abschließen'}
            </button>
        </div>
    )
}