"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Droplets, BookOpen, Moon, Footprints, Coffee, Sun } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
  const [currency, setCurrency] = useState<{ points: number; water: number; sunlight: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const [activityInputs, setActivityInputs] = useState<{ [key: string]: string }>({
    water: '',
    exercise: '',
    sleep: '',
  })
  const [waterUnit, setWaterUnit] = useState<string>('')

  const activities: Activity[] = [
    {
      id: "exercise",
      name: "Exercise",
      icon: <Footprints className="h-6 w-6" />,
      color: "bg-[#e9efe6] text-[#6b8e6b] border-[#d1dfd1]",
      steps: 20,
      waterType: "exercise",
    },
    {
      id: "water",
      name: "Water",
      icon: <Droplets className="h-6 w-6" />,
      color: "bg-[#e8f1f2] text-[#6a8d92] border-[#d1dfe1]",
      steps: 10,
      waterType: "water",
    },
    {
      id: "sleep",
      name: "Sleep",
      icon: <Moon className="h-6 w-6" />,
      color: "bg-[#ece9f1] text-[#7e6c91] border-[#d8d1e1]",
      steps: 15,
      waterType: "rest",
    },
  ]

  const handleInputChange = (id: string, value: string) => {
    setActivityInputs((prev) => ({ ...prev, [id]: value }))
  }

  const fetchCurrency = async (userId: string) => {
    const { data: currencyData, error: currencyError } = await supabase
      .from('currency')
      .select('points, water, sunlight')
      .eq('user_id', userId)
      .single()
    if (!currencyError) {
      setCurrency(currencyData)
    }
  }

  const logActivity = async (activity: Activity) => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      alert('Could not get user session.')
      return
    }
    const userId = session.user.id
    const value = activityInputs[activity.id]
    let updateData: { steps?: number; water?: number; sleep?: number } = { steps: 0, water: 0, sleep: 0 }
    if (activity.id === 'exercise') updateData.steps = Number(value)
    if (activity.id === 'water') updateData.water = Number(value)
    if (activity.id === 'sleep') updateData.sleep = Number(value)

    // Try to update
    const { error: updateError, data: updateDataArr } = await supabase
      .from('input_data')
      .update(updateData)
      .eq('user_id', userId)
      .select('id')

    if (updateError) {
      console.error('Supabase update error:', updateError)
      alert('Failed to update data.')
      return
    }

    // If no row was updated, insert a new one
    if (!updateDataArr || updateDataArr.length === 0) {
      const { error: insertError } = await supabase.from('input_data').insert([{
        user_id: userId,
        steps: updateData.steps ?? 0,
        water: updateData.water ?? 0,
        sleep: updateData.sleep ?? 0
      }])
      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return
      }
    }

    setActivityInputs((prev) => ({ ...prev, [activity.id]: '' }))
    await fetchCurrency(userId)
  }

  useEffect(() => {
    const fetchCurrencyAndGoals = async () => {
      setLoading(true)
      setError(null)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        setError("Could not get user session.")
        setLoading(false)
        return
      }
      const userId = session.user.id
      // Fetch currency
      await fetchCurrency(userId)
      // Fetch goals for water unit
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('water_unit')
        .eq('user_id', userId)
        .single()
      if (!goalsError && goalsData?.water_unit) {
        setWaterUnit(goalsData.water_unit)
      }
      setLoading(false)
    }
    fetchCurrencyAndGoals()
  }, [supabase])

  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-[#5d6b5d] mb-2">Welcome back</h1>
          <p className="text-[#6c6c6c]">Track your daily rituals and nurture your garden.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Leaf className="h-6 w-6 text-[#6b8e6b]" />
              <CardTitle className="text-[#5d6b5d]">Plant Points</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <span>Loading...</span>
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <span className="text-3xl font-medium text-[#6b8e6b]">{currency?.points ?? 0}</span>
              )}
            </CardContent>
          </Card>
          <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Droplets className="h-6 w-6 text-[#6a8d92]" />
              <CardTitle className="text-[#5d6b5d]">Water</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <span>Loading...</span>
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <span className="text-3xl font-medium text-[#6a8d92]">{currency?.water ?? 0}</span>
              )}
            </CardContent>
          </Card>
          <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Sun className="h-6 w-6 text-[#e6b800]" />
              <CardTitle className="text-[#5d6b5d]">Sunlight</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <span>Loading...</span>
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <span className="text-3xl font-medium text-[#e6b800]">{currency?.sunlight ?? 0}</span>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium text-[#5d6b5d] mb-4">Daily Rituals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex flex-col items-center justify-center p-4 rounded-md border ${activity.color} transition-all`}
              >
                <div className="mb-2">{activity.icon}</div>
                <span className="text-sm font-medium mb-2">{activity.name}</span>
                <input
                  type="number"
                  className="border rounded px-2 py-1 mb-2 w-full text-center"
                  placeholder={
                    activity.id === 'water'
                      ? `Enter number of ${waterUnit || 'units'} of water`
                      : activity.id === 'exercise'
                        ? 'Enter number of steps'
                        : activity.id === 'sleep'
                          ? 'Enter hours of sleep'
                          : ''
                  }
                  value={activityInputs[activity.id]}
                  onChange={e => handleInputChange(activity.id, e.target.value)}
                />
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => logActivity(activity)}
                  disabled={!activityInputs[activity.id]}
                >
                  Submit
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
