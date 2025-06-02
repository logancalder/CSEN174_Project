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

type ActivityType = 'water' | 'exercise' | 'sleep';
type ProgressKey = 'water' | 'steps' | 'sleep';

export default function DashboardPage() {
  const [steps, setSteps] = useState(120)
  const [dailyProgress, setDailyProgress] = useState<{
    water: { current: number; goal: number };
    steps: { current: number; goal: number };
    sleep: { current: number; goal: number };
  }>({
    water: { current: 0, goal: 0 },
    steps: { current: 0, goal: 0 },
    sleep: { current: 0, goal: 0 }
  })
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
    try {
      const { data: currencyData, error: currencyError } = await supabase
        .from('currency')
        .select('points, water, sunlight')
        .eq('user_id', userId)
        .single()
      
      if (currencyError) {
        console.error('Error fetching currency:', currencyError)
        setError('Failed to fetch currency data')
        return
      }
      
      if (currencyData) {
        setCurrency(currencyData)
      }
    } catch (err) {
      console.error('Unexpected error fetching currency:', err)
      setError('An unexpected error occurred')
    }
  }

  // Add scoring function
  const calculateScore = (actual: number, goal: number): number => {
    if (goal === 0) return 0; // Prevent division by zero
    // Return 100 if goal is met or exceeded, otherwise return proportional points
    return actual >= goal ? 100 : Math.round((actual / goal) * 100);
  }

  const logActivity = async (activity: Activity) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        setError('Could not get user session.')
        return
      }

      const userId = session.user.id
      const value = activityInputs[activity.id]
      
      // Validate input
      if (!value || isNaN(Number(value))) {
        setError('Please enter a valid number')
        return
      }

      let updateData: { steps?: number; water?: number; sleep?: number } = { steps: 0, water: 0, sleep: 0 }
      
      // Fetch current input data first
      const { data: existingInput, error: fetchError } = await supabase
        .from('input_data')
        .select('water, steps, sleep')
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        console.error('Error fetching current input:', fetchError)
        setError('Failed to fetch current data')
        return
      }

      // Set values based on activity type, adding to existing values
      if (activity.id === 'exercise') {
        updateData.steps = (existingInput?.steps || 0) + Number(value)
        updateData.water = existingInput?.water || 0
        updateData.sleep = existingInput?.sleep || 0
      }
      if (activity.id === 'water') {
        updateData.water = (existingInput?.water || 0) + Number(value)
        updateData.steps = existingInput?.steps || 0
        updateData.sleep = existingInput?.sleep || 0
      }
      if (activity.id === 'sleep') {
        updateData.sleep = (existingInput?.sleep || 0) + Number(value)
        updateData.steps = existingInput?.steps || 0
        updateData.water = existingInput?.water || 0
      }

      // Update input_data table with combined values
      const { error: updateError, data: updateDataArr } = await supabase
        .from('input_data')
        .update(updateData)
        .eq('user_id', userId)
        .select('id')

      if (updateError) {
        console.error('Supabase update error:', updateError)
        setError('Failed to update data.')
        return
      }

      // If no row was updated in input_data, insert a new one
      if (!updateDataArr || updateDataArr.length === 0) {
        const { error: insertError } = await supabase.from('input_data').insert([{
          user_id: userId,
          steps: updateData.steps ?? 0,
          water: updateData.water ?? 0,
          sleep: updateData.sleep ?? 0
        }])
        if (insertError) {
          console.error('Supabase insert error:', insertError)
          setError('Failed to insert new data')
          return
        }
      }

      // Fetch current goals
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('water, steps, sleep')
        .eq('user_id', userId)
        .single()

      if (goalsError) {
        console.error('Error fetching goals:', goalsError)
        setError('Failed to fetch goals')
        return
      }

      // Calculate percentage of goal completion for water and sleep (capped at 100)
      const waterPercentage = Math.min(((Number(value)) / (goals?.water ?? 1)) * 100, 100)
      const sleepPercentage = Math.min(((Number(value)) / (goals?.sleep ?? 1)) * 100, 100)
      const stepsPercentage = Math.min(((Number(value)) / (goals?.steps ?? 1)) * 100, 100)

      // Calculate today's points for each category (capped at 100)
      const waterPointsToday = activity.id === 'water' ? Math.round(waterPercentage) : 0
      const sleepPointsToday = activity.id === 'sleep' ? Math.round(sleepPercentage) : 0
      const stepsPointsToday = activity.id === 'exercise' ? Math.round(stepsPercentage) : 0
      const totalPointsToday = waterPointsToday + sleepPointsToday + stepsPointsToday

      // Fetch current currency values
      const { data: currentCurrency, error: currencyFetchError } = await supabase
        .from('currency')
        .select('points, water, sunlight')
        .eq('user_id', userId)
        .single()

      if (currencyFetchError && currencyFetchError.code !== 'PGRST116') {
        console.error('Error fetching currency:', currencyFetchError)
        setError('Failed to fetch current currency')
        return
      }

      // Update currency table with new values
      const newCurrencyValues = {
        user_id: userId,
        points: Math.round((currentCurrency?.points ?? 0) + totalPointsToday),
        water: Math.round((currentCurrency?.water ?? 0) + waterPointsToday),
        sunlight: Math.round((currentCurrency?.sunlight ?? 0) + sleepPointsToday)
      }

      const { error: currencyError } = await supabase
        .from('currency')
        .upsert(newCurrencyValues, {
          onConflict: 'user_id'
        })

      if (currencyError) {
        console.error('Error updating currency:', currencyError)
        setError('Failed to update currency')
        return
      }

      // Update daily progress
      const progressKey: ProgressKey = activity.id === 'exercise' ? 'steps' : activity.id as ProgressKey;
      setDailyProgress(prev => ({
        ...prev,
        [progressKey]: {
          current: (prev[progressKey].current || 0) + Number(value),
          goal: goals?.[progressKey] || 0
        }
      }))

      setActivityInputs((prev) => ({ ...prev, [activity.id]: '' }))
      
      // Refresh all data
      await fetchCurrency(userId)
    } catch (err) {
      console.error('Unexpected error in logActivity:', err)
      setError('An unexpected error occurred')
    }
  }

  // Add function to format water display
  const formatWaterDisplay = (value: number, unit: string) => {
    return `${value} ${unit}`
  }

  const getDailyPoints = (current: number, goal: number) => {
    if (!goal) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const waterPointsToday = getDailyPoints(dailyProgress.water.current, dailyProgress.water.goal);
  const stepsPointsToday = getDailyPoints(dailyProgress.steps.current, dailyProgress.steps.goal);
  const sleepPointsToday = getDailyPoints(dailyProgress.sleep.current, dailyProgress.sleep.goal);
  const totalPointsToday = waterPointsToday + stepsPointsToday + sleepPointsToday;

  useEffect(() => {
    const fetchCurrencyAndGoals = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !session?.user) {
          setError("Could not get user session.")
          setLoading(false)
          return
        }
        const userId = session.user.id

        // Fetch currency
        await fetchCurrency(userId)
        
        // Fetch goals and water unit
        const { data: goalsData, error: goalsError } = await supabase
          .from('goals')
          .select('water, steps, sleep, water_unit')
          .eq('user_id', userId)
          .single()

        if (!goalsError && goalsData) {
          setWaterUnit(goalsData.water_unit || 'L')
          
          // Fetch today's input data
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const { data: inputData, error: inputError } = await supabase
            .from('input_data')
            .select('water, steps, sleep')
            .eq('user_id', userId)
            .single()

          console.log('inputData', inputData)

          if (!inputError && inputData) {
            setDailyProgress({
              water: { current: inputData.water || 0, goal: goalsData.water || 0 },
              steps: { current: inputData.steps || 0, goal: goalsData.steps || 0 },
              sleep: { current: inputData.sleep || 0, goal: goalsData.sleep || 0 }
            })
          } else {
            // Set goals even if no input data yet
            setDailyProgress({
              water: { current: 0, goal: goalsData.water || 0 },
              steps: { current: 0, goal: goalsData.steps || 0 },
              sleep: { current: 0, goal: goalsData.sleep || 0 }
            })
          }
        }
      } catch (err) {
        console.error('Error in fetchCurrencyAndGoals:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
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
                <span className="text-3xl font-medium text-[#6b8e6b]">{totalPointsToday ?? 0}</span>
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
                <div className="space-y-2">
                  <div>
                    <span className="text-3xl font-medium text-[#6a8d92]">{waterPointsToday ?? 0}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({dailyProgress.water.current}/{dailyProgress.water.goal} {waterUnit} today)
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((dailyProgress.water.current / dailyProgress.water.goal) * 100, 100)} 
                    className="h-2 bg-[#e5dfd3]" 
                  />
                </div>
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
                <div className="space-y-2">
                  <div>
                    <span className="text-3xl font-medium text-[#e6b800]">{sleepPointsToday ?? 0}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({dailyProgress.sleep.current}/{dailyProgress.sleep.goal} hours today)
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((dailyProgress.sleep.current / dailyProgress.sleep.goal) * 100, 100)} 
                    className="h-2 bg-[#e5dfd3]" 
                  />
                </div>
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
