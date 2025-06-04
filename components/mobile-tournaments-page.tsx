"use client"

import { useState } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, Crown, Eye, TrendingUp, RefreshCw } from "lucide-react"

const activeTournaments = [
  {
    id: 1,
    title: "Climate Policy Championship",
    category: "Environment",
    participants: "14/16",
    prize: "$1,000",
    entryFee: "$25",
    startDate: "Dec 15",
    status: "Filling",
    isSponsored: true,
  },
  {
    id: 2,
    title: "Economic Theory Showdown",
    category: "Economics",
    participants: "8/8",
    prize: "$500",
    entryFee: "$15",
    startDate: "Dec 20",
    status: "Full",
    isSponsored: false,
  },
  {
    id: 3,
    title: "Healthcare Debate Series",
    category: "Healthcare",
    participants: "9/12",
    prize: "$750",
    entryFee: "$20",
    startDate: "Dec 22",
    status: "Filling",
    isSponsored: true,
  },
]

const completedTournaments = [
  {
    id: 1,
    title: "Tech Regulation Debate",
    winner: "Sarah Chen",
    prize: "$800",
    category: "Technology",
  },
  {
    id: 2,
    title: "Immigration Policy Forum",
    winner: "Michael Rodriguez",
    prize: "$600",
    category: "Social Policy",
  },
]

export function MobileTournamentsPage() {
  const { haptic, setMainButton } = useTelegram()
  const [selectedTab, setSelectedTab] = useState("active")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleTabChange = (tab: string) => {
    haptic.selection()
    setSelectedTab(tab)

    if (tab === "active") {
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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    haptic.success()
  }

  const handleTournamentAction = (tournamentId: number, action: string) => {
    haptic.medium()
    console.log(`${action} tournament ${tournamentId}`)
  }

  return (
    <div className="p-4 space-y-4 pb-16">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-premium">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-premium">12</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-xl font-bold text-pro">$4,250</div>
              <div className="text-xs text-muted-foreground">Prize Pool</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} className="ml-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsContent value="active" className="space-y-4 mt-4">
          {activeTournaments.map((tournament) => (
            <Card key={tournament.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {tournament.category}
                    </Badge>
                    <Badge
                      className={`text-xs ${
                        tournament.status === "Filling" ? "bg-pro-muted text-pro" : "bg-con-muted text-con"
                      }`}
                    >
                      {tournament.status}
                    </Badge>
                    {tournament.isSponsored && (
                      <Badge className="gradient-premium text-white flex items-center gap-1 text-xs">
                        <Crown className="h-3 w-3" />
                        Sponsored
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{tournament.title}</h3>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-premium">{tournament.prize}</div>
                    <div className="text-xs text-muted-foreground">Prize</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{tournament.participants}</div>
                    <div className="text-xs text-muted-foreground">Players</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{tournament.entryFee}</div>
                    <div className="text-xs text-muted-foreground">Entry</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Registration</span>
                    <span className="font-medium">{tournament.participants}</span>
                  </div>
                  <Progress
                    value={
                      (Number.parseInt(tournament.participants.split("/")[0]) /
                        Number.parseInt(tournament.participants.split("/")[1])) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Starts {tournament.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleTournamentAction(tournament.id, "view")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {tournament.status === "Filling" ? (
                      <Button
                        className="gradient-premium text-white"
                        size="sm"
                        onClick={() => handleTournamentAction(tournament.id, "enter")}
                      >
                        <Trophy className="h-4 w-4 mr-1" />
                        Enter
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Users className="h-4 w-4 mr-1" />
                        Full
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedTournaments.map((tournament) => (
            <Card key={tournament.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {tournament.category}
                      </Badge>
                      <Badge variant="outline" className="text-pro border-pro text-xs">
                        Completed
                      </Badge>
                    </div>
                    <h3 className="font-bold mb-1">{tournament.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Winner: <span className="font-medium text-pro">{tournament.winner}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-premium">{tournament.prize}</div>
                    <Button size="sm" variant="outline" className="mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Results
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Performance Stats */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-center">Your Performance</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-pro">7</div>
                  <div className="text-xs text-muted-foreground">Entered</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-premium">2</div>
                  <div className="text-xs text-muted-foreground">Won</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
