"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login - in a real app, this would authenticate with a backend
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup - in a real app, this would register with a backend
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#f5f2e9] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-[#6b8e6b]" />
            <span className="text-2xl font-medium text-[#5d6b5d]">Zen</span>
          </Link>
        </div>

        <div className="bg-[#f0ebe1] rounded-md shadow-md p-6 border border-[#e5dfd3]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#e5dfd3]">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#5d6b5d]">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="border-[#d1c9b8] bg-[#f5f2e9] focus:border-[#6b8e6b] focus:ring-[#6b8e6b]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-[#5d6b5d]">
                      Password
                    </label>
                    <Link href="#" className="text-xs text-[#6b8e6b] hover:text-[#5d6b5d]">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="border-[#d1c9b8] bg-[#f5f2e9] focus:border-[#6b8e6b] focus:ring-[#6b8e6b]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#5d6b5d]">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="border-[#d1c9b8] bg-[#f5f2e9] focus:border-[#6b8e6b] focus:ring-[#6b8e6b]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium text-[#5d6b5d]">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="border-[#d1c9b8] bg-[#f5f2e9] focus:border-[#6b8e6b] focus:ring-[#6b8e6b]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium text-[#5d6b5d]">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="border-[#d1c9b8] bg-[#f5f2e9] focus:border-[#6b8e6b] focus:ring-[#6b8e6b]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>

                <p className="text-xs text-center text-[#6c6c6c]">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="text-[#6b8e6b] hover:text-[#5d6b5d]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#6b8e6b] hover:text-[#5d6b5d]">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
