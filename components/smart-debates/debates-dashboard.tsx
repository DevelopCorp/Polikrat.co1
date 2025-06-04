"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DebateRoom } from "@/components/smart-debates/debate-room"
import { TournamentBracket } from "@/components/smart-debates/tournament-bracket"
import { NewsBetting } from "@/components/smart-debates/news-betting"
import { PaymentIntegration } from "@/components/smart-debates/payment-integration"
import { useTelegram } from "@/hooks/use-telegram"
import {
  MessageSquare,
  Trophy,
  TrendingUp,
  Plus,
  Flame,
  Users,
  Clock,
  DollarSign,
  Crown,
  Zap,
  Target,
  BarChart3,
  Star,
  Award,
  Eye,
} from "lucide-react"

interface DebateItem {
  id: string
  question: string
  description: string
  mode: "1v1" | "open" | "tournament"
  participants: number
  timeLeft: string
  proPercentage: number
  conPercentage: number
  prize?: number
  entryFee?: number
  isLive: boolean
  isPremium: boolean
  isHot: boolean
  category: string
}

interface TournamentItem {
  id: string
  title: string
  prizePool: number
  entryFee: number
  participants: number
  maxParticipants: number
  status: "registration" | "live" | "completed"
  startTime: Date
  format: "single-elimination" | "double-elimination" | "round-robin"
}

const mockDebates: DebateItem[] = [
  {
    id: "1",
    question: "Will Ukraine join NATO by 2028?",
    description: "Analyzing the geopolitical implications and likelihood of Ukraine's NATO membership",
    mode: "open",
    participants: 1247,
    timeLeft: "2h 15m",
    proPercentage: 62,
    conPercentage: 38,
    prize: 150,
    isLive: true,
    isPremium: false,
    isHot: true,
    category: "International Affairs",
  },
  {
    id: "2",
    question: "Should AI development be regulated by government?",
    description: "Debating the balance between innovation and safety in AI development",
    mode: "1v1",
    participants: 892,
    timeLeft: "5h 42m",
    proPercentage: 45,
    conPercentage: 55,
    prize: 75,
    entryFee: 5,
    isLive: false,
    isPremium: true,
    isHot: false,
    category: "Technology Policy",
  },
  {
    id: "3",
    question: "Universal Basic Income: Economic necessity or fiscal disaster?",
    description: "Examining the economic implications of implementing UBI",
    mode: "tournament",
    participants: 2156,
    timeLeft: "1d 3h",
    proPercentage: 72,
    conPercentage: 28,
    prize: 500,
    entryFee: 25,
    isLive: true,
    isPremium: false,
    isHot: true,
    category: "Economic Policy",
  },
]

const mockTournaments: TournamentItem[] = [
  {
    id: "1",
    title: "Climate Policy Championship",
    prizePool: 1000,
    entryFee: 25,
    participants: 14,
    maxParticipants: 16,
    status: "registration",
    startTime: new Date(Date.now() + 86400000),
    format: "single-elimination",
  },
  {
    id: "2",
    title: "Economic Theory Showdown",
    prizePool: 500,
    entryFee: 15,
    participants: 8,
    maxParticipants: 8,
    status: "live",
    startTime: new Date(Date.now() - 3600000),
    format: "round-robin",
  },
]

