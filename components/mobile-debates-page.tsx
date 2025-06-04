"use client"

import { useState } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { MobileDebateCard } from "@/components/mobile-debate-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MessageSquare, Trophy, RefreshCw } from "lucide-react"

const debates = [
  {
    id: 1,
    title: "Should social media platforms be held liable for misinformation?",
    category: "Technology",
    participants: 2847,
    timeLeft: "1h 23m",
    proVotes: 64,
    conVotes: 36,
    prize: "$250",
    entryFee: "$5",
    isHot: true,
    isPremium: false,
  },
  {
    id: 2,
    title: "Universal Healthcare: Right or Privilege?",
    category: "Healthcare",
    participants: 1923,
    timeLeft: "3h 45m",
    proVotes: 58,
    conVotes: 42,
    prize: "$180",
    entryFee: "$3",
    isHot: false,
    isPremium: true,
  },
  {
    id: 3,
    title: "Cryptocurrency: Future of Finance or Speculative Bubble?",
    category: "Economics",
    participants: 3156,
    timeLeft: "2d 5h",
    proVotes: 72,
    conVotes: 28,
    prize: "$400",
    entryFee: "$10",
    isHot: true,
    isPremium: false,
  },
]

const tournaments = [
  {
    id: 1,
    title: "Climate Policy Championship",
    category: "Environment",
    participants: "14/16",
    prize: "$1,000",
    entryFee: "$25",
    isHot: true,
    isPremium: false,
  },
  {
    id: 2,
    title: "Economic Theory Showdown",
    category: "Economics",
    participants: "8/8",
    prize: "$500",
    entryFee: "$15",
    isHot: false,
    isPremium: true,
  },
]

export function MobileDebatesPage() {
  const { haptic, setMainButton, hideMainButton } = useTelegram()
  const [selectedTab, setSelectedTab] = useState("live")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("trending")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleTabChange = (tab: string) => {
    haptic.selection()
    setSelectedTab(tab)

    if (tab === "live") {
      setMainButton({
        text: "Start New Debate",
        onClick: () => {
          haptic.medium()
          console.log("Creating new debate")
        },
        color: "#3b82f6",
      })
    } else {
      setMainButton({
        text: "Create Tournament",
        onClick: () => {
          haptic.medium()
          console.log("Creating new tournament")
        },
        color: "#f59e0b",
      })
    }
  }

  const handleRefresh = async () => {
    haptic.light()
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    haptic.success()
  }

  return (
    <div className="p-4 space-y-4 pb-16">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search debates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">🔥 Trending</SelectItem>
              <SelectItem value="newest">🆕 Newest</SelectItem>
              <SelectItem value="prize">💰 Highest Prize</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Live Debates
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            Tournaments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-0 mt-4">
          <div className="space-y-0">
            {debates.map((debate) => (
              <MobileDebateCard key={debate.id} debate={debate} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-4 mt-4">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{tournament.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">{tournament.category}</span>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">{tournament.participants} players</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-premium">{tournament.prize}</div>
                    <div className="text-xs text-muted-foreground">Entry: {tournament.entryFee}</div>
                  </div>
                  <Button className="gradient-premium text-white">
                    <Trophy className="h-4 w-4 mr-2" />
                    Enter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
