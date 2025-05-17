"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Home } from "lucide-react"
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export function NavBar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Only render on landing page
  if (pathname !== '/') {
    return null
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      <div className="h-16 md:h-20" /> {/* Spacer for fixed positioning */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#f0ebe1] border-t border-[#e5dfd3] md:top-0 md:bottom-auto z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Left side - Logo */}
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-[#5d6b5d]" />
              <span className="text-lg font-semibold text-[#5d6b5d] hidden md:inline">Zen Wellbeing</span>
            </div>

            {/* Center - Home Button */}
            <div className="flex-1 flex justify-center items-center">
              <Link 
                href="/" 
                className={`flex items-center gap-2 text-[#5d6b5d] hover:text-[#6b8e6b] transition-colors ${
                  isActive('/') ? 'text-[#6b8e6b] font-medium' : ''
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="hidden md:inline">Home</span>
              </Link>
            </div>

            {/* Right side - Begin Journey Button */}
            <div className="flex items-center">
              <Button
                asChild
                className="bg-[#5d6b5d] hover:bg-[#6b8e6b] text-white transition-colors"
              >
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  {isLoggedIn ? "Go to Dashboard" : "Begin Journey"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
} 