"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Leaf, AlertCircle } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

type ShopItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "seeds" | "decorations" | "special"
}

export default function ShopPage() {
  const [steps, setSteps] = useState(120)
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const { toast } = useToast()

  const shopItems: ShopItem[] = [
    {
      id: "seed1",
      name: "Peaceful Bamboo",
      description: "A symbol of resilience and flexibility. Thrives with regular water intake.",
      price: 50,
      image: "/placeholder.svg?height=200&width=200",
      category: "seeds",
    },
    {
      id: "seed2",
      name: "Mindful Bonsai",
      description: "A carefully cultivated tree that represents patience and dedication. Grows with regular exercise.",
      price: 75,
      image: "/placeholder.svg?height=200&width=200",
      category: "seeds",
    },
    {
      id: "seed3",
      name: "Tranquil Maple",
      description: "A symbol of wisdom and enlightenment. Flourishes with reading and learning.",
      price: 60,
      image: "/placeholder.svg?height=200&width=200",
      category: "seeds",
    },
    {
      id: "dec1",
      name: "Stone Lantern",
      description: "A traditional Japanese garden lantern that adds serenity to your space.",
      price: 30,
      image: "/placeholder.svg?height=200&width=200",
      category: "decorations",
    },
    {
      id: "dec2",
      name: "Zen Bridge",
      description: "A small wooden bridge that symbolizes the journey of life.",
      price: 45,
      image: "/placeholder.svg?height=200&width=200",
      category: "decorations",
    },
    {
      id: "special1",
      name: "Golden Lotus",
      description: "A rare and beautiful flower that represents enlightenment.",
      price: 100,
      image: "/placeholder.svg?height=200&width=200",
      category: "special",
    },
  ]

  const purchaseItem = (item: ShopItem) => {
    if (steps >= item.price) {
      setSteps((prev) => prev - item.price)
      toast({
        title: "Purchase Successful!",
        description: `You've purchased ${item.name} for ${item.price} points.`,
      })
    } else {
      toast({
        title: "Not enough points",
        description: "Complete more activities to earn points.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-[#5d6b5d] mb-2">Zen Shop</h1>
          <p className="text-[#6c6c6c]">Spend your points on seeds and decorations for your garden.</p>
        </div>

        <Tabs defaultValue="seeds" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-[#e5dfd3]">
            <TabsTrigger
              value="seeds"
              className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]"
            >
              Seeds
            </TabsTrigger>
            <TabsTrigger
              value="decorations"
              className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]"
            >
              Decorations
            </TabsTrigger>
            <TabsTrigger
              value="special"
              className="data-[state=active]:bg-[#f0ebe1] data-[state=active]:text-[#5d6b5d]"
            >
              Special
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seeds" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopItems
                .filter((item) => item.category === "seeds")
                .map((item) => (
                  <Card key={item.id} className="bg-[#f0ebe1] border-[#e5dfd3]">
                    <CardHeader>
                      <CardTitle className="text-[#5d6b5d]">{item.name}</CardTitle>
                      <CardDescription className="text-[#8a8a8a]">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-[200px] w-full mb-4">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-[#6b8e6b]">{item.price} points</span>
                        <Button
                          onClick={() => purchaseItem(item)}
                          className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]"
                        >
                          Purchase
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="decorations" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopItems
                .filter((item) => item.category === "decorations")
                .map((item) => (
                  <Card key={item.id} className="bg-[#f0ebe1] border-[#e5dfd3]">
                    <CardHeader>
                      <CardTitle className="text-[#5d6b5d]">{item.name}</CardTitle>
                      <CardDescription className="text-[#8a8a8a]">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-[200px] w-full mb-4">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-[#6b8e6b]">{item.price} points</span>
                        <Button
                          onClick={() => purchaseItem(item)}
                          className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]"
                        >
                          Purchase
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="special" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopItems
                .filter((item) => item.category === "special")
                .map((item) => (
                  <Card key={item.id} className="bg-[#f0ebe1] border-[#e5dfd3]">
                    <CardHeader>
                      <CardTitle className="text-[#5d6b5d]">{item.name}</CardTitle>
                      <CardDescription className="text-[#8a8a8a]">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-[200px] w-full mb-4">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-[#6b8e6b]">{item.price} points</span>
                        <Button
                          onClick={() => purchaseItem(item)}
                          className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]"
                        >
                          Purchase
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-[#f0ebe1] border-[#e5dfd3]">
          <CardHeader>
            <CardTitle className="text-[#5d6b5d]">How to Earn More Points</CardTitle>
            <CardDescription className="text-[#8a8a8a]">Complete daily activities to earn points</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Leaf className="h-5 w-5 text-[#6b8e6b] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#6c6c6c]">Track your water intake: +10 points per day</span>
              </li>
              <li className="flex items-start gap-2">
                <Leaf className="h-5 w-5 text-[#6b8e6b] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#6c6c6c]">Exercise for at least 30 minutes: +20 points per day</span>
              </li>
              <li className="flex items-start gap-2">
                <Leaf className="h-5 w-5 text-[#6b8e6b] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#6c6c6c]">Get 8 hours of sleep: +15 points per day</span>
              </li>
              <li className="flex items-start gap-2">
                <Leaf className="h-5 w-5 text-[#6b8e6b] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#6c6c6c]">Meditate for 10 minutes: +15 points per day</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#d1c9b8] text-[#5d6b5d] hover:bg-[#e5dfd3] hover:text-[#5d6b5d]"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
