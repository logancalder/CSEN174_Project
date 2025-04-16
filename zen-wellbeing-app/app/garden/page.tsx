"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplets, Leaf, Info, ShoppingBag, Footprints, BookOpen, Moon, Coffee } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

type Plant = {
  id: string
  name: string
  stage: number
  maxStage: number
  lastWatered: Date
  image: string
  waterType: string
  description: string
}

type ShopItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  waterType: string
}

export default function GardenPage() {
  const [steps, setSteps] = useState(120)
  const { toast } = useToast()
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const [showShop, setShowShop] = useState(false)

  const [plants, setPlants] = useState<Plant[]>([
    {
      id: "plant1",
      name: "Peaceful Bamboo",
      stage: 2,
      maxStage: 4,
      lastWatered: new Date(Date.now() - 86400000), // 1 day ago
      image: "/placeholder.svg?height=200&width=200",
      waterType: "water",
      description: "A symbol of resilience and flexibility. Thrives with regular water intake.",
    },
    {
      id: "plant2",
      name: "Mindful Bonsai",
      stage: 3,
      maxStage: 4,
      lastWatered: new Date(Date.now() - 43200000), // 12 hours ago
      image: "/placeholder.svg?height=200&width=200",
      waterType: "exercise",
      description: "A carefully cultivated tree that represents patience and dedication. Grows with regular exercise.",
    },
    {
      id: "plant3",
      name: "Tranquil Maple",
      stage: 1,
      maxStage: 4,
      lastWatered: new Date(Date.now() - 129600000), // 36 hours ago
      image: "/placeholder.svg?height=200&width=200",
      waterType: "knowledge",
      description: "A symbol of wisdom and enlightenment. Flourishes with reading and learning.",
    },
  ])

  const shopItems: ShopItem[] = [
    {
      id: "seed1",
      name: "Peaceful Bamboo Seeds",
      description: "Grows into bamboo that brings peace to your garden. Requires water to thrive.",
      price: 50,
      image: "/placeholder.svg?height=150&width=150",
      waterType: "water",
    },
    {
      id: "seed2",
      name: "Mindful Bonsai Seeds",
      description: "A tree that represents patience and dedication. Requires exercise to grow.",
      price: 40,
      image: "/placeholder.svg?height=150&width=150",
      waterType: "exercise",
    },
    {
      id: "seed3",
      name: "Tranquil Maple Seeds",
      description: "A symbol of wisdom and enlightenment. Thrives with reading and knowledge.",
      price: 45,
      image: "/placeholder.svg?height=150&width=150",
      waterType: "knowledge",
    },
    {
      id: "seed4",
      name: "Serene Cherry Blossom Seeds",
      description: "Beautiful blossoms that symbolize the transient nature of life. Grows with rest and sleep.",
      price: 60,
      image: "/placeholder.svg?height=150&width=150",
      waterType: "rest",
    },
    {
      id: "seed5",
      name: "Balanced Pine Seeds",
      description: "A symbol of longevity and moderation. Thrives when you practice moderation.",
      price: 55,
      image: "/placeholder.svg?height=150&width=150",
      waterType: "moderation",
    },
  ]

  const waterPlant = (plantId: string) => {
    setPlants(
      plants.map((plant) => {
        if (plant.id === plantId) {
          const newStage = plant.stage < plant.maxStage ? plant.stage + 1 : plant.maxStage
          return {
            ...plant,
            stage: newStage,
            lastWatered: new Date(),
          }
        }
        return plant
      }),
    )
  }

  const needsWater = (lastWatered: Date) => {
    const hours = (Date.now() - lastWatered.getTime()) / (1000 * 60 * 60)
    return hours >= 24
  }

  const getStageText = (stage: number, maxStage: number) => {
    if (stage === maxStage) return "Fully Grown"
    const percentage = Math.round((stage / maxStage) * 100)
    return `${percentage}% Grown`
  }

  const purchasePlant = (item: ShopItem) => {
    if (steps >= item.price) {
      setSteps((prev) => prev - item.price)

      const newPlant: Plant = {
        id: `plant-${Date.now()}`,
        name: item.name.replace(" Seeds", ""),
        stage: 0,
        maxStage: 4,
        lastWatered: new Date(Date.now() - 86400000 * 2), // 2 days ago, needs water
        image: item.image,
        waterType: item.waterType,
        description: item.description,
      }

      setPlants([...plants, newPlant])

      toast({
        title: "Plant Acquired!",
        description: `You've purchased ${item.name} for ${item.price} steps.`,
      })

      setShowShop(false)
    } else {
      toast({
        title: "Not enough steps",
        description: "Complete more daily rituals to earn steps.",
        variant: "destructive",
      })
    }
  }

  const getWaterTypeIcon = (waterType: string) => {
    switch (waterType) {
      case "water":
        return <Droplets className="h-4 w-4 text-[#6a8d92]" />
      case "exercise":
        return <Footprints className="h-4 w-4 text-[#6b8e6b]" />
      case "knowledge":
        return <BookOpen className="h-4 w-4 text-[#a98467]" />
      case "rest":
        return <Moon className="h-4 w-4 text-[#7e6c91]" />
      case "moderation":
        return <Coffee className="h-4 w-4 text-[#916c6c]" />
      default:
        return <Leaf className="h-4 w-4 text-[#6b8e6b]" />
    }
  }

  const getWaterTypeText = (waterType: string) => {
    switch (waterType) {
      case "water":
        return "Water intake"
      case "exercise":
        return "Exercise"
      case "knowledge":
        return "Reading"
      case "rest":
        return "Sleep"
      case "moderation":
        return "Moderation"
      default:
        return "Care"
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <AppHeader steps={steps} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-medium text-[#5d6b5d] mb-2">Your Zen Garden</h1>
            <p className="text-[#6c6c6c]">Nurture your plants as you cultivate your daily rituals.</p>
          </div>
          <Button onClick={() => setShowShop(true)} className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Acquire Plants
          </Button>
        </div>

        <Tabs defaultValue="garden" className="mb-8">
          <TabsList className="bg-[#e5dfd3]">
            <TabsTrigger value="garden" className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]">
              Garden
            </TabsTrigger>
            <TabsTrigger
              value="collection"
              className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]"
            >
              Collection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="garden" className="mt-6">
            <div className="bg-[#e9efe6] rounded-md p-6 mb-8 relative min-h-[400px]">
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#f0ebe1]/80 backdrop-blur-sm border-[#d1c9b8] text-[#5d6b5d]"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Garden Info
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                {plants.map((plant) => (
                  <div key={plant.id} className="relative">
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-[#f0ebe1]/90 backdrop-blur-sm rounded-full px-4 py-1 shadow-sm border border-[#d1c9b8]">
                      <span className="text-sm font-medium text-[#5d6b5d]">{plant.name}</span>
                    </div>
                    <div className="bg-[#f0ebe1]/40 backdrop-blur-sm rounded-md p-4 flex flex-col items-center border border-[#d1c9b8]">
                      <div className="relative h-[200px] w-[200px] mb-4">
                        <Image
                          src={plant.image || "/placeholder.svg"}
                          alt={plant.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#5d6b5d]">{getStageText(plant.stage, plant.maxStage)}</span>
                          <span className="text-[#8a8a8a]">
                            Stage {plant.stage}/{plant.maxStage}
                          </span>
                        </div>
                        <div className="h-2 bg-[#e5dfd3] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#6b8e6b] rounded-full"
                            style={{ width: `${(plant.stage / plant.maxStage) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 w-full">
                        <Button
                          onClick={() => waterPlant(plant.id)}
                          className={`flex-1 ${needsWater(plant.lastWatered) ? "bg-[#6a8d92] hover:bg-[#5a7d82]" : "bg-[#d1c9b8]"} text-[#f5f2e9]`}
                          disabled={!needsWater(plant.lastWatered) || plant.stage === plant.maxStage}
                        >
                          {getWaterTypeIcon(plant.waterType)}
                          <span className="ml-2">
                            {needsWater(plant.lastWatered)
                              ? `Add ${getWaterTypeText(plant.waterType)}`
                              : "Recently Tended"}
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-[#d1c9b8] text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
                          onClick={() => setSelectedPlant(plant)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
              <CardHeader>
                <CardTitle className="text-[#5d6b5d]">Garden Wisdom</CardTitle>
                <CardDescription className="text-[#8a8a8a]">How to nurture your plants</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Leaf className="h-5 w-5 text-[#6b8e6b] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#6c6c6c]">Each plant requires a specific type of care to grow.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Leaf className="h-5 w-5 text-[#6b8e6b] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#6c6c6c]">
                      Tend to your plants every 24 hours by logging your daily rituals.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Leaf className="h-5 w-5 text-[#6b8e6b] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#6c6c6c]">
                      Plants take 4 stages to fully grow when tended regularly.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collection">
            <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
              <CardHeader>
                <CardTitle className="text-[#5d6b5d]">Your Plant Collection</CardTitle>
                <CardDescription className="text-[#8a8a8a]">All the plants you've cultivated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {plants.map((plant) => (
                    <div key={plant.id} className="bg-[#f5f2e9] rounded-md p-4 border border-[#e5dfd3]">
                      <div className="relative h-[100px] w-full mb-2">
                        <Image
                          src={plant.image || "/placeholder.svg"}
                          alt={plant.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-medium text-sm text-[#5d6b5d]">{plant.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {getWaterTypeIcon(plant.waterType)}
                        <p className="text-xs text-[#8a8a8a]">{getWaterTypeText(plant.waterType)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#d1c9b8] text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
                >
                  View All Plants
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Plant Details Dialog */}
      <Dialog open={!!selectedPlant} onOpenChange={(open) => !open && setSelectedPlant(null)}>
        <DialogContent className="bg-[#f0ebe1] border-[#e5dfd3]">
          <DialogHeader>
            <DialogTitle className="text-[#5d6b5d]">{selectedPlant?.name}</DialogTitle>
            <DialogDescription className="text-[#8a8a8a]">{selectedPlant?.description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Image
              src={selectedPlant?.image || "/placeholder.svg"}
              alt={selectedPlant?.name || "Plant"}
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-[#5d6b5d] mb-1">Growth Stage</h4>
              <div className="h-2 bg-[#e5dfd3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6b8e6b] rounded-full"
                  style={{ width: `${selectedPlant ? (selectedPlant.stage / selectedPlant.maxStage) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#5d6b5d]">
                  {selectedPlant ? getStageText(selectedPlant.stage, selectedPlant.maxStage) : ""}
                </span>
                <span className="text-[#8a8a8a]">
                  Stage {selectedPlant?.stage}/{selectedPlant?.maxStage}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#5d6b5d] mb-1">Care Instructions</h4>
              <div className="flex items-center gap-2 p-2 bg-[#f5f2e9] rounded-md border border-[#e5dfd3]">
                {selectedPlant && getWaterTypeIcon(selectedPlant.waterType)}
                <span className="text-sm text-[#6c6c6c]">
                  This plant thrives with daily{" "}
                  {selectedPlant && getWaterTypeText(selectedPlant.waterType).toLowerCase()}.
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedPlant(null)} className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shop Dialog */}
      <Dialog open={showShop} onOpenChange={setShowShop}>
        <DialogContent className="bg-[#f0ebe1] border-[#e5dfd3] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#5d6b5d]">Plant Nursery</DialogTitle>
            <DialogDescription className="text-[#8a8a8a]">Acquire new plants for your garden</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {shopItems.map((item) => (
              <Card key={item.id} className="bg-[#f5f2e9] border-[#e5dfd3] overflow-hidden">
                <div className="relative h-[120px] w-full bg-[#f0ebe1] flex items-center justify-center">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#5d6b5d] text-lg">{item.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    {getWaterTypeIcon(item.waterType)}
                    <CardDescription className="text-[#8a8a8a]">
                      Requires {getWaterTypeText(item.waterType).toLowerCase()}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <div className="font-medium text-[#6b8e6b]">{item.price} steps</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#d1c9b8] text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
                    onClick={() => setSelectedItem(item)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-[#8a8a8a]">
              Your balance: <span className="font-medium text-[#6b8e6b]">{steps} steps</span>
            </div>
            <Button
              onClick={() => setShowShop(false)}
              variant="outline"
              className="border-[#d1c9b8] text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plant Purchase Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="bg-[#f0ebe1] border-[#e5dfd3]">
          <DialogHeader>
            <DialogTitle className="text-[#5d6b5d]">{selectedItem?.name}</DialogTitle>
            <DialogDescription className="text-[#8a8a8a]">{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Image
              src={selectedItem?.image || "/placeholder.svg"}
              alt={selectedItem?.name || "Plant"}
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-[#5d6b5d] mb-1">Care Requirements</h4>
              <div className="flex items-center gap-2 p-2 bg-[#f5f2e9] rounded-md border border-[#e5dfd3]">
                {selectedItem && getWaterTypeIcon(selectedItem.waterType)}
                <span className="text-sm text-[#6c6c6c]">
                  This plant thrives with daily {selectedItem && getWaterTypeText(selectedItem.waterType).toLowerCase()}
                  .
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-medium text-[#6b8e6b]">{selectedItem?.price} steps</div>
            <div className="text-sm text-[#8a8a8a]">Your balance: {steps} steps</div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedItem(null)}
              className="border-[#d1c9b8] text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedItem && purchasePlant(selectedItem)}
              disabled={!selectedItem || steps < selectedItem.price}
              className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]"
            >
              {steps >= (selectedItem?.price || 0) ? (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Acquire Plant
                </>
              ) : (
                <>
                  <Info className="h-4 w-4 mr-2" />
                  Not Enough Steps
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
