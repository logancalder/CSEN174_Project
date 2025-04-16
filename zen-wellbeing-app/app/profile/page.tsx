"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Droplets, BookOpen, Moon, Footprints, Coffee, Settings } from "lucide-react"
import { AppHeader } from "@/components/app-header"

export default function ProfilePage() {
  const [steps, setSteps] = useState(120)
  const [dailyProgress, setDailyProgress] = useState(75)

  const activities = [
    { name: "Water Intake", icon: Droplets, progress: 80 },
    { name: "Exercise", icon: Footprints, progress: 60 },
    { name: "Reading", icon: BookOpen, progress: 90 },
    { name: "Sleep", icon: Moon, progress: 85 },
    { name: "Meditation", icon: Coffee, progress: 70 },
  ]

  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <AppHeader steps={steps} />

      <main className="container mx-auto px-4 py-8 mb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-[#5d6b5d] mb-2">Your Profile</h1>
          <p className="text-[#6c6c6c]">Track your progress and manage your account.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
            <CardHeader>
              <CardTitle className="text-[#5d6b5d]">Account Information</CardTitle>
              <CardDescription className="text-[#8a8a8a]">Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#e5dfd3] flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-[#6b8e6b]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#5d6b5d]">John Doe</h3>
                  <p className="text-sm text-[#6c6c6c]">john.doe@example.com</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-[#d1c9b8] text-[#5d6b5d]">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
            <CardHeader>
              <CardTitle className="text-[#5d6b5d]">Daily Progress</CardTitle>
              <CardDescription className="text-[#8a8a8a]">Your ritual completion for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#5d6b5d]">{dailyProgress}% Complete</span>
                  <span className="text-sm text-[#8a8a8a]">{dailyProgress}/100</span>
                </div>
                <Progress value={dailyProgress} className="h-2 bg-[#e5dfd3]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#f0ebe1] border-[#e5dfd3] mb-8">
          <CardHeader>
            <CardTitle className="text-[#5d6b5d]">Activity Progress</CardTitle>
            <CardDescription className="text-[#8a8a8a]">Track your daily rituals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <activity.icon className="h-4 w-4 text-[#6b8e6b]" />
                      <span className="text-sm font-medium text-[#5d6b5d]">{activity.name}</span>
                    </div>
                    <span className="text-sm text-[#8a8a8a]">{activity.progress}%</span>
                  </div>
                  <Progress value={activity.progress} className="h-2 bg-[#e5dfd3]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
          <CardHeader>
            <CardTitle className="text-[#5d6b5d]">Statistics</CardTitle>
            <CardDescription className="text-[#8a8a8a]">Your journey so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#f5f2e9] p-4 rounded-md border border-[#e5dfd3] text-center">
                <div className="text-2xl font-medium text-[#6b8e6b]">12</div>
                <div className="text-sm text-[#6c6c6c]">Plants Grown</div>
              </div>
              <div className="bg-[#f5f2e9] p-4 rounded-md border border-[#e5dfd3] text-center">
                <div className="text-2xl font-medium text-[#6b8e6b]">45</div>
                <div className="text-sm text-[#6c6c6c]">Days Streak</div>
              </div>
              <div className="bg-[#f5f2e9] p-4 rounded-md border border-[#e5dfd3] text-center">
                <div className="text-2xl font-medium text-[#6b8e6b]">1,200</div>
                <div className="text-sm text-[#6c6c6c]">Steps Earned</div>
              </div>
              <div className="bg-[#f5f2e9] p-4 rounded-md border border-[#e5dfd3] text-center">
                <div className="text-2xl font-medium text-[#6b8e6b]">85%</div>
                <div className="text-sm text-[#6c6c6c]">Avg. Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 