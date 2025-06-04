"use client"

import { Bell, Search, Plus, Coins, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function TopBar() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger />
        </div>

        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search debates, topics, or users..." className="pl-10" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--premium-gold)/0.1)] text-[hsl(var(--premium-gold))]">
              <Coins className="h-3 w-3" />
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600">
              <Trophy className="h-3 w-3" />
              <span className="font-medium">Level 12</span>
            </div>
          </div>

          <Button size="sm" className="gradient-premium text-white">
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Start Debate</span>
          </Button>

          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          <Button variant="outline" size="sm" className="gradient-premium text-white border-0">
            <Zap className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Upgrade</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
