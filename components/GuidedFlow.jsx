'use client'
import { SS } from '@/lib/styles'
import { useState } from 'react'
import { haptic } from '@/lib/haptics'
import CharacterPlaceholder from './CharacterPlaceholder'

export default function GuidedFlow({
    questions, onComplete, onBack,
    bgGradient, characterType,
    completionQuote, completionAuthor,
}) {
    const [step, setStep] = useState(0)
    const [ans, setAns] = useState(questions.map(() => ''))
    const [vis, setVis] = useState(true)
    const [done, setDone] = useState(false)

    const goTo = (newStep, direction = 'forward') => {
        setVis(false)
        setTimeout(() => {
            setStep(newStep)
            setTimeout(() => setVis(true), 30)
        }, direction === 'forward' ? 400 : 280)
    }

    const next = () => {
        if (step < questions.length - 1) {
            haptic('step')
            goTo(step + 1, 'forward')
        } else {
            haptic('complete')
            onComplete(ans)
            setDone(true)
            setTimeout(onBack, 3200)
        }
    }

    const back = () => {
        if (step > 0) {
            haptic('soft')
            goTo(step - 1, 'backward')
        } else {
            const hasContent = ans.some(a => a.trim())
            if (hasContent && !confirm('Deine Eingaben gehen verloren. Möchtest du wirklich zurück?')) return
            haptic('tap')
            onBack()
        }
    }

    if (done) return (
        <div style={{ ...SS.full, background: bgGradient, animation: 'fadeIn 600ms ease both' }}>
            <div style={{ animation: 'nod 1.2s ease forwards' }}>
                <CharacterPlaceholder type={characterType} size={120} />
            </div>
            <p style={SS.cQ}>&bdquo;{completionQuote}&ldquo;</p>
            <p style={SS.cA}>- {completionAuthor}</p>
        </div>
    )

    return (
        <div style={{ ...SS.guided, background: bgGradient }}>
            <div style={SS.progW}>
                {questions.map((_, i) => (
                    <div key={i} style={SS.progBg}>
                        <div style={{
                            ...SS.progF,
                            width: i <= step ? '100%' : '0%',
                            opacity: i <= step ? 1 : 0.3,
                            transition: 'width 400ms ease, opacity 400ms ease',
                        }} />
                    </div>
                ))}
            </div>
            <button style={SS.gBk} onClick={back}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
                </svg>
            </button>
            <div style={{ ...SS.gC, opacity: vis ? 1 : 0, transition: 'opacity 400ms ease' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <CharacterPlaceholder type={characterType} size={90} />
                </div>
                <p style={SS.pill}>{questions[step].pillar}</p>
                <p style={SS.gQu}>{questions[step].question}</p>
                <textarea
                    key={step}
                    style={SS.gIn}
                    placeholder="Deine Gedanken..."
                    value={ans[step]}
                    onChange={e => { const v = e.target.value; setAns(p => { const n = [...p]; n[step] = v; return n }) }}
                    autoFocus
                />
            </div>
            <button
                style={{ ...SS.cta, opacity: ans[step].trim() ? 1 : 0.4 }}
                onClick={next}
                disabled={!ans[step].trim()}
            >
                {step < questions.length - 1 ? 'Weiter' : 'Abschließen'}
            </button>
        </div>
    )
}