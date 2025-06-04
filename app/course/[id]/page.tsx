"use client"

import { useEffect, useState } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { MobileLayout } from "@/components/mobile-layout"
import { CoursePlayer } from "@/components/course-player"
import { TopBar } from "@/components/top-bar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
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
        window.history.back()
      })
    }
  }, [isInTelegram, setBackButton])

  const handleCourseComplete = () => {
    console.log("Course completed!")
    // Handle course completion logic
  }

  const handleProgress = (lessonId: string, progress: number) => {
    console.log(`Lesson ${lessonId} progress: ${progress}%`)
    // Save progress to backend
  }

  // Mobile/Telegram layout
  if (isMobile || isInTelegram) {
    return (
      <MobileLayout currentPath={`/course/${params.id}`}>
        <div className="pb-16">
          <CoursePlayer courseId={params.id} onComplete={handleCourseComplete} onProgress={handleProgress} />
        </div>
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
            <div className="flex-1 overflow-auto">
              <CoursePlayer courseId={params.id} onComplete={handleCourseComplete} onProgress={handleProgress} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
