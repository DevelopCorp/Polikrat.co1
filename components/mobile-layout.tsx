"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Gavel, TrendingUp, Trophy, BookOpen, User, Menu, Bell, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

const navigationItems = [
  { title: "Home", url: "/", icon: Home, badge: "3" },
  { title: "Debates", url: "/debates", icon: Gavel, badge: "12" },
  { title: "Markets", url: "/markets", icon: TrendingUp, badge: "Hot" },
  { title: "Tournaments", url: "/tournaments", icon: Trophy },
  { title: "Education", url: "/education", icon: BookOpen },
]

interface MobileLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export function MobileLayout({ children, currentPath = "/" }: MobileLayoutProps) {
  const { user, theme, isInTelegram, haptic } = useTelegram()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Apply Telegram theme
  useEffect(() => {
    if (isInTelegram && theme.themeParams) {
      const root = document.documentElement
      if (theme.themeParams.bg_color) {
        root.style.setProperty("--background", theme.themeParams.bg_color)
      }
      if (theme.themeParams.text_color) {
        root.style.setProperty("--foreground", theme.themeParams.text_color)
      }
      if (theme.themeParams.button_color) {
        root.style.setProperty("--primary", theme.themeParams.button_color)
      }
    }
  }, [isInTelegram, theme])

  const handleNavigation = (url: string) => {
    haptic.selection()
    window.location.href = url
    setIsMenuOpen(false)
  }

  const handleMenuToggle = () => {
    haptic.light()
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleMenuToggle}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-brand text-white flex items-center justify-center font-bold">
                        🏛️
                      </div>
                      <div>
                        <h2 className="font-bold text-lg">Polikrat.co</h2>
                        <p className="text-xs text-muted-foreground">Smart Political Discussions</p>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  {user && (
                    <div className="p-4 border-b bg-muted/30">
                      <div className="flex items-center gap-3">
                        {user.photo_url ? (
                          <Image
                            src={user.photo_url || "/placeholder.svg"}
                            alt={user.first_name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-brand text-white flex items-center justify-center">
                            {user.first_name[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex-1 p-4">
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <button
                          key={item.title}
                          onClick={() => handleNavigation(item.url)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                            currentPath === item.url ? "bg-primary-brand text-white" : "hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant={item.badge === "Hot" ? "destructive" : "secondary"} className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Menu Footer */}
                  <div className="p-4 border-t">
                    <Button variant="outline" className="w-full" onClick={() => handleNavigation("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      Profile & Settings
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="font-bold text-lg">Polikrat</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-background border-t">
        <div className="flex items-center justify-around p-2">
          {navigationItems.slice(0, 5).map((item) => (
            <button
              key={item.title}
              onClick={() => handleNavigation(item.url)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPath === item.url ? "text-primary-brand" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge
                    variant={item.badge === "Hot" ? "destructive" : "secondary"}
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-xs p-0"
                  >
                    {item.badge === "Hot" ? "🔥" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.title}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
