"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Leaf, Menu, Home, User, LogOut, Droplets, Sun, ShoppingBag, ShoppingCartIcon} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from "sonner"
import { useEffect, useState } from "react"

interface Currency {
  points: number
  water: number
  sunlight: number
}

interface CurrencyPayload {
  new: Currency
  old: Currency
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
}

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [currency, setCurrency] = useState<Currency>({ points: 0, water: 0, sunlight: 0 })

  const fetchCurrency = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data, error } = await supabase
          .from('currency')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching currency:', error.message)
          return
        }

        if (data) {
          setCurrency({
            points: data.points,
            water: data.water,
            sunlight: data.sunlight
          })
        }
      }
    } catch (error) {
      console.error('Error in fetchCurrency:', error)
    }
  }

  useEffect(() => {
    fetchCurrency()

    // Subscribe to auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchCurrency()
      }
    })

    // Subscribe to currency changes
    const currencySubscription = supabase
      .channel('currency_changes')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'currency',
        },
        (payload: CurrencyPayload) => {
          if (payload.new) {
            setCurrency({
              points: payload.new.points,
              water: payload.new.water,
              sunlight: payload.new.sunlight
            })
          }
        }
      )
      .subscribe()

    // Set up auto-refresh every 5 seconds
    const refreshInterval = setInterval(fetchCurrency, 5000)

    return () => {
      authSubscription.unsubscribe()
      currencySubscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [supabase])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      toast.error("An error occurred during logout")
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5dfd3] bg-[#f5f2e9]/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Left section - Logo */}
        <div className="w-1/3 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[#6b8e6b]" />
            <span className="text-xl font-medium text-[#5d6b5d]">Zen</span>
          </Link>
        </div>

        {/* Center section - Navigation */}
        <nav className="w-1/3 flex justify-center items-center gap-6">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1 text-sm font-medium ${
              isActive("/dashboard")
                ? "text-[#5d6b5d] border-b-2 border-[#6b8e6b]"
                : "text-[#6c6c6c] hover:text-[#5d6b5d]"
            }`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/garden"
            className={`flex items-center gap-1 text-sm font-medium ${
              isActive("/garden") ? "text-[#5d6b5d] border-b-2 border-[#6b8e6b]" : "text-[#6c6c6c] hover:text-[#5d6b5d]"
            }`}
          >
            <Leaf className="h-4 w-4" />
            Garden
          </Link>
          <Link
            href="/shop"
            className={`flex items-center gap-1 text-sm font-medium ${
              isActive("/shop") ? "text-[#5d6b5d] border-b-2 border-[#6b8e6b]" : "text-[#6c6c6c] hover:text-[#5d6b5d]"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Shop
          </Link>
          <Link
              href="/special-orders"
              className={`flex items-center gap-1 text-sm font-medium ${
                  isActive("/special-orders") ? "text-[#5d6b5d] border-b-2 border-[#6b8e6b]" : "text-[#6c6c6c] hover:text-[#5d6b5d]"
              }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Special Orders
          </Link>
        </nav>

        {/* Right section - Currency and User Menu */}
        <div className="w-1/3 flex justify-end items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#e9efe6] px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-[#5d6b5d]">{currency.points || 0}</span>
              <span className="text-xs text-[#6c6c6c]">points</span>
            </div>
            <div className="flex items-center gap-1 bg-[#e9efe6] px-3 py-1 rounded-full">
              <Droplets className="h-4 w-4 text-[#6b8e6b]" />
              <span className="text-sm font-medium text-[#5d6b5d]">{currency.water || 0}</span>
            </div>
            <div className="flex items-center gap-1 bg-[#e9efe6] px-3 py-1 rounded-full">
              <Sun className="h-4 w-4 text-[#6b8e6b]" />
              <span className="text-sm font-medium text-[#5d6b5d]">{currency.sunlight || 0}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#f0ebe1] border-[#e5dfd3]">
              <DropdownMenuLabel className="text-[#5d6b5d]">Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#e5dfd3]" />
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 cursor-pointer text-[#5d6b5d] focus:bg-[#e5dfd3] focus:text-[#5d6b5d]"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/garden"
                  className="flex items-center gap-2 cursor-pointer text-[#5d6b5d] focus:bg-[#e5dfd3] focus:text-[#5d6b5d]"
                >
                  <Leaf className="h-4 w-4" />
                  Garden
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/shop"
                  className="flex items-center gap-2 cursor-pointer text-[#5d6b5d] focus:bg-[#e5dfd3] focus:text-[#5d6b5d]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#e5dfd3]" />
              <DropdownMenuItem
                onSelect={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-[#5d6b5d] focus:bg-[#e5dfd3] focus:text-[#5d6b5d]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hidden md:flex text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#f0ebe1] border-[#e5dfd3]">
              <DropdownMenuLabel className="text-[#5d6b5d]">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#e5dfd3]" />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 cursor-pointer text-[#5d6b5d] focus:bg-[#e5dfd3] focus:text-[#5d6b5d]"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-[#5d6b5d] focus:bg-[#e5dfd3] focus:text-[#5d6b5d]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
