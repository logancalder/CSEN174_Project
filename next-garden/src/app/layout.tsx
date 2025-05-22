// app/layout.tsx
import './globals.css' // Or your global styles
import '../styles/style.css'
import type {ReactNode} from 'react'

export const metadata = {
    title: 'Pixel Garden',
    description: 'A farming game',
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    )
}
