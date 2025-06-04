"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, Target, Crown, Play, Eye, TrendingUp } from "lucide-react"

const activeTournaments = [
  {
    id: 1,
    title: "Climate Policy Championship",
    description: "16-player single elimination tournament on environmental policy solutions",
    format: "Single Elimination",
    prize: "$1,000",
    entryFee: "$25",
    participants: "14/16",
    startDate: "Dec 15, 2024",
    duration: "3 days",
    status: "Filling",
    category: "Environmental",
    difficulty: "Expert",
    sponsor: "Green Future Foundation",
  },
  {
    id: 2,
    title: "Economic Theory Showdown",
    description: "8-player round robin tournament on economic policy and theory",
    format: "Round Robin",
    prize: "$500",
    entryFee: "$15",
    participants: "8/8",
    startDate: "Dec 20, 2024",
    duration: "2 days",
    status: "Full",
    category: "Economics",
    difficulty: "Advanced",
    sponsor: null,
  },
  {
    id: 3,
    title: "Healthcare Debate Series",
    description: "12-player bracket tournament focusing on healthcare policy reform",
    format: "Double Elimination",
    prize: "$750",
    entryFee: "$20",
    participants: "9/12",
    startDate: "Dec 22, 2024",
    duration: "4 days",
    status: "Filling",
    category: "Healthcare",
    difficulty: "Intermediate",
    sponsor: "Medical Policy Institute",
  },
]

const completedTournaments = [
  {
    id: 1,
    title: "Tech Regulation Debate",
    winner: "Sarah Chen",
    prize: "$800",
    participants: 16,
    completedDate: "Dec 1, 2024",
    category: "Technology",
  },
  {
    id: 2,
    title: "Immigration Policy Forum",
    winner: "Michael Rodriguez",
    prize: "$600",
    participants: 12,
    completedDate: "Nov 28, 2024",
    category: "Social Policy",
  },
]

const brackets = [
  {
    round: "Quarterfinals",
    matches: [
      { player1: "Sarah Chen", player2: "Mike Johnson", winner: "Sarah Chen", score: "3-1" },
      { player1: "Elena Rodriguez", player2: "James Wilson", winner: "Elena Rodriguez", score: "3-2" },
      { player1: "David Kim", player2: "Lisa Wang", winner: "David Kim", score: "3-0" },
      { player1: "Anna Kowalski", player2: "Tom Brown", winner: "Anna Kowalski", score: "3-1" },
    ],
  },
  {
    round: "Semifinals",
    matches: [
      { player1: "Sarah Chen", player2: "Elena Rodriguez", winner: null, score: "TBD" },
      { player1: "David Kim", player2: "Anna Kowalski", winner: null, score: "TBD" },
    ],
  },
  {
    round: "Finals",
    matches: [{ player1: "TBD", player2: "TBD", winner: null, score: "TBD" }],
  },
]

