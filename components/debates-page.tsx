"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Clock,
  Users,
  DollarSign,
  Trophy,
  Flame,
  Crown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share,
  Bookmark,
} from "lucide-react"

const debateCategories = [
  "All Categories",
  "Technology Policy",
  "Economic Policy",
  "Environmental Policy",
  "Healthcare",
  "Education",
  "Foreign Policy",
  "Social Issues",
]

const debates = [
  {
    id: 1,
    title: "Should social media platforms be held liable for misinformation?",
    category: "Technology Policy",
    description: "Examining the balance between free speech and platform responsibility in the digital age.",
    participants: 2847,
    timeLeft: "1h 23m",
    proVotes: 64,
    conVotes: 36,
    prize: "$250",
    entryFee: "$5",
    isHot: true,
    isPremium: false,
    difficulty: "Advanced",
    moderator: "Dr. Sarah Chen",
    tags: ["Free Speech", "Tech Regulation", "Misinformation"],
  },
  {
    id: 2,
    title: "Universal Healthcare: Right or Privilege?",
    category: "Healthcare",
    description: "Debating the fundamental nature of healthcare access in modern society.",
    participants: 1923,
    timeLeft: "3h 45m",
    proVotes: 58,
    conVotes: 42,
    prize: "$180",
    entryFee: "$3",
    isHot: false,
    isPremium: true,
    difficulty: "Intermediate",
    moderator: "Prof. Michael Rodriguez",
    tags: ["Healthcare", "Human Rights", "Economics"],
  },
  {
    id: 3,
    title: "Cryptocurrency: Future of Finance or Speculative Bubble?",
    category: "Economic Policy",
    description: "Analyzing the long-term viability and impact of digital currencies.",
    participants: 3156,
    timeLeft: "2d 5h",
    proVotes: 72,
    conVotes: 28,
    prize: "$400",
    entryFee: "$10",
    isHot: true,
    isPremium: false,
    difficulty: "Expert",
    moderator: "Dr. Lisa Wang",
    tags: ["Cryptocurrency", "Finance", "Innovation"],
  },
]

const tournaments = [
  {
    id: 1,
    title: "Climate Policy Championship",
    description: "16-player tournament on environmental policy solutions",
    prize: "$1,000",
    entryFee: "$25",
    participants: "12/16",
    startDate: "Dec 15, 2024",
    format: "Single Elimination",
    duration: "3 days",
  },
  {
    id: 2,
    title: "Economic Theory Showdown",
    description: "8-player expert-level economic policy debate",
    prize: "$500",
    entryFee: "$15",
    participants: "6/8",
    startDate: "Dec 20, 2024",
    format: "Round Robin",
    duration: "2 days",
  },
]

export function DebatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("trending")

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">🥊 Debate Arena</h1>
          <p className="text-muted-foreground">Join intelligent discussions and earn rewards</p>
        </div>
        <Button className="gradient-premium text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Start New Debate
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search debates by topic, keyword, or moderator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {debateCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">🔥 Trending</SelectItem>
                <SelectItem value="newest">🆕 Newest</SelectItem>
                <SelectItem value="prize">💰 Highest Prize</SelectItem>
                <SelectItem value="participants">👥 Most Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="live" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live">Live Debates</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <div className="grid gap-6">
            {debates.map((debate) => (
              <Card key={debate.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{debate.category}</Badge>
                        <Badge variant="outline">{debate.difficulty}</Badge>
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
                      <CardTitle className="text-xl leading-tight mb-2">{debate.title}</CardTitle>
                      <p className="text-muted-foreground text-sm mb-3">{debate.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {debate.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground ml-4">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        {debate.timeLeft}
                      </div>
                      <div className="text-xs">Ends</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {debate.participants.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-[hsl(var(--premium-gold))]">
                        <Trophy className="h-4 w-4" />
                        {debate.prize}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {debate.entryFee} entry
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Moderated by {debate.moderator}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-[hsl(var(--pro-green))]" />
                        <span className="text-[hsl(var(--pro-green))] font-medium">PRO {debate.proVotes}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[hsl(var(--con-red))] font-medium">CON {debate.conVotes}%</span>
                        <ThumbsDown className="h-4 w-4 text-[hsl(var(--con-red))]" />
                      </div>
                    </div>
                    <Progress value={debate.proVotes} className="h-3" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Button className="gradient-pro text-white">Join PRO Side</Button>
                      <Button variant="outline" className="border-[hsl(var(--con-red))] text-[hsl(var(--con-red))]">
                        Join CON Side
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                        Spectate
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
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

        <TabsContent value="tournaments" className="space-y-4">
          <div className="grid gap-6">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="gradient-premium text-white">Tournament</Badge>
                        <Badge variant="outline">{tournament.format}</Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{tournament.title}</CardTitle>
                      <p className="text-muted-foreground">{tournament.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Prize Pool</div>
                      <div className="font-bold text-[hsl(var(--premium-gold))] text-lg">{tournament.prize}</div>
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

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm text-muted-foreground">Starts {tournament.startDate}</div>
                    <Button className="gradient-premium text-white">
                      <Trophy className="h-4 w-4 mr-2" />
                      Enter Tournament
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
