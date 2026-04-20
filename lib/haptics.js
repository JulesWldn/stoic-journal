// Zentrale Haptic-Utility. Funktioniert auf Android und Desktop-Chrome zuverlässig,
// iOS Safari ignoriert navigator.vibrate still - daher kein Fehler.
const PATTERNS = {
    tap: 8,
    soft: 5,
    medium: 15,
    select: 12,
    success: [30, 60, 30],
    error: [60, 50, 60],
    warning: [20, 40, 20],
    complete: [20, 40, 60],
    step: 10,
}

export function haptic(type = 'tap') {
    if (typeof navigator === 'undefined') return
    if (!navigator.vibrate) return
    try {
        const pattern = typeof type === 'string' ? PATTERNS[type] : type
        if (pattern != null) navigator.vibrate(pattern)
    } catch { }
}