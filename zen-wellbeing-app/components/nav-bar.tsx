import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Home, User, ShoppingBag, Flower2 } from "lucide-react"

export function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#f0ebe1] border-t border-[#e5dfd3] md:top-0 md:bottom-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 text-[#5d6b5d] hover:text-[#6b8e6b]">
            <Home className="h-5 w-5" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link href="/garden" className="flex items-center gap-2 text-[#5d6b5d] hover:text-[#6b8e6b]">
            <Flower2 className="h-5 w-5" />
            <span className="hidden md:inline">Garden</span>
          </Link>
          <Link href="/shop" className="flex items-center gap-2 text-[#5d6b5d] hover:text-[#6b8e6b]">
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden md:inline">Shop</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-2 text-[#5d6b5d] hover:text-[#6b8e6b]">
            <User className="h-5 w-5" />
            <span className="hidden md:inline">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  )
} 