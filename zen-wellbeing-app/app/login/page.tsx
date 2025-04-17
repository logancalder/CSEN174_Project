"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LucideIcon, LogIn } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - in a real app, this would authenticate with a backend
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup - in a real app, this would register with a backend
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

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
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#5d6b5d]"
                  >
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
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-[#5d6b5d]"
                    >
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-xs text-[#6b8e6b] hover:text-[#5d6b5d]"
                    >
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
                <Button
                  className="w-full bg-[#ffffff] hover:bg-[#f5f2e9] text-[#000000]"
                  size="lg"
                  onClick={() => signIn("google")}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 488 512"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path
                      d="M488 261.8c0-17.8-1.6-35-4.6-51.6H249v97.8h135.6c-5.9 31-23.3 57.2-49.6 75v62.3h80.3c47-43.3 74.7-107.1 74.7-183.5z"
                      fill="#4285F4"
                    />
                    <path
                      d="M249 492c66.6 0 122.5-22.1 163.3-59.9l-80.3-62.3c-22.4 15.1-51 24.1-83 24.1-63.9 0-118-43.2-137.4-101.3H29.5v63.5C69.3 435.4 152.6 492 249 492z"
                      fill="#34A853"
                    />
                    <path
                      d="M111.6 292.6C106.2 276.4 103.2 259 103.2 240s3-36.4 8.4-52.6V123.9H29.5C10.6 160.5 0 199.1 0 240s10.6 79.5 29.5 116.1l82.1-63.5z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M249 97.9c36.3 0 69 12.5 94.7 37l70.7-70.7C369.9 24.8 316 0 249 0 152.6 0 69.3 56.6 29.5 123.9l82.1 63.5C131 141.1 185.1 97.9 249 97.9z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-[#5d6b5d]"
                  >
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
                  <label
                    htmlFor="signup-email"
                    className="text-sm font-medium text-[#5d6b5d]"
                  >
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
                  <label
                    htmlFor="signup-password"
                    className="text-sm font-medium text-[#5d6b5d]"
                  >
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
                  <Link
                    href="#"
                    className="text-[#6b8e6b] hover:text-[#5d6b5d]"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-[#6b8e6b] hover:text-[#5d6b5d]"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
