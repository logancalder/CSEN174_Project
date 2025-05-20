"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Droplets, BookOpen, Moon, Footprints, Coffee, Settings, Check } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

// Store water value in database
const storeWaterValue = (value: string, unit: string) => {
  const numValue = parseFloat(value)
  switch (unit.trim()) {
    case 'L':
      return numValue // Store L as is
    case 'oz':
    case 'cups':
      return numValue // Store as is
    default:
      return numValue // default to storing as is
  }
}

// Convert stored value to display value
const getDisplayValue = (value: number, unit: string) => {
  switch (unit.trim()) {
    case 'L':
      return value.toString() // Display L as is
    case 'oz':
    case 'cups':
      return value.toString() // Display as is
    default:
      return value.toString() // default to displaying as is
  }
}

export default function ProfilePage() {
  const [steps, setSteps] = useState(120)
  const [dailyProgress, setDailyProgress] = useState(75)
  const [user, setUser] = useState<any>(null)
  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [tempName, setTempName] = useState("")
  const [goals, setGoals] = useState({
    water: { value: "2.5", unit: " L" },
    exercise: { value: "10000", unit: "steps" },
    sleep: { value: "8", unit: "hours" }
  })
  const [tempGoals, setTempGoals] = useState(goals)
  const [goalId, setGoalId] = useState<number | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setTempName(session.user.user_metadata?.name || '')
        // Fetch user's goals
        const { data: goalsData, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No goals found for user - will create new entry when saving
            console.log('No goals found for user')
          } else {
            console.error('Error fetching goals:', error)
          }
          return
        }

        if (goalsData) {
          setGoalId(goalsData.id)
          const waterUnit = goalsData.water_unit || 'L'
          const waterValue = getDisplayValue(goalsData.water, waterUnit)
          setGoals({
            water: { value: waterValue, unit: ` ${waterUnit}` },
            exercise: { value: String(goalsData.steps), unit: "steps" },
            sleep: { value: String(goalsData.sleep), unit: "hours" }
          })
          setTempGoals({
            water: { value: waterValue, unit: ` ${waterUnit}` },
            exercise: { value: String(goalsData.steps), unit: "steps" },
            sleep: { value: String(goalsData.sleep), unit: "hours" }
          })
        }
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setTempName(session.user.user_metadata?.name || '')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSaveGoals = async () => {
    if (!user) {
      toast.error('User not found. Please log in again.')
      return
    }

    try {
      // Store water value based on unit
      const waterValue = storeWaterValue(tempGoals.water.value, tempGoals.water.unit)

      const goalsData = {
        user_id: user.id,
        water: waterValue,
        water_unit: tempGoals.water.unit.trim(), // Save the unit without space
        steps: parseInt(tempGoals.exercise.value),
        sleep: parseInt(tempGoals.sleep.value)
      }

      console.log('Saving goals:', {
        originalValues: tempGoals,
        convertedValues: goalsData
      })

      let error;

      if (goalId) {
        // Update existing goals
        const { error: updateError, data } = await supabase
          .from('goals')
          .update(goalsData)
          .eq('id', goalId)
          .select()
        error = updateError
        console.log('Update response:', { error: updateError, data })
      } else {
        // Create new goals
        const { error: insertError, data } = await supabase
          .from('goals')
          .insert([goalsData])
          .select()
        error = insertError
        console.log('Insert response:', { error: insertError, data })
      }

      if (error) {
        toast.error(`Failed to save goals: ${error.message}`)
        console.error('Error saving goals:', error)
        return
      }

      setGoals(tempGoals)
      setIsEditingGoals(false)
      toast.success('Goals saved successfully!')

      // Refresh goals data to get the ID if it was a new entry
      if (!goalId) {
        const { data: newGoalsData, error: fetchError } = await supabase
          .from('goals')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (fetchError) {
          console.error('Error fetching new goal ID:', fetchError)
          return
        }

        if (newGoalsData) {
          setGoalId(newGoalsData.id)
        }
      }
    } catch (error: any) {
      toast.error(`An error occurred while saving goals: ${error.message || 'Unknown error'}`)
      console.error('Error:', error)
    }
  }

  const handleCancelEdit = () => {
    setTempGoals(goals)
    setIsEditingGoals(false)
  }

  const handleWaterUnitChange = (unit: string) => {
    setTempGoals({
      ...tempGoals,
      water: { ...tempGoals.water, unit }
    })
  }

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: tempName }
      })
      
      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Profile updated successfully!")
      setIsEditingProfile(false)
      // Refresh user data
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile")
    }
  }

  const handleCancelProfileEdit = () => {
    setTempName(user?.user_metadata?.name || '')
    setIsEditingProfile(false)
  }

  const activities = [
    { name: "Water Intake", icon: Droplets, progress: 80 },
    { name: "Exercise", icon: Footprints, progress: 60 },
    { name: "Sleep", icon: Moon, progress: 85 },
  ]

  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <AppHeader />

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
                <div className="flex-1">
                  {isEditingProfile ? (
                    <div className="space-y-2">
                      <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="border-[#d1c9b8] bg-[#f5f2e9] focus:border-[#6b8e6b] focus:ring-[#6b8e6b]"
                        placeholder="Your name"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-[#5d6b5d]">{user?.user_metadata?.name || 'User'}</h3>
                      <p className="text-sm text-[#6c6c6c]">{user?.email || 'Loading...'}</p>
                    </div>
                  )}
                </div>
              </div>
              {isEditingProfile ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#d1c9b8] text-[#5d6b5d]"
                    onClick={handleCancelProfileEdit}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#d1c9b8] text-[#5d6b5d]"
                    onClick={handleSaveProfile}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full border-[#d1c9b8] text-[#5d6b5d]"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
            <CardHeader>
              <CardTitle className="text-[#5d6b5d]">Goals</CardTitle>
              <CardDescription className="text-[#8a8a8a]">Your daily targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-[#6b8e6b]" />
                    <span className="text-sm font-medium text-[#5d6b5d]">Water Intake</span>
                  </div>
                  {isEditingGoals ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={tempGoals.water.value}
                        onChange={(e) => setTempGoals({...tempGoals, water: {...tempGoals.water, value: e.target.value}})}
                        className="w-16 h-8 text-sm"
                      />
                      <Select value={tempGoals.water.unit} onValueChange={handleWaterUnitChange}>
                        <SelectTrigger className="h-8 w-20 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=" L">L</SelectItem>
                          <SelectItem value=" oz">oz</SelectItem>
                          <SelectItem value=" cups">cups</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <span className="text-sm text-[#8a8a8a]">{goals.water.value}{goals.water.unit}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Footprints className="h-4 w-4 text-[#6b8e6b]" />
                    <span className="text-sm font-medium text-[#5d6b5d]">Exercise</span>
                  </div>
                  {isEditingGoals ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={tempGoals.exercise.value}
                        onChange={(e) => setTempGoals({...tempGoals, exercise: {...tempGoals.exercise, value: e.target.value}})}
                        className="w-20 h-8 text-sm"
                      />
                      <span className="text-sm text-[#8a8a8a]">{tempGoals.exercise.unit}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#8a8a8a]">{parseInt(goals.exercise.value).toLocaleString()} {goals.exercise.unit}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-[#6b8e6b]" />
                    <span className="text-sm font-medium text-[#5d6b5d]">Sleep</span>
                  </div>
                  {isEditingGoals ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={tempGoals.sleep.value}
                        onChange={(e) => setTempGoals({...tempGoals, sleep: {...tempGoals.sleep, value: e.target.value}})}
                        className="w-16 h-8 text-sm"
                      />
                      <span className="text-sm text-[#8a8a8a]">{tempGoals.sleep.unit}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#8a8a8a]">{goals.sleep.value} {goals.sleep.unit}</span>
                  )}
                </div>
              </div>
              {isEditingGoals ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#d1c9b8] text-[#5d6b5d]"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#d1c9b8] text-[#5d6b5d]"
                    onClick={handleSaveGoals}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full border-[#d1c9b8] text-[#5d6b5d]"
                  onClick={() => setIsEditingGoals(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Goals
                </Button>
              )}
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