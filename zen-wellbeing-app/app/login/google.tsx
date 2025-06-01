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


export default function GoogleLogin(){
    const supabase = createClientComponentClient();
    
    const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("An error occurred during Google sign in");
    }
  };
  return (
    <Button
                  type="button"
                  className="w-full bg-[#ffffff] hover:bg-[#f5f2e9] text-[#000000]"
                  size="lg"
                  onClick={handleGoogleLogin}
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                )}