"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTelegram } from "@/hooks/use-telegram"
import { Trophy, Users, DollarSign, Crown, Play, Eye, Zap, Target, Calendar } from "lucide-react"

interface TournamentMatch {
  id: string
  round: number
  player1: {
    id: string
    name: string
    avatar?: string
    score?: number
    rank: number
  }
  player2: {
    id: string
    name: string
    avatar?: string
    score?: number
    rank: number
  }
  winner?: string
  status: "upcoming" | "live" | "completed"
  startTime?: Date
  topic: string
  votes?: {
    player1: number
    player2: number
  }
}

interface TournamentBracketProps {
  tournamentId: string
  title: string
  prizePool: number
  entryFee: number
  participants: number
  maxParticipants: number
  status: "registration" | "live" | "completed"
  startTime: Date
  format: "single-elimination" | "double-elimination" | "round-robin"
}

const mockMatches: TournamentMatch[] = [
  {
    id: "1",
    round: 1,
    player1: { id: "1", name: "PoliticalAnalyst", rank: 1, score: 2847 },
    player2: { id: "2", name: "EuropeWatcher", rank: 5, score: 1923 },
    winner: "1",
    status: "completed",
    topic: "EU Energy Independence",
    votes: { player1: 67, player2: 33 },
  },
  {
    id: "2",
    round: 1,
    player1: { id: "3", name: "HistoryBuff", rank: 3, score: 2156 },
    player2: { id: "4", name: "PolicyExpert", rank: 7, score: 1654 },
    winner: "3",
    status: "completed",
    topic: "NATO Expansion Strategy",
    votes: { player1: 58, player2: 42 },
  },
  {
    id: "3",
    round: 2,
    player1: { id: "1", name: "PoliticalAnalyst", rank: 1, score: 2847 },
    player2: { id: "3", name: "HistoryBuff", rank: 3, score: 2156 },
    status: "live",
    topic: "Ukraine NATO Membership",
    startTime: new Date(Date.now() + 3600000),
    votes: { player1: 45, player2: 55 },
  },
]

