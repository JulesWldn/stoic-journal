export const SS = {
    root: {
        width: '100%',
        maxWidth: 430,
        margin: '0 auto',
        height: '100dvh',
        background: '#F5F0E8',
        position: 'relative',
        overflow: 'hidden',
    },
    wrap: { width: '100%', height: '100%', position: 'relative' },
    home: {
        height: '100%',
        overflowY: 'scroll',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
    },

    greet: {
        fontFamily: "'DM Serif Display', serif", fontSize: 28,
        color: '#2C2C2C', fontWeight: 400, lineHeight: 1.2,
        animation: 'fadeIn 600ms ease both',
    },
    date: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
        fontWeight: 300, color: '#9A9085', marginTop: 4,
        animation: 'fadeIn 600ms ease 100ms both',
    },

    card: {
        position: 'relative', borderRadius: 20,
        padding: '24px 24px 28px', overflow: 'hidden',
        transition: 'transform 150ms ease',
    },
    cL: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
        fontWeight: 500, letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'rgba(245,240,232,0.5)', marginBottom: 12,
    },
    cH: {
        fontFamily: "'DM Serif Display', serif", fontSize: 22,
        color: '#F5F0E8', lineHeight: 1.3,
        maxWidth: '65%', marginBottom: 6,
    },
    cM: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        fontWeight: 300, color: 'rgba(245,240,232,0.5)', marginTop: 8,
    },

    nav: {
        position: 'fixed', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '12px 20px calc(18px + env(safe-area-inset-bottom))',
        background: '#2C2C2C',
        zIndex: 50,
    },
    nB: {
        background: 'none', border: 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4, cursor: 'pointer', padding: 8,
    },
    nL: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 10,
        fontWeight: 500, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#9A9085',
    },

    bk: {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 8, borderRadius: 12,
        display: 'flex', alignItems: 'center',
    },

    guided: {
        height: '100%', display: 'flex', flexDirection: 'column',
        padding: '20px 24px 32px', position: 'relative',
    },
    gBk: {
        position: 'absolute', top: 50, left: 16,
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 8, zIndex: 10,
    },
    gC: {
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 12px',
    },
    pill: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
        fontWeight: 500, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#D4A853', marginBottom: 16,
    },
    gQu: {
        fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
        fontSize: 20, lineHeight: 1.5, color: '#F5F0E8',
        marginBottom: 28, maxWidth: 320,
    },
    gIn: {
        width: '100%', maxWidth: 340, minHeight: 120,
        background: 'rgba(245,240,232,0.08)',
        border: '1px solid rgba(245,240,232,0.12)',
        borderRadius: 16, padding: '16px 18px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 15,
        fontWeight: 300, lineHeight: 1.7, color: '#F5F0E8',
        resize: 'none', caretColor: '#E8956D',
    },

    progW: { display: 'flex', gap: 6, marginBottom: 20 },
    progBg: {
        flex: 1, height: 3, borderRadius: 2,
        background: 'rgba(245,240,232,0.15)', overflow: 'hidden',
    },
    progF: {
        height: '100%', borderRadius: 2, background: '#C4724A',
        transition: 'width 600ms ease, opacity 400ms ease',
    },

    cta: {
        alignSelf: 'center', background: '#C4724A',
        color: '#F5F0E8', border: 'none', borderRadius: 14,
        padding: '14px 48px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 15,
        fontWeight: 500, letterSpacing: '0.05em',
        cursor: 'pointer', transition: 'opacity 200ms ease', marginTop: 16,
    },

    full: {
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 32,
    },
    cQ: {
        fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
        fontSize: 22, lineHeight: 1.5, color: '#F5F0E8',
        marginTop: 28, maxWidth: 280,
    },
    cA: {
        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
        fontWeight: 300, color: '#E8956D', marginTop: 12,
    },
}