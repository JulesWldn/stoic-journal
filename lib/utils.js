export const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Guten Morgen'
    if (h < 18) return 'Guten Tag'
    return 'Guten Abend'
}

export const getTimeOfDay = () => {
    const h = new Date().getHours()
    if (h < 12) return 'morning'
    if (h < 19) return 'afternoon'
    return 'evening'
}

export const getDate = () => {
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August',
        'September', 'Oktober', 'November', 'Dezember']
    const d = new Date()
    return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]}`
}

export const formatTimestamp = () => {
    const d = new Date()
    const m = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov ', 'Dez']
    return `${d.getDate()}. ${m[d.getMonth()]} ${d.getFullYear()} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export const fmtSec = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

// Tages-basierter Index - wechselt täglich, nicht wöchentlich
export const getDayOfYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    return Math.floor((now - start) / 86400000)
}

export const getDailyIndex = (length) => getDayOfYear() % length