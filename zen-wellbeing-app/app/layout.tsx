// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { NavBarWrapper } from '@/components/nav-bar-wrapper'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zen Garden',
  description: 'A personal sanctuary for mindfulness and growth',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <NavBarWrapper />
          <div className="flex-1">{children}</div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