export function TournamentsPage() {
  const [selectedTab, setSelectedTab] = useState("active")

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">🏆 Tournament Arena</h1>
          <p className="text-muted-foreground">Compete in structured debates for prizes and recognition</p>
        </div>
        <Button className="gradient-premium text-white">
          <Trophy className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Tournament Stats */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-premium">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-premium">12</div>
              <div className="text-sm text-muted-foreground">Active Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pro">$4,250</div>
              <div className="text-sm text-muted-foreground">Total Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-brand">156</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-gray">3</div>
              <div className="text-sm text-muted-foreground">Your Tournaments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Tournaments</TabsTrigger>
          <TabsTrigger value="brackets">Live Brackets</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-6">
            {activeTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{tournament.category}</Badge>
                        <Badge variant="outline">{tournament.difficulty}</Badge>
                        <Badge variant="outline">{tournament.format}</Badge>
                        <Badge
                          className={
                            tournament.status === "Filling"
                              ? "bg-pro-muted text-pro"
                              : tournament.status === "Full"
                                ? "bg-con-muted text-con"
                                : "bg-neutral-gray-light text-neutral-gray"
                          }
                        >
                          {tournament.status}
                        </Badge>
                        {tournament.sponsor && (
                          <Badge className="gradient-premium text-white flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Sponsored
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl leading-tight mb-2">{tournament.title}</CardTitle>
                      <p className="text-muted-foreground text-sm mb-3">{tournament.description}</p>
                      {tournament.sponsor && (
                        <p className="text-xs text-muted-foreground">Sponsored by {tournament.sponsor}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground ml-4">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="h-3 w-3" />
                        {tournament.startDate}
                      </div>
                      <div className="text-xs">Starts</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Prize Pool</div>
                      <div className="font-bold text-premium text-lg">{tournament.prize}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Entry Fee</div>
                      <div className="font-semibold">{tournament.entryFee}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Participants</div>
                      <div className="font-semibold">{tournament.participants}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Duration</div>
                      <div className="font-semibold">{tournament.duration}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Registration Progress</span>
                      <span className="font-medium">
                        {tournament.participants.split("/")[0]} / {tournament.participants.split("/")[1]} players
                      </span>
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

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {tournament.status === "Filling" ? (
                        <Button className="gradient-premium text-white">
                          <Trophy className="h-4 w-4 mr-2" />
                          Enter Tournament
                        </Button>
                      ) : tournament.status === "Full" ? (
                        <Button variant="outline" disabled>
                          <Users className="h-4 w-4 mr-2" />
                          Tournament Full
                        </Button>
                      ) : (
                        <Button className="gradient-primary text-white">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Live
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tournament.status === "Filling" ? "Registration open" : "Tournament in progress"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Tournament CTA */}
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-premium/50 transition-colors">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Host Your Own Tournament</h3>
              <p className="text-muted-foreground mb-4">
                Create custom tournaments with your own rules, prizes, and topics
              </p>
              <Button className="gradient-premium text-white">
                <Trophy className="h-4 w-4 mr-2" />
                Create Tournament
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brackets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Climate Policy Championship - Live Bracket
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Prize: $1,000</span>
                <span>16 Players</span>
                <span>Single Elimination</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {brackets.map((round, roundIndex) => (
                  <div key={roundIndex} className="space-y-3">
                    <h3 className="font-semibold text-lg text-center">{round.round}</h3>
                    <div className="grid gap-3">
                      {round.matches.map((match, matchIndex) => (
                        <Card key={matchIndex} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className={`font-medium ${match.winner === match.player1 ? "text-pro" : match.winner ? "text-muted-foreground" : ""}`}
                                >
                                  {match.player1}
                                </span>
                                {match.winner === match.player1 && <Crown className="h-4 w-4 text-premium" />}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">VS</div>
                              <div className="flex items-center justify-between">
                                <span
                                  className={`font-medium ${match.winner === match.player2 ? "text-pro" : match.winner ? "text-muted-foreground" : ""}`}
                                >
                                  {match.player2}
                                </span>
                                {match.winner === match.player2 && <Crown className="h-4 w-4 text-premium" />}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold">{match.score}</div>
                              {!match.winner && match.score === "TBD" && (
                                <Button size="sm" variant="outline" className="mt-2">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Watch
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-4">
            {completedTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{tournament.category}</Badge>
                        <Badge variant="outline" className="text-pro border-pro">
                          Completed
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{tournament.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Winner: <span className="font-medium text-pro">{tournament.winner}</span>
                        </span>
                        <span>{tournament.participants} participants</span>
                        <span>Completed: {tournament.completedDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-premium">{tournament.prize}</div>
                      <div className="text-sm text-muted-foreground">Prize Pool</div>
                      <Button size="sm" variant="outline" className="mt-2">
                        <Eye className="h-3 w-3 mr-1" />
                        View Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tournament History Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Tournament Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-pro-muted">
                  <div className="text-2xl font-bold text-pro">7</div>
                  <div className="text-sm text-muted-foreground">Tournaments Entered</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-premium-muted">
                  <div className="text-2xl font-bold text-premium">2</div>
                  <div className="text-sm text-muted-foreground">Tournaments Won</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50">
                  <div className="text-2xl font-bold text-primary-brand">$450</div>
                  <div className="text-sm text-muted-foreground">Total Winnings</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-neutral-gray-light">
                  <div className="text-2xl font-bold text-neutral-gray">73%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
