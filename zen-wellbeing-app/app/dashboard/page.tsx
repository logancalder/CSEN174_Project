"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Droplets, BookOpen, Moon, Footprints, Coffee } from "lucide-react"
import { AppHeader } from "@/components/app-header"

type Activity = {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  steps: number
  waterType: string
}

export default function DashboardPage() {
  const [steps, setSteps] = useState(120)
  const [dailyProgress, setDailyProgress] = useState(35)

  const activities: Activity[] = [
    {
      id: "water",
      name: "Water",
      icon: <Droplets className="h-6 w-6" />,
      color: "bg-[#e8f1f2] text-[#6a8d92] border-[#d1dfe1]",
      steps: 10,
      waterType: "water",
    },
    {
      id: "exercise",
      name: "Exercise",
      icon: <Footprints className="h-6 w-6" />,
      color: "bg-[#e9efe6] text-[#6b8e6b] border-[#d1dfd1]",
      steps: 20,
      waterType: "exercise",
    },
    {
      id: "sleep",
      name: "Sleep",
      icon: <Moon className="h-6 w-6" />,
      color: "bg-[#ece9f1] text-[#7e6c91] border-[#d8d1e1]",
      steps: 15,
      waterType: "rest",
    },
    {
      id: "reading",
      name: "Reading",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-[#f1ece6] text-[#a98467] border-[#e1d8d1]",
      steps: 15,
      waterType: "knowledge",
    },
    {
      id: "caffeine",
      name: "Less Caffeine",
      icon: <Coffee className="h-6 w-6" />,
      color: "bg-[#f1e6e6] text-[#916c6c] border-[#e1d1d1]",
      steps: 10,
      waterType: "moderation",
    },
  ]

  const logActivity = (activity: Activity) => {
    setSteps((prev) => prev + activity.steps)
    setDailyProgress((prev) => Math.min(prev + 10, 100))
  }

  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <AppHeader steps={steps} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-[#5d6b5d] mb-2">Welcome back</h1>
          <p className="text-[#6c6c6c]">Track your daily rituals and nurture your garden.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#5d6b5d]">Daily Progress</CardTitle>
              <CardDescription className="text-[#8a8a8a]">Your ritual completion for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#5d6b5d]">{dailyProgress}% Complete</span>
                  <span className="text-sm text-[#8a8a8a]">{dailyProgress}/100</span>
                </div>
                <Progress value={dailyProgress} className="h-2 bg-[#e5dfd3]" indicatorClassName="bg-[#6b8e6b]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#5d6b5d]">Steps Balance</CardTitle>
              <CardDescription className="text-[#8a8a8a]">Use these to acquire plants</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-medium text-[#6b8e6b]">{steps}</div>
              <Link href="/garden">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1 items-center border-[#d1c9b8] text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
                >
                  <Leaf className="h-4 w-4" />
                  Garden
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activities" className="mb-8">
          <TabsList className="bg-[#e5dfd3]">
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]"
            >
              Daily Rituals
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]">
              Journal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => logActivity(activity)}
                  className={`flex flex-col items-center justify-center p-4 rounded-md border ${activity.color} transition-all hover:scale-105`}
                >
                  <div className="mb-2">{activity.icon}</div>
                  <span className="text-sm font-medium">{activity.name}</span>
                  <span className="text-xs mt-1">+{activity.steps} steps</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
              <CardHeader>
                <CardTitle className="text-[#5d6b5d]">Your Journey</CardTitle>
                <CardDescription className="text-[#8a8a8a]">Reflections on your daily rituals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-[#8a8a8a]">
                  Your journal entries will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
          <CardHeader>
            <CardTitle className="text-[#5d6b5d]">Recent Activities</CardTitle>
            <CardDescription className="text-[#8a8a8a]">Your logged rituals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-[#e8f1f2] rounded-md border border-[#d1dfe1]">
                <Droplets className="h-5 w-5 text-[#6a8d92]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#5d6b5d]">Water</p>
                  <p className="text-xs text-[#8a8a8a]">Today, 10:30 AM</p>
                </div>
                <div className="text-sm font-medium text-[#6b8e6b]">+10 steps</div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-[#e9efe6] rounded-md border border-[#d1dfd1]">
                <Footprints className="h-5 w-5 text-[#6b8e6b]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#5d6b5d]">Exercise</p>
                  <p className="text-xs text-[#8a8a8a]">Today, 8:15 AM</p>
                </div>
                <div className="text-sm font-medium text-[#6b8e6b]">+20 steps</div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-[#ece9f1] rounded-md border border-[#d8d1e1]">
                <Moon className="h-5 w-5 text-[#7e6c91]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#5d6b5d]">Sleep</p>
                  <p className="text-xs text-[#8a8a8a]">Yesterday, 11:00 PM</p>
                </div>
                <div className="text-sm font-medium text-[#6b8e6b]">+15 steps</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]">
              View All Activities
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
