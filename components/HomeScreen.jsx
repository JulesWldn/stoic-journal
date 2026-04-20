'use client'
import { SS } from '@/lib/styles'
import { getGreeting, getDate, getTimeOfDay, getDailyIndex } from '@/lib/utils'
import { haptic } from '@/lib/haptics'
import CharacterPlaceholder from './CharacterPlaceholder'
import content from '@/data/content.json'
import { useState } from 'react'

export default function HomeScreen({ onNavigate, onStartDump, lockedCount, unlockedCount }) {
    const [pr, setPr] = useState(null)
    const tod = getTimeOfDay()
    const quote = content.quotes[getDailyIndex(content.quotes.length)]

    const press = (id) => { haptic('soft'); setPr(id) }

    const card = (id, onUp, delay, bg, children) => (
        <div
            style={{
                ...SS.card, background: bg,
                transform: pr === id ? 'scale(0.97)' : 'scale(1)',
                cursor: 'pointer',
                animation: `fadeIn 500ms ease ${delay}ms both`,
            }}
            onPointerDown={() => press(id)}
            onPointerUp={() => { setPr(null); onUp() }}
            onPointerLeave={() => setPr(null)}
            onPointerCancel={() => setPr(null)}
        >
            {children}
        </div>
    )

    const navClick = (target) => { haptic('tap'); onNavigate(target) }

    return (
        <div style={{
            ...SS.home,
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'contain',
        }}>
            <div style={{ padding: '28px 24px 0' }}>
                <p style={SS.greet}>{getGreeting()}, Julian.</p>
                <p style={SS.date}>{getDate()}</p>
            </div>

            <div style={{
                padding: '20px 20px 120px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
            }}>

                {tod === 'morning' && card('m', () => onNavigate('morning'), 100,
                    'linear-gradient(135deg,#3D321F,#4A3E25,#3D321F)',
                    <>
                        <p style={SS.cL}>Morgenritual</p>
                        <p style={SS.cH}>Beginne den Tag mit Klarheit</p>
                        <p style={SS.cM}>3 Min · 3 Fragen</p>
                        <div style={{ position: 'absolute', bottom: -4, right: 10 }}>
                            <CharacterPlaceholder type="morning" size={82} />
                        </div>
                    </>
                )}

                {tod === 'evening' && card('e', () => onNavigate('evening'), 100,
                    'linear-gradient(135deg,#1A1F2E,#222840,#1A1F2E)',
                    <>
                        <p style={SS.cL}>Abendrückblick</p>
                        <p style={SS.cH}>Was war heute wahr?</p>
                        <p style={SS.cM}>4 Min · 3 Fragen</p>
                        <div style={{ position: 'absolute', bottom: -4, right: 10 }}>
                            <CharacterPlaceholder type="evening" size={82} />
                        </div>
                    </>
                )}

                {/* Tägliche Weisheit */}
                <div
                    style={{
                        ...SS.card,
                        background: 'linear-gradient(135deg,#3D2B1F,#4A3325,#3D2B1F)',
                        transform: pr === 'w' ? 'scale(0.97)' : 'scale(1)',
                        minHeight: 200, cursor: 'pointer',
                        animation: `fadeIn 500ms ease ${tod === 'afternoon' ? '150ms' : '200ms'} both`,
                    }}
                    onPointerDown={() => press('w')}
                    onPointerUp={() => { setPr(null); onNavigate('contemplation') }}
                    onPointerLeave={() => setPr(null)}
                    onPointerCancel={() => setPr(null)}
                >
                    <p style={SS.cL}>Tägliche Weisheit</p>
                    <p style={{
                        fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
                        fontSize: 16, lineHeight: 1.5, color: '#F5F0E8',
                        maxWidth: '70%', marginBottom: 10,
                    }}>
                        &bdquo;{quote.text}&ldquo;
                    </p>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13, fontWeight: 300, color: '#E8956D',
                    }}>
                        - {quote.author}
                    </p>
                    <div style={{
                        position: 'absolute', bottom: -6, right: 8,
                        animation: 'breathe 4s ease-in-out infinite',
                    }}>
                        <CharacterPlaceholder type="reading" size={85} />
                    </div>
                </div>

                {card('d', onStartDump, tod === 'afternoon' ? 250 : 300,
                    'linear-gradient(135deg,#1F3329,#263D30,#1F3329)',
                    <>
                        <p style={SS.cL}>Gedanken ablegen</p>
                        <p style={SS.cH}>{content.dumpPrompts[getDailyIndex(content.dumpPrompts.length)]}</p>
                        <div style={{ position: 'absolute', bottom: -4, right: 12 }}>
                            <CharacterPlaceholder type="inviting" size={75} />
                        </div>
                    </>
                )}

                {card('r', () => onNavigate('reflection'), tod === 'afternoon' ? 350 : 400,
                    'linear-gradient(135deg,#1F2A3D,#253248,#1F2A3D)',
                    <>
                        <p style={SS.cL}>Geführte Reflexion</p>
                        <p style={SS.cH}>Innehalten und hinschauen</p>
                        <p style={SS.cM}>5 Min · 4 Fragen</p>
                        <div style={{ position: 'absolute', bottom: -4, right: 10 }}>
                            <CharacterPlaceholder type="contemplating" size={75} />
                        </div>
                    </>
                )}

                {/* Brief */}
                <div
                    style={{
                        ...SS.card,
                        background: '#FDFAF4',
                        border: '1.5px solid rgba(212,168,83,0.25)',
                        transform: pr === 'l' ? 'scale(0.97)' : 'scale(1)',
                        cursor: 'pointer',
                        animation: 'fadeIn 500ms ease 500ms both',
                    }}
                    onPointerDown={() => press('l')}
                    onPointerUp={() => { setPr(null); onNavigate('letter') }}
                    onPointerLeave={() => setPr(null)}
                    onPointerCancel={() => setPr(null)}
                >
                    <p style={{ ...SS.cL, color: '#9A9085' }}>Brief an mein Ich</p>
                    <p style={{ ...SS.cH, color: '#2C2C2C', fontSize: 19 }}>Worte für die Zukunft</p>
                    {lockedCount > 0 && (
                        <p style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 12, fontWeight: 300, color: '#9A9085', marginTop: 6,
                        }}>
                            {lockedCount} {lockedCount === 1 ? 'Brief wartet' : 'Briefe warten'}
                            {unlockedCount > 0 && ` · ${unlockedCount} bereit`}
                        </p>
                    )}
                    <div style={{ position: 'absolute', bottom: 8, right: 14 }}>
                        <CharacterPlaceholder type="letter" size={68} />
                    </div>
                </div>
            </div>

            {/* Nav */}
            <div style={SS.nav}>
                <button style={SS.nB}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#F5F0E8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span style={{ ...SS.nL, color: '#F5F0E8' }}>Start</span>
                </button>
                <button style={SS.nB} onClick={() => navClick('archive')}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#9A9085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span style={SS.nL}>Notizen</span>
                </button>
                <button style={SS.nB} onClick={() => navClick('profile')}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#9A9085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    <span style={SS.nL}>Profil</span>
                </button>
            </div>
        </div>
    )
}