export function DebatesDashboard() {
  const { haptic, user } = useTelegram()
  const [selectedTab, setSelectedTab] = useState("debates")
  const [selectedDebate, setSelectedDebate] = useState<DebateItem | null>(null)
  const [selectedTournament, setSelectedTournament] = useState<TournamentItem | null>(null)
  const [showPayment, setShowPayment] = useState<{
    type: "tournament" | "premium" | "tip" | "bet"
    amount: number
    description: string
  } | null>(null)

  const handleJoinDebate = (debate: DebateItem) => {
    if (debate.entryFee && debate.entryFee > 0) {
      setShowPayment({
        type: "tournament",
        amount: debate.entryFee,
        description: `Entry fee for: ${debate.question}`,
      })
    } else {
      setSelectedDebate(debate)
    }
    haptic?.medium()
  }

  const handleJoinTournament = (tournament: TournamentItem) => {
    setShowPayment({
      type: "tournament",
      amount: tournament.entryFee,
      description: `Tournament entry: ${tournament.title}`,
    })
    haptic?.medium()
  }

  const handlePaymentSuccess = () => {
    setShowPayment(null)
    haptic?.success()
    // Handle successful payment
  }

  const handlePaymentError = (error: string) => {
    setShowPayment(null)
    haptic?.error()
    console.error("Payment error:", error)
  }

  if (showPayment) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <PaymentIntegration
          type={showPayment.type}
          amount={showPayment.amount}
          description={showPayment.description}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    )
  }

  if (selectedDebate) {
    return (
      <DebateRoom
        debateId={selectedDebate.id}
        question={selectedDebate.question}
        description={selectedDebate.description}
        mode={selectedDebate.mode}
        timeLimit={selectedDebate.timeLeft ? Number.parseInt(selectedDebate.timeLeft) * 60 : undefined}
        entryFee={selectedDebate.entryFee}
        prizePool={selectedDebate.prize}
        isLive={selectedDebate.isLive}
        isPremium={selectedDebate.isPremium}
      />
    )
  }

  if (selectedTournament) {
    return (
      <TournamentBracket
        tournamentId={selectedTournament.id}
        title={selectedTournament.title}
        prizePool={selectedTournament.prizePool}
        entryFee={selectedTournament.entryFee}
        participants={selectedTournament.participants}
        maxParticipants={selectedTournament.maxParticipants}
        status={selectedTournament.status}
        startTime={selectedTournament.startTime}
        format={selectedTournament.format}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary-brand/10 to-premium/10 border-primary-brand">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">🥊 Smart Debates Arena</CardTitle>
              <p className="text-muted-foreground">
                Engage in intelligent political discussions, compete in tournaments, and bet on news outcomes
              </p>
            </div>
            <Button className="gradient-premium text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Debate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-brand">{mockDebates.length}</div>
              <div className="text-sm text-muted-foreground">Active Debates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-premium">{mockTournaments.length}</div>
              <div className="text-sm text-muted-foreground">Live Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pro">
                {mockDebates.reduce((sum, d) => sum + d.participants, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Active Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-premium">
                ${mockTournaments.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Prize Pool</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="debates" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Live Debates
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Tournaments
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            News Betting
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="debates" className="space-y-6">
          <div className="grid gap-6">
            {mockDebates.map((debate) => (
              <Card key={debate.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="secondary">{debate.category}</Badge>
                          <Badge variant={debate.mode === "tournament" ? "default" : "outline"}>
                            {debate.mode === "tournament" ? "Tournament" : debate.mode === "1v1" ? "1v1" : "Open"}
                          </Badge>
                          {debate.isLive && (
                            <Badge variant="destructive" className="animate-pulse">
                              🔴 LIVE
                            </Badge>
                          )}
                          {debate.isHot && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <Flame className="h-3 w-3" />
                              Hot
                            </Badge>
                          )}
                          {debate.isPremium && (
                            <Badge className="gradient-premium text-white">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-xl leading-tight mb-2">{debate.question}</h3>
                        <p className="text-muted-foreground text-sm">{debate.description}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground ml-4">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" />
                          {debate.timeLeft}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{debate.participants.toLocaleString()} participants</span>
                        </div>
                        {debate.prize && (
                          <div className="flex items-center gap-1 text-premium">
                            <Trophy className="h-4 w-4" />
                            <span>${debate.prize} prize</span>
                          </div>
                        )}
                        {debate.entryFee && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>${debate.entryFee} entry</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Side Distribution */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-pro font-medium">PRO {debate.proPercentage}%</span>
                        <span className="text-con font-medium">CON {debate.conPercentage}%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-con/20 rounded-full h-3">
                          <div
                            className="bg-pro h-3 rounded-full transition-all duration-500"
                            style={{ width: `${debate.proPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleJoinDebate(debate)} className="gradient-primary text-white">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Join Debate
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Spectate
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {debate.isLive ? "Live now" : "Starting soon"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-6">
          <div className="grid gap-6">
            {mockTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="gradient-premium text-white">
                            <Trophy className="h-3 w-3 mr-1" />
                            Tournament
                          </Badge>
                          <Badge variant="outline">{tournament.format.replace("-", " ").toUpperCase()}</Badge>
                          <Badge
                            variant={
                              tournament.status === "live"
                                ? "destructive"
                                : tournament.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {tournament.status.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-xl mb-2">{tournament.title}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-premium" />
                            <span className="font-semibold">${tournament.prizePool} Prize Pool</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {tournament.participants}/{tournament.maxParticipants} Players
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>${tournament.entryFee} Entry Fee</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Registration Progress</span>
                        <span>
                          {tournament.participants}/{tournament.maxParticipants} players
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-premium h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {tournament.status === "registration" ? (
                          <Button
                            onClick={() => handleJoinTournament(tournament)}
                            className="gradient-premium text-white"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Enter Tournament
                          </Button>
                        ) : tournament.status === "live" ? (
                          <Button
                            onClick={() => setSelectedTournament(tournament)}
                            className="gradient-primary text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Watch Live
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={() => setSelectedTournament(tournament)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tournament.status === "registration"
                          ? `Starts ${tournament.startTime.toLocaleDateString()}`
                          : tournament.status === "live"
                            ? "Live now"
                            : "Completed"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <NewsBetting />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-premium" />
                  Top Debaters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "PoliticalAnalyst", score: 2847, badge: "🥇", change: "+23" },
                    { rank: 2, name: "EuropeWatcher", score: 2156, badge: "🥈", change: "+15" },
                    { rank: 3, name: "HistoryBuff", score: 1923, badge: "🥉", change: "+8" },
                    { rank: 4, name: "PolicyExpert", score: 1654, badge: "4", change: "-2" },
                    { rank: 5, name: "DebateMaster", score: 1432, badge: "5", change: "+12" },
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold w-8 text-center">
                          {user.rank <= 3 ? user.badge : `#${user.rank}`}
                        </span>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">Rank #{user.rank}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-premium">{user.score.toLocaleString()}</div>
                        <div className={`text-xs ${user.change.startsWith("+") ? "text-pro" : "text-con"}`}>
                          {user.change} XP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-premium" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { user: "PoliticalAnalyst", achievement: "Master Persuader", time: "2h ago" },
                    { user: "EuropeWatcher", achievement: "Tournament Winner", time: "5h ago" },
                    { user: "HistoryBuff", achievement: "Fact Checker", time: "1d ago" },
                    { user: "PolicyExpert", achievement: "Debate Veteran", time: "2d ago" },
                    { user: "DebateMaster", achievement: "Rising Star", time: "3d ago" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-semibold">{item.user}</div>
                        <div className="text-sm text-premium">{item.achievement}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
