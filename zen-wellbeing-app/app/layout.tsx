import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/nav-bar'
import { Toaster } from 'sonner'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zen Garden',
  description: 'A personal sanctuary for mindfulness and growth',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <div className="flex-1">
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
