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
import { Leaf, Menu, Home, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

interface AppHeaderProps {
  steps: number
}

export function AppHeader({ steps }: AppHeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5dfd3] bg-[#f5f2e9]/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[#6b8e6b]" />
            <span className="text-xl font-medium text-[#5d6b5d]">Zen</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
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
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 bg-[#e9efe6] px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-[#5d6b5d]">{steps}</span>
            <span className="text-xs text-[#6c6c6c]">steps</span>
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
              <DropdownMenuSeparator className="bg-[#e5dfd3]" />
              <DropdownMenuItem asChild>
                <Link
                  href="/login"
                  className="flex items-center gap-2 cursor-pointer text-[#5d6b5d] focus:bg-[#e5dfd3] focus:text-[#5d6b5d]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
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
                  href="/login"
                  className="flex items-center gap-2 cursor-pointer text-[#5d6b5d] focus:bg-[#e5dfd3] focus:text-[#5d6b5d]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
