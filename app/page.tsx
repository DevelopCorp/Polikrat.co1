"use client"

import { useEffect, useState } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileHomeFeed } from "@/components/mobile-home-feed"
import { HomeFeed } from "@/components/home-feed"
import { TopBar } from "@/components/top-bar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function HomePage() {
  const { isInTelegram, setBackButton } = useTelegram()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile or Telegram
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || isInTelegram)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [isInTelegram])

  useEffect(() => {
    if (isInTelegram) {
      // Set up back button for Telegram
      setBackButton(() => {
        // Handle back navigation
        console.log("Back button pressed")
      })
    }
  }, [isInTelegram, setBackButton])

  // Mobile/Telegram layout
  if (isMobile || isInTelegram) {
    return (
      <MobileLayout currentPath="/">
        <MobileHomeFeed />
      </MobileLayout>
    )
  }

  // Desktop layout
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="flex flex-col h-screen">
            <TopBar />
            <div className="flex-1 overflow-hidden">
              <HomeFeed />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
