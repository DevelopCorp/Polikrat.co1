"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  MessageSquare,
  Users,
  Clock,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Eye,
  Share,
  Heart,
  Flame,
  Crown,
} from "lucide-react"

const trendingDebates = [
  {
    id: 1,
    title: "Should AI be regulated by government agencies?",
    category: "Technology Policy",
    participants: 1247,
    timeLeft: "2h 15m",
    proVotes: 68,
    conVotes: 32,
    prize: "$150",
    isHot: true,
    isPremium: false,
  },
  {
    id: 2,
    title: "Universal Basic Income: Economic necessity or fiscal disaster?",
    category: "Economic Policy",
    participants: 892,
    timeLeft: "5h 42m",
    proVotes: 45,
    conVotes: 55,
    prize: "$75",
    isHot: false,
    isPremium: true,
  },
  {
    id: 3,
    title: "Climate change: Individual responsibility vs. corporate accountability",
    category: "Environmental Policy",
    participants: 2156,
    timeLeft: "1d 3h",
    proVotes: 72,
    conVotes: 28,
    prize: "$200",
    isHot: true,
    isPremium: false,
  },
]

const predictionMarkets = [
  {
    id: 1,
    title: "2024 US Presidential Election Winner",
    odds: { candidate1: 52, candidate2: 48 },
    volume: "$2.4M",
    change: "+3.2%",
    isUp: true,
  },
  {
    id: 2,
    title: "Federal Reserve Rate Cut by March 2024",
    odds: { yes: 73, no: 27 },
    volume: "$890K",
    change: "-1.8%",
    isUp: false,
  },
  {
    id: 3,
    title: "UK General Election Before 2025",
    odds: { yes: 34, no: 66 },
    volume: "$456K",
    change: "+5.7%",
    isUp: true,
  },
]

const newsItems = [
  {
    id: 1,
    title: "Senate Passes Bipartisan Infrastructure Bill",
    summary: "Major victory for cross-party cooperation on critical infrastructure spending",
    bettingQuestion: "Will this bill increase Biden's approval rating by 5+ points?",
    odds: { yes: 62, no: 38 },
    timeAgo: "2h ago",
    category: "Politics",
  },
  {
    id: 2,
    title: "Federal Reserve Signals Potential Rate Changes",
    summary: "Markets react to hints about monetary policy adjustments in upcoming meeting",
    bettingQuestion: "Will rates be cut by 0.25% or more in next meeting?",
    odds: { yes: 78, no: 22 },
    timeAgo: "4h ago",
    category: "Economics",
  },
]

export function HomeFeed() {
  const [selectedTab, setSelectedTab] = useState("debates")

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <Card className="gradient-premium text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, Alex! 🎯</h2>
              <p className="opacity-90">You have 3 active debates and 2 pending predictions</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Your Influence Score</div>
              <div className="text-3xl font-bold">1,247</div>
              <div className="text-sm opacity-75">+23 today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="debates" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Live Debates
          </TabsTrigger>
          <TabsTrigger value="markets" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Prediction Markets
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            News Betting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="debates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">🔥 Trending Debates</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="grid gap-4">
            {trendingDebates.map((debate) => (
              <Card key={debate.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{debate.category}</Badge>
                        {debate.isHot && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            Hot
                          </Badge>
                        )}
                        {debate.isPremium && (
                          <Badge className="gradient-premium text-white flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">{debate.title}</CardTitle>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {debate.timeLeft}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {debate.participants.toLocaleString()} participants
                      </div>
                      <div className="flex items-center gap-1 text-[hsl(var(--premium-gold))]">
                        <DollarSign className="h-4 w-4" />
                        {debate.prize} prize
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[hsl(var(--pro-green))] font-medium">PRO {debate.proVotes}%</span>
                      <span className="text-[hsl(var(--con-red))] font-medium">CON {debate.conVotes}%</span>
                    </div>
                    <Progress value={debate.proVotes} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="gradient-pro text-white">
                        Join PRO
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[hsl(var(--con-red))] text-[hsl(var(--con-red))]"
                      >
                        Join CON
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="markets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">📈 Hot Prediction Markets</h3>
            <Button variant="outline" size="sm">
              View All Markets
            </Button>
          </div>

          <div className="grid gap-4">
            {predictionMarkets.map((market) => (
              <Card key={market.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{market.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {market.volume} volume
                        </div>
                        <div className={`flex items-center gap-1 ${market.isUp ? "text-green-600" : "text-red-600"}`}>
                          {market.isUp ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                          {market.change}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        {Object.entries(market.odds).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="capitalize font-medium">{key.replace(/\d+/, " ")}</span>
                            <span className="font-bold">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 gradient-pro text-white">Buy YES</Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-[hsl(var(--con-red))] text-[hsl(var(--con-red))]"
                      >
                        Buy NO
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">📰 News + Betting</h3>
            <Button variant="outline" size="sm">
              All News
            </Button>
          </div>

          <div className="grid gap-4">
            {newsItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-sm text-muted-foreground">{item.timeAgo}</span>
                        </div>
                        <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.summary}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-3">💰 Bet on the outcome:</h5>
                      <p className="text-sm mb-3">{item.bettingQuestion}</p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-[hsl(var(--pro-green))]">{item.odds.yes}%</div>
                            <div className="text-xs text-muted-foreground">YES</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-[hsl(var(--con-red))]">{item.odds.no}%</div>
                            <div className="text-xs text-muted-foreground">NO</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="gradient-pro text-white">
                          Bet YES - ${((item.odds.yes / 100) * 10).toFixed(2)}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[hsl(var(--con-red))] text-[hsl(var(--con-red))]"
                        >
                          Bet NO - ${((item.odds.no / 100) * 10).toFixed(2)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Premium Upgrade CTA */}
      <Card className="border-2 border-[hsl(var(--premium-gold))] bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full gradient-premium">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Unlock Premium Analytics</h3>
                <p className="text-muted-foreground">Get advanced insights, remove ads, and access exclusive debates</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[hsl(var(--premium-gold))]">$6.99/mo</div>
              <Button className="gradient-premium text-white mt-2">Upgrade Now</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
