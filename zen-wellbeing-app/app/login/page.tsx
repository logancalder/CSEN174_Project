"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        console.log("Signup successful:", data);
        
        // Create initial goals record
        const { error: goalsError } = await supabase
          .from('goals')
          .insert([{
            user_id: data.user.id,
            water: 2500, // 2.5L in mL
            water_unit: 'L',
            steps: 10000,
            sleep: 8
          }]);

        if (goalsError) {
          console.error("Error creating goals:", goalsError);
          toast.error("Error setting up your goals");
          return;
        }

        // Create initial currency record
        const { error: currencyError } = await supabase
          .from('currency')
          .insert([{
            user_id: data.user.id,
            points: 0,
            water: 0,
            sunlight: 0
          }]);

        if (currencyError) {
          console.error("Error creating currency:", currencyError);
          toast.error("Error setting up your currency");
          return;
        }

        toast.success("Sign up successful! Please check your email to verify your account.");
        // Don't redirect immediately after signup - wait for email verification
      } else {
        toast.error("No user data received");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#d1c9b8] bg-[#f5f2e9] focus:border-[#6b8e6b] focus:ring-[#6b8e6b]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
