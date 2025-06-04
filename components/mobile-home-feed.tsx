"use client"

import { useState, useEffect } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { MobileDebateCard } from "@/components/mobile-debate-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Zap, Crown, TrendingUp, MessageSquare, Eye } from "lucide-react"

const trendingDebates = [
  {
    id: 1,
    title: "Should AI be regulated by government agencies?",
    category: "Technology",
    participants: 1247,
    timeLeft: "2h 15m",
    proVotes: 68,
    conVotes: 32,
    prize: "$150",
    entryFee: "$5",
    isHot: true,
    isPremium: false,
  },
  {
    id: 2,
    title: "Universal Basic Income: Economic necessity or fiscal disaster?",
    category: "Economics",
    participants: 892,
    timeLeft: "5h 42m",
    proVotes: 45,
    conVotes: 55,
    prize: "$75",
    entryFee: "$3",
    isHot: false,
    isPremium: true,
  },
  {
    id: 3,
    title: "Climate change: Individual vs. corporate responsibility",
    category: "Environment",
    participants: 2156,
    timeLeft: "1d 3h",
    proVotes: 72,
    conVotes: 28,
    prize: "$200",
    entryFee: "$8",
    isHot: true,
    isPremium: false,
  },
]

const quickActions = [
  { title: "Start Debate", icon: MessageSquare, color: "gradient-primary" },
  { title: "Join Tournament", icon: TrendingUp, color: "gradient-premium" },
  { title: "Upgrade Pro", icon: Crown, color: "gradient-premium" },
  { title: "Watch Live", icon: Eye, color: "gradient-pro" },
]

export function MobileHomeFeed() {
  const { user, haptic, setMainButton, hideMainButton } = useTelegram()
  const [selectedTab, setSelectedTab] = useState("debates")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Hide main button when component mounts
    hideMainButton()
  }, [hideMainButton])

  const handleRefresh = async () => {
    haptic.light()
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    haptic.success()
  }

  const handleQuickAction = (action: string) => {
    haptic.medium()
    console.log("Quick action:", action)
  }

  const handleTabChange = (tab: string) => {
    haptic.selection()
    setSelectedTab(tab)
  }

  return (
    <div className="pb-4">
      {/* Welcome Card */}
      <Card className="mx-4 mb-4 gradient-primary text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Welcome back{user ? `, ${user.first_name}` : ""}! 🎯</h2>
              <p className="opacity-90 text-sm">3 active debates • 2 pending predictions</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-xs opacity-75">Influence Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 flex flex-col gap-1"
              onClick={() => handleQuickAction(action.title)}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4">
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="debates" className="text-xs">
                <MessageSquare className="h-4 w-4 mr-1" />
                Debates
              </TabsTrigger>
              <TabsTrigger value="markets" className="text-xs">
                <TrendingUp className="h-4 w-4 mr-1" />
                Markets
              </TabsTrigger>
              <TabsTrigger value="news" className="text-xs">
                <Eye className="h-4 w-4 mr-1" />
                News
              </TabsTrigger>
            </TabsList>

            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <TabsContent value="debates" className="space-y-0 mt-4">
            <div className="space-y-0">
              {trendingDebates.map((debate) => (
                <MobileDebateCard key={debate.id} debate={debate} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="markets" className="space-y-4 mt-4">
            <Card className="mx-4">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-semibold mb-1">Prediction Markets</h3>
                <p className="text-sm text-muted-foreground mb-3">Trade on political outcomes and events</p>
                <Button className="gradient-pro text-white w-full">Explore Markets</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-4 mt-4">
            <Card className="mx-4">
              <CardContent className="p-4 text-center">
                <Eye className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-semibold mb-1">News + Betting</h3>
                <p className="text-sm text-muted-foreground mb-3">Bet on news outcomes and impacts</p>
                <Button className="gradient-premium text-white w-full">View News Feed</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Premium Upgrade CTA */}
      <Card className="mx-4 mt-4 border-2 border-premium bg-premium-muted">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full gradient-premium">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Unlock Premium</h3>
              <p className="text-sm text-muted-foreground">Advanced analytics & exclusive debates</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-premium">$6.99</div>
              <Button size="sm" className="gradient-premium text-white">
                <Zap className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
