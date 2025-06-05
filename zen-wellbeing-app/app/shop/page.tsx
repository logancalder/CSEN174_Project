"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Leaf, Droplets, Sun } from "lucide-react"
import { toast } from "sonner"
import { Inventory } from "@/app/garden/Inventory"

type CropType = 'wheat' | 'tomato' | 'grapes'

interface Plant {
  id: number
  name: string
  description: string
  min_sunlight: number
  cost: number
}

interface Currency {
  points: number
  water: number
  sunlight: number
}

export default function ShopPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [currency, setCurrency] = useState<Currency>({ points: 0, water: 0, sunlight: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          toast.error("Please log in to access the shop")
          return
        }

        // Fetch available plants
        const { data: plantsData, error: plantsError } = await supabase
          .from('meta_plants')
          .select('*')

        console.log('plantsData', plantsData)

        if (plantsError) {
          console.error('Error fetching plants:', plantsError)
          toast.error("Failed to load plants")
          return
        }

        if (plantsData) {
          setPlants(plantsData)
        }

        // Fetch user's currency
        const { data: currencyData, error: currencyError } = await supabase
          .from('currency')
          .select('points, water, sunlight')
          .eq('user_id', session.user.id)
          .single()

        if (currencyError) {
          console.error('Error fetching currency:', currencyError)
          toast.error("Failed to load currency")
          return
        }

        if (currencyData) {
          setCurrency(currencyData)
        }
      } catch (error) {
        console.error('Error in fetchData:', error)
        toast.error("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handlePurchase = async (plant: Plant) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        toast.error("Please log in to make a purchase")
        return
      }

      // Check if user has enough resources
      if (currency.sunlight < plant.min_sunlight) {
        toast.error(`Not enough sunlight! You need ${plant.min_sunlight} units`)
        return
      }
      if (currency.points < plant.cost) {
        toast.error(`Not enough points! You need ${plant.cost} points`)
        return
      }

      // Update currency
      const { error: currencyError } = await supabase
        .from('currency')
        .update({ 
          sunlight: currency.sunlight - plant.min_sunlight,
          points: currency.points - plant.cost
        })
        .eq('user_id', session.user.id)

      if (currencyError) {
        console.error('Error updating currency:', currencyError)
        toast.error("Failed to update currency")
        return
      }

      // Add seed to inventory using the Inventory class
      const inventory = new Inventory()
      await inventory.loadFromDatabase(supabase, session.user.id)
      await inventory.addSeed(plant.name.toLowerCase() as CropType, 2, supabase, session.user.id)

      // Update local currency state
      setCurrency(prev => ({
        ...prev,
        sunlight: prev.sunlight - plant.min_sunlight,
        points: prev.points - plant.cost
      }))

      toast.success(`Successfully purchased ${plant.name}!`)
    } catch (error) {
      console.error('Error in handlePurchase:', error)
      toast.error("An unexpected error occurred")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2e9]">
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-[#5d6b5d] mb-2">Plant Shop</h1>
          <p className="text-[#6c6c6c]">Grow your garden with new plants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <Card key={plant.id} className="bg-[#f0ebe1] border-[#e5dfd3]">
              <CardHeader>
                <CardTitle className="text-[#5d6b5d]">{plant.name}</CardTitle>
                <CardDescription className="text-[#8a8a8a]">{plant.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-[#e6b800]" />
                    <span className="text-[#6c6c6c]">{plant.min_sunlight} units</span>
                  </div>
                </div>
                <div className="flex items-center justify-center text-sm">
                  <span className="text-[#6c6c6c]">Cost: {plant.cost} points</span>
                </div>
                <Button
                  className="w-full bg-[#6b8e6b] hover:bg-[#5d6b5d] text-white"
                  onClick={() => handlePurchase(plant)}
                  disabled={currency.sunlight < plant.min_sunlight || currency.points < plant.cost}
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
