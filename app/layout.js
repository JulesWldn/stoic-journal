import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    variable: '--font-dm-sans',
    display: 'swap',
})

const dmSerif = DM_Serif_Display({
    subsets: ['latin'],
    weight: ['400'],
    style: ['normal', 'italic'],
    variable: '--font-dm-serif',
    display: 'swap',
})

export const metadata = {
    title: 'Stoic Journal',
    description: 'Tägliche stoische Reflexion',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Stoic Journal',
    },
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#3D2B1F',
}

export default function RootLayout({ children }) {
    return (
        <html lang="de">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Stoic Journal" />
                <meta name="theme-color" content="#3D2B1F" />
                <link rel="icon" href="/icon.png" />
                <link rel="apple-touch-icon" href="/icon.png" />
            </head>
            <body className={`${dmSans.variable} ${dmSerif.variable}`}>
                {children}
            </body>
        </html>
    )
}