export function TournamentBracket({
  tournamentId,
  title,
  prizePool,
  entryFee,
  participants,
  maxParticipants,
  status,
  startTime,
  format,
}: TournamentBracketProps) {
  const { haptic, user } = useTelegram()
  const [matches, setMatches] = useState<TournamentMatch[]>(mockMatches)
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(null)
  const [timeToStart, setTimeToStart] = useState<number>(0)

  useEffect(() => {
    if (status === "registration") {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const start = startTime.getTime()
        setTimeToStart(Math.max(0, start - now))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [status, startTime])

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const getRoundMatches = (round: number) => {
    return matches.filter((match) => match.round === round)
  }

  const maxRounds = Math.max(...matches.map((m) => m.round))

  const handleJoinTournament = () => {
    haptic?.medium()
    // Handle tournament registration
    console.log("Joining tournament:", tournamentId)
  }

  const handleWatchMatch = (match: TournamentMatch) => {
    haptic?.light()
    setSelectedMatch(match)
  }

  const MatchCard = ({ match }: { match: TournamentMatch }) => (
    <Card
      className={`${match.status === "live" ? "ring-2 ring-premium animate-pulse" : ""} hover:shadow-md transition-all`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Match Header */}
          <div className="flex items-center justify-between">
            <Badge
              variant={match.status === "live" ? "destructive" : match.status === "completed" ? "secondary" : "outline"}
            >
              {match.status === "live" ? "🔴 LIVE" : match.status === "completed" ? "✅ Completed" : "⏳ Upcoming"}
            </Badge>
            <span className="text-xs text-muted-foreground">Round {match.round}</span>
          </div>

          {/* Topic */}
          <h4 className="font-semibold text-sm">{match.topic}</h4>

          {/* Players */}
          <div className="space-y-2">
            {[match.player1, match.player2].map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2 rounded ${
                  match.winner === player.id ? "bg-pro/10 border border-pro" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={player.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{player.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{player.name}</div>
                    <div className="text-xs text-muted-foreground">Rank #{player.rank}</div>
                  </div>
                </div>
                <div className="text-right">
                  {match.votes && (
                    <div className="text-sm font-semibold">
                      {index === 0 ? match.votes.player1 : match.votes.player2}%
                    </div>
                  )}
                  {match.winner === player.id && <Crown className="h-4 w-4 text-premium" />}
                </div>
              </div>
            ))}
          </div>

          {/* Voting Progress */}
          {match.status === "live" && match.votes && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Community Vote</span>
                <span>{match.votes.player1 + match.votes.player2} votes</span>
              </div>
              <Progress value={match.votes.player1} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {match.status === "live" && (
              <Button size="sm" onClick={() => handleWatchMatch(match)} className="flex-1">
                <Eye className="h-3 w-3 mr-1" />
                Watch Live
              </Button>
            )}
            {match.status === "upcoming" && (
              <Button size="sm" variant="outline" className="flex-1">
                <Calendar className="h-3 w-3 mr-1" />
                {match.startTime?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Button>
            )}
            {match.status === "completed" && (
              <Button size="sm" variant="outline" onClick={() => handleWatchMatch(match)} className="flex-1">
                <Play className="h-3 w-3 mr-1" />
                Replay
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Tournament Header */}
      <Card className="bg-gradient-to-r from-premium/10 to-primary-brand/10 border-premium">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="gradient-premium text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  Tournament
                </Badge>
                <Badge variant="outline">{format.replace("-", " ").toUpperCase()}</Badge>
                <Badge variant={status === "live" ? "destructive" : status === "completed" ? "secondary" : "outline"}>
                  {status.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-2">{title}</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-premium" />
                  <span className="font-semibold">${prizePool} Prize Pool</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {participants}/{maxParticipants} Players
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>${entryFee} Entry Fee</span>
                </div>
              </div>
            </div>

            <div className="text-right space-y-2">
              {status === "registration" && timeToStart > 0 && (
                <div className="text-sm">
                  <div className="text-muted-foreground">Starts in</div>
                  <div className="font-mono font-semibold">{formatTime(timeToStart)}</div>
                </div>
              )}
              {status === "registration" && (
                <Button onClick={handleJoinTournament} className="gradient-premium text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Join Tournament
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Registration Progress</span>
              <span>
                {participants}/{maxParticipants} players
              </span>
            </div>
            <Progress value={(participants / maxParticipants) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tournament Bracket */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-center">Tournament Bracket</h2>

        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${maxRounds}, 1fr)` }}>
          {Array.from({ length: maxRounds }, (_, roundIndex) => {
            const round = roundIndex + 1
            const roundMatches = getRoundMatches(round)

            return (
              <div key={round} className="space-y-4">
                <h3 className="text-center font-semibold">
                  {round === maxRounds ? "Final" : round === maxRounds - 1 ? "Semi-Final" : `Round ${round}`}
                </h3>
                <div className="space-y-4">
                  {roundMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Prize Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-premium" />
            Prize Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-premium/10 rounded-lg">
              <div className="text-2xl mb-2">🥇</div>
              <div className="font-bold text-premium">${Math.floor(prizePool * 0.6)}</div>
              <div className="text-sm text-muted-foreground">1st Place</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-2">🥈</div>
              <div className="font-bold">${Math.floor(prizePool * 0.3)}</div>
              <div className="text-sm text-muted-foreground">2nd Place</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-2">🥉</div>
              <div className="font-bold">${Math.floor(prizePool * 0.1)}</div>
              <div className="text-sm text-muted-foreground">3rd Place</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Tournament Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Format</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Single elimination bracket</li>
                <li>• 15-minute debate rounds</li>
                <li>• Community voting determines winners</li>
                <li>• Best of 3 arguments per round</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Scoring</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Argument quality (40%)</li>
                <li>• Evidence strength (30%)</li>
                <li>• Persuasiveness (20%)</li>
                <li>• Community engagement (10%)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
