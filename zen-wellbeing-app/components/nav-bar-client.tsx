'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function NavBarClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()

  if (pathname !== '/') return null

  return (
    <>
      <div className="h-16 md:h-20" />
      <nav className="fixed bottom-0 left-0 right-0 bg-[#f0ebe1] border-t border-[#e5dfd3] md:top-0 md:bottom-auto z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-[#5d6b5d]" />
              <span className="text-lg font-semibold text-[#5d6b5d] hidden md:inline">Zen Wellbeing</span>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <Link
                href="/"
                className="flex items-center gap-2 text-[#5d6b5d] hover:text-[#6b8e6b] transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="hidden md:inline">Home</span>
              </Link>
            </div>

            <div className="flex items-center">
              <Button
                asChild
                className="bg-[#5d6b5d] hover:bg-[#6b8e6b] text-white transition-colors"
              >
                <Link href={isLoggedIn ? '/dashboard' : '/login'}>
                  {isLoggedIn ? 'Go to Dashboard' : 'Begin Journey'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
