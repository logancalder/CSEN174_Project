import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      {/* <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-[#6b8e6b]" />
          <span className="text-2xl font-medium text-[#5d6b5d]">Zen</span>
        </div>
        <nav>
          <Link href="/login">
            <Button className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]">Begin Journey</Button>
          </Link>
        </nav>
      </header> */}

      <main className="container mx-auto px-4 py-12">
        <section className="flex flex-col md:flex-row items-center gap-12 py-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-medium text-[#5d6b5d]">
              Find harmony in <span className="text-[#a98467]">simplicity</span>
            </h1>
            <p className="text-lg text-[#6c6c6c]">
              Nurture your daily habits and watch your garden grow. A personal sanctuary for mindfulness and growth.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9] px-8 py-6 rounded-md text-lg">
                  Begin Your Journey
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative h-[400px] w-full">
            <Image
              src="/placeholder.svg"
              alt="Zen Garden Illustration"
              width={400}
              height={400}
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-medium text-center text-[#5d6b5d] mb-12">The Path to Mindfulness</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f0ebe1] p-6 rounded-md border border-[#e5dfd3] flex flex-col items-center text-center">
              <div className="bg-[#e5dfd3] p-4 rounded-full mb-4">
                <svg
                  className="h-8 w-8 text-[#6b8e6b]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7V12L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#5d6b5d] mb-2">Track Daily Rituals</h3>
              <p className="text-[#6c6c6c]">
                Record your water intake, exercise, reading, and other mindful activities to earn steps.
              </p>
            </div>

            <div className="bg-[#f0ebe1] p-6 rounded-md border border-[#e5dfd3] flex flex-col items-center text-center">
              <div className="bg-[#e5dfd3] p-4 rounded-full mb-4">
                <svg
                  className="h-8 w-8 text-[#6b8e6b]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22V12H15V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#5d6b5d] mb-2">Acquire New Plants</h3>
              <p className="text-[#6c6c6c]">
                Use your earned steps to purchase plants for your personal garden sanctuary.
              </p>
            </div>

            <div className="bg-[#f0ebe1] p-6 rounded-md border border-[#e5dfd3] flex flex-col items-center text-center">
              <div className="bg-[#e5dfd3] p-4 rounded-full mb-4">
                <svg
                  className="h-8 w-8 text-[#6b8e6b]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 9H9.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 9H15.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#5d6b5d] mb-2">Nurture Your Garden</h3>
              <p className="text-[#6c6c6c]">
                Water your plants with your logged activities and watch them flourish as you grow.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#e5dfd3] rounded-md p-8 my-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-medium text-[#5d6b5d] mb-4">Your Personal Sanctuary</h2>
              <p className="text-[#6c6c6c] mb-6">
                As you nurture your daily habits, your garden will reflect your journey. Each plant represents a part of
                your well-being, growing alongside you in perfect harmony.
              </p>
              <Link href="/login">
                <Button className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9]">Begin Your Garden</Button>
              </Link>
            </div>
            <div className="flex-1 relative h-[300px] w-full">
              <Image
                src="/placeholder.svg"
                alt="Zen Garden Illustration"
                width={500}
                height={300}
                className="object-contain w-full h-full rounded-md"
                priority
              />
            </div>
          </div>
        </section>

        <section className="py-12 text-center">
          <h2 className="text-3xl font-medium text-[#5d6b5d] mb-6">Embrace the journey</h2>
          <p className="text-lg text-[#6c6c6c] max-w-2xl mx-auto mb-8">
            A personal sanctuary for mindfulness and growth, with no comparisons or distractions. Just you and your
            garden.
          </p>
          <Link href="/login">
            <Button className="bg-[#6b8e6b] hover:bg-[#5d6b5d] text-[#f5f2e9] px-8 py-6 rounded-md text-lg">
              Begin Today
            </Button>
          </Link>
        </section>
      </main>

      <footer className="bg-[#e5dfd3] py-8">
        <div className="container mx-auto px-4 text-center text-[#5d6b5d]">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-[#6b8e6b]" />
            <span className="text-xl font-medium">Zen</span>
          </div>
          <p>© {new Date().getFullYear()} Zen Garden. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
