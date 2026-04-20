'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { SS } from '@/lib/styles'
import { formatTimestamp, getDailyIndex } from '@/lib/utils'
import content from '@/data/content.json'

import PinOverlay from '@/components/PinOverlay'
import HomeScreen from '@/components/HomeScreen'
import EditorScreen from '@/components/EditorScreen'
import GuidedFlow from '@/components/GuidedFlow'
import Contemplation from '@/components/Contemplation'
import LetterScreen from '@/components/LetterScreen'
import ArchiveScreen from '@/components/ArchiveScreen'
import ProfileScreen from '@/components/ProfileScreen'

export default function Page() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [screen, setScreen] = useState('home')
    const [fade, setFade] = useState(true)
    const [notes, setNotes] = useState([])
    const [letters, setLetters] = useState([])
    const [currentNote, setCurrentNote] = useState(null)
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(true)
    const saveTimer = useRef(null)

    const dayIdx = getDailyIndex(100)
    const quote = content.quotes[dayIdx % content.quotes.length]
    const morningQs = content.morningQuestionSets[dayIdx % content.morningQuestionSets.length]
    const eveningQs = content.eveningQuestionSets[dayIdx % content.eveningQuestionSets.length]
    const reflectionQs = content.reflectionQuestionSets[dayIdx % content.reflectionQuestionSets.length]
    const morningCompletion = content.morningCompletionQuotes[dayIdx % content.morningCompletionQuotes.length]
    const eveningCompletion = content.eveningCompletionQuotes[dayIdx % content.eveningCompletionQuotes.length]
    const reflectionCompletion = content.reflectionCompletionQuotes[dayIdx % content.reflectionCompletionQuotes.length]

    useEffect(() => {
        if (!isAuthenticated) return
        Promise.all([
            fetch('/api/notes').then(r => r.json()),
            fetch('/api/letters').then(r => r.json()),
        ]).then(([n, l]) => {
            setNotes(Array.isArray(n) ? n : [])
            setLetters(Array.isArray(l) ? l : [])
        }).catch(console.error).finally(() => setLoading(false))
    }, [isAuthenticated])

    useEffect(() => {
        if (screen !== 'editor' || !currentNote) return
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(async () => {
            try {
                if (currentNote.isNew) {
                    const res = await fetch('/api/notes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: currentNote.title,
                            body: currentNote.body,
                            timestamp: currentNote.timestamp,
                            is_guided: false,
                        }),
                    })
                    const created = await res.json()
                    setCurrentNote(prev => ({ ...prev, id: created.id, isNew: false }))
                    setNotes(prev => [created, ...prev])
                } else {
                    await fetch(`/api/notes/${currentNote.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: currentNote.title, body: currentNote.body }),
                    })
                    setNotes(prev => prev.map(n =>
                        n.id === currentNote.id
                            ? { ...n, title: currentNote.title, body: currentNote.body }
                            : n
                    ))
                }
                setSaved(true)
                setTimeout(() => setSaved(false), 1500)
            } catch (err) { console.error(err) }
        }, 2500)
        return () => clearTimeout(saveTimer.current)
    }, [currentNote, screen])

    const navigate = useCallback((to) => {
        setFade(false)
        setTimeout(() => { setScreen(to); setTimeout(() => setFade(true), 30) }, 300)
    }, [])

    const startDump = () => {
        setCurrentNote({ isNew: true, title: '', body: '', timestamp: formatTimestamp() })
        navigate('editor')
    }

    const closeEditor = () => {
        clearTimeout(saveTimer.current)
        setCurrentNote(null)
        navigate('home')
    }

    const openNote = (note) => {
        setCurrentNote({ ...note, isNew: false })
        navigate('editor')
    }

    const saveGuidedNote = async (title, answers, questions) => {
        const body = questions.map((q, i) => `${q.pillar}\n${answers[i]}`).join('\n\n')
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, body, timestamp: formatTimestamp(), is_guided: true }),
            })
            const note = await res.json()
            setNotes(prev => [note, ...prev])
        } catch (err) { console.error(err) }
    }

    const saveLetter = async ({ body, unlock_date, label }) => {
        try {
            const ts = formatTimestamp()
            const res = await fetch('/api/letters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body, unlock_date, label, timestamp: ts }),
            })
            const letter = await res.json()
            setLetters(prev => [letter, ...prev])
        } catch (err) { console.error(err) }
    }

    const saveContemplation = async (answers) => {
        const body = `Weisheit: \u201E${quote.text}\u201C - ${quote.author}\n\n` +
            quote.questions.map((q, i) => `${q}\n${answers[i]}`).join('\n\n')
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Kontemplation', body, timestamp: formatTimestamp(), is_guided: true }),
            })
            const note = await res.json()
            setNotes(prev => [note, ...prev])
        } catch (err) { console.error(err) }
    }

    const lockApp = () => {
        try {
            localStorage.setItem('sj_auth', JSON.stringify({ attempts: 0 }))
        } catch { }
        setIsAuthenticated(false)
        setScreen('home')
    }

    if (!isAuthenticated) {
        return <PinOverlay onUnlocked={() => setIsAuthenticated(true)} />
    }

    const locked = letters.filter(l => new Date(l.unlock_date) > new Date())
    const unlocked = letters.filter(l => new Date(l.unlock_date) <= new Date())

    if (loading) return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #2A1C14 0%, #1A1208 100%)',
            padding: '20px',
            paddingTop: 'max(20px, env(safe-area-inset-top))',
            paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
            zIndex: 100,
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'rgba(212, 168, 83, 0.08)',
                border: '1px solid rgba(212, 168, 83, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'breathe 2.8s ease-in-out infinite',
                marginBottom: 22,
            }}>
                <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: '#D4A853',
                    opacity: 0.8,
                    animation: 'twinkle 2.8s ease-in-out infinite',
                }} />
            </div>
            <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: 'italic',
                fontSize: 15,
                color: 'rgba(245, 240, 232, 0.5)',
                letterSpacing: '0.03em',
            }}>
                Einen Moment...
            </p>
        </div>
    )

    return (
        <div style={SS.root}>
            <div style={{ ...SS.wrap, opacity: fade ? 1 : 0, transition: 'opacity 350ms ease' }}>

                {screen === 'home' && (
                    <HomeScreen
                        onNavigate={navigate}
                        onStartDump={startDump}
                        lockedCount={locked.length}
                        unlockedCount={unlocked.length}
                    />
                )}

                {screen === 'editor' && currentNote && (
                    <EditorScreen
                        note={currentNote}
                        onChange={setCurrentNote}
                        onClose={closeEditor}
                        saved={saved}
                    />
                )}

                {screen === 'contemplation' && (
                    <Contemplation
                        quote={quote}
                        onBack={() => navigate('home')}
                        onSave={saveContemplation}
                    />
                )}

                {screen === 'morning' && (
                    <GuidedFlow
                        questions={morningQs}
                        onComplete={a => saveGuidedNote('Morgenritual', a, morningQs)}
                        onBack={() => navigate('home')}
                        bgGradient="linear-gradient(180deg,#3D321F,#2A2315)"
                        characterType="morning"
                        completionQuote={morningCompletion.quote}
                        completionAuthor={morningCompletion.author}
                    />
                )}

                {screen === 'evening' && (
                    <GuidedFlow
                        questions={eveningQs}
                        onComplete={a => saveGuidedNote('Abendrückblick', a, eveningQs)}
                        onBack={() => navigate('home')}
                        bgGradient="linear-gradient(180deg,#1A1F2E,#141824)"
                        characterType="evening"
                        completionQuote={eveningCompletion.quote}
                        completionAuthor={eveningCompletion.author}
                    />
                )}

                {screen === 'reflection' && (
                    <GuidedFlow
                        questions={reflectionQs}
                        onComplete={a => saveGuidedNote('Reflexion', a, reflectionQs)}
                        onBack={() => navigate('home')}
                        bgGradient="linear-gradient(180deg,#1F2A3D,#182235)"
                        characterType="contemplating"
                        completionQuote={reflectionCompletion.quote}
                        completionAuthor={reflectionCompletion.author}
                    />
                )}

                {screen === 'letter' && (
                    <LetterScreen
                        onBack={() => navigate('home')}
                        onSave={saveLetter}
                    />
                )}

                {screen === 'archive' && (
                    <ArchiveScreen
                        notes={notes}
                        letters={letters}
                        onBack={() => navigate('home')}
                        onOpenNote={openNote}
                    />
                )}

                {screen === 'profile' && (
                    <ProfileScreen
                        notes={notes}
                        letters={letters}
                        onBack={() => navigate('home')}
                        onLock={lockApp}
                    />
                )}

            </div>
        </div>
    )
}