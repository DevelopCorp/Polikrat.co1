"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTelegram } from "@/hooks/use-telegram"
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share,
  Trophy,
  Zap,
  Users,
  Clock,
  TrendingUp,
  ArrowUpDown,
  Crown,
  Coins,
  Eye,
  Heart,
  Flag,
  Gift,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Argument {
  id: string
  userId: string
  username: string
  avatar?: string
  side: "pro" | "con" | "neutral"
  content: string
  timestamp: Date
  likes: number
  dislikes: number
  replies: Argument[]
  userVote?: "like" | "dislike"
  isHighlighted?: boolean
  tips: number
  badges: string[]
}

interface DebateRoomProps {
  debateId: string
  question: string
  description: string
  mode: "1v1" | "open" | "tournament"
  timeLimit?: number
  entryFee?: number
  prizePool?: number
  isLive?: boolean
  isPremium?: boolean
}

const mockArguments: Argument[] = [
  {
    id: "1",
    userId: "user1",
    username: "PoliticalAnalyst",
    avatar: "/placeholder.svg?height=40&width=40",
    side: "pro",
    content:
      "Ukraine's NATO membership is inevitable given the current geopolitical climate. The alliance has already shown unprecedented support, and Article 5 guarantees would provide the security Ukraine desperately needs. Historical precedent shows that countries under threat often fast-track their NATO applications.",
    timestamp: new Date(Date.now() - 3600000),
    likes: 47,
    dislikes: 12,
    replies: [],
    tips: 5,
    badges: ["Expert", "Top Debater"],
  },
  {
    id: "2",
    userId: "user2",
    username: "EuropeWatcher",
    avatar: "/placeholder.svg?height=40&width=40",
    side: "con",
    content:
      "NATO expansion has been a contentious issue for decades. Adding Ukraine would escalate tensions with Russia to dangerous levels. The alliance must consider the broader implications for European stability and the potential for further conflict.",
    timestamp: new Date(Date.now() - 2700000),
    likes: 34,
    dislikes: 8,
    replies: [
      {
        id: "2a",
        userId: "user3",
        username: "HistoryBuff",
        side: "neutral",
        content:
          "Both sides have merit. Historical analysis shows NATO expansion has both stabilized and destabilized regions depending on context.",
        timestamp: new Date(Date.now() - 1800000),
        likes: 23,
        dislikes: 3,
        replies: [],
        tips: 2,
        badges: ["Historian"],
      },
    ],
    tips: 8,
    badges: ["Regional Expert"],
  },
]

export function DebateRoom({
  debateId,
  question,
  description,
  mode,
  timeLimit,
  entryFee,
  prizePool,
  isLive = false,
  isPremium = false,
}: DebateRoomProps) {
  const { haptic, user, isInTelegram } = useTelegram()
  const [debateArguments, setDebateArguments] = useState<Argument[]>(mockArguments)
  const [newArgument, setNewArgument] = useState("")
  const [selectedSide, setSelectedSide] = useState<"pro" | "con" | "neutral">("neutral")
  const [userSide, setUserSide] = useState<"pro" | "con" | "neutral" | null>(null)
  const [proPercentage, setProPercentage] = useState(62)
  const [conPercentage, setConPercentage] = useState(38)
  const [participants, setParticipants] = useState(1247)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0)
  const [selectedTab, setSelectedTab] = useState("arguments")
  const [showTipModal, setShowTipModal] = useState<string | null>(null)
  const [sideSwitchAnimation, setSideSwitchAnimation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timeLimit && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLimit, timeRemaining])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [debateArguments])

  const handleSubmitArgument = () => {
    if (!newArgument.trim() || selectedSide === "neutral") return

    const argument: Argument = {
      id: Date.now().toString(),
      userId: user?.id.toString() || "current-user",
      username: user?.first_name || "You",
      avatar: user?.photo_url,
      side: selectedSide,
      content: newArgument,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
      replies: [],
      tips: 0,
      badges: [],
    }

    setDebateArguments([...debateArguments, argument])
    setNewArgument("")
    setUserSide(selectedSide)
    haptic?.success()

    // Simulate side percentage update
    if (selectedSide === "pro") {
      setProPercentage(Math.min(100, proPercentage + 2))
      setConPercentage(Math.max(0, conPercentage - 2))
    } else {
      setConPercentage(Math.min(100, conPercentage + 2))
      setProPercentage(Math.max(0, proPercentage - 2))
    }
  }

  const handleVote = (argumentId: string, voteType: "like" | "dislike") => {
    setDebateArguments(
      debateArguments.map((arg) => {
        if (arg.id === argumentId) {
          const newArg = { ...arg }
          if (arg.userVote === voteType) {
            // Remove vote
            newArg.userVote = undefined
            newArg[voteType === "like" ? "likes" : "dislikes"]--
          } else {
            // Add or change vote
            if (arg.userVote) {
              newArg[arg.userVote === "like" ? "likes" : "dislikes"]--
            }
            newArg.userVote = voteType
            newArg[voteType === "like" ? "likes" : "dislikes"]++
          }
          return newArg
        }
        return arg
      })
    )
    haptic?.light()
  }

  const handleSideSwitch = (newSide: "pro" | "con") => {
    if (userSide && userSide !== newSide) {
      setSideSwitchAnimation(true)
      setTimeout(() => setSideSwitchAnimation(false), 1000)
      haptic?.medium()
    }
    setUserSide(newSide)
    setSelectedSide(newSide)
  }

  const handleTip = (argumentId: string, amount: number) => {
    setDebateArguments(
      debateArguments.map((arg) => (arg.id === argumentId ? { ...arg, tips: arg.tips + amount } : arg))
    )
    setShowTipModal(null)
    haptic?.success()
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const ArgumentCard = ({ argument, isReply = false }: { argument: Argument; isReply?: boolean }) => (
    <Card className={`${isReply ? "ml-8 mt-2" : "mb-4"} ${argument.isHighlighted ? "ring-2 ring-premium" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={argument.avatar || "/placeholder.svg"} />
            <AvatarFallback>{argument.username[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{argument.username}</span>
              <Badge
                variant="outline"
                className={
                  argument.side === "pro"
                    ? "border-pro text-pro"
                    : argument.side === "con"
                      ? "border-con text-con"
                      : "border-neutral-gray text-neutral-gray"
                }
              >
                {argument.side.toUpperCase()}
              </Badge>
              {argument.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground">
                {argument.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <p className="text-sm leading-relaxed">{argument.content}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(argument.id, "like")}
                  className={`gap-1 ${argument.userVote === "like" ? "text-pro" : ""}`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {argument.likes}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(argument.id, "dislike")}
                  className={`gap-1 ${argument.userVote === "dislike" ? "text-con" : ""}`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  {argument.dislikes}
                </Button>

                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Reply
                </Button>

                {argument.tips > 0 && (
                  <div className="flex items-center gap-1 text-premium">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-medium">{argument.tips}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTipModal(argument.id)}
                  className="text-premium hover:bg-premium/10"
                >
                  <Gift className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Bookmark</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {argument.replies.map((reply) => (
            <ArgumentCard key={reply.id} argument={reply} isReply />
          ))}
        </CardContent>
      </Card>
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Debate Header */}
      <Card className={`${isPremium ? "border-premium bg-premium/5" : ""}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={mode === "tournament" ? "default" : "secondary"}>
                  {mode === "tournament" ? "Tournament" : mode === "1v1" ? "1v1 Debate" : "Open Arena"}
                </Badge>
                {isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    🔴 LIVE
                  </Badge>
                )}
                {isPremium && (
                  <Badge className="gradient-premium text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl mb-2">{question}</CardTitle>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            <div className="text-right space-y-1">
              {timeRemaining > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
              )}
              {prizePool && (
                <div className="flex items-center gap-1 text-premium">
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold">${prizePool}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Side Distribution */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-pro" />
                <span className="text-pro font-semibold">PRO {proPercentage}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-con font-semibold">CON {conPercentage}%</span>
                <ThumbsDown className="h-4 w-4 text-con" />
              </div>
            </div>
            <div className="relative">
              <Progress value={proPercentage} className="h-3" />
              {sideSwitchAnimation && (
                <div className="absolute inset-0 bg-gradient-to-r from-pro/20 to-con/20 animate-pulse rounded-full" />
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{participants.toLocaleString()} participants</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{Math.floor(participants * 2.3).toLocaleString()} watching</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Side Selection */}
          {!userSide && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleSideSwitch("pro")}
                className="flex-1 gradient-pro text-white"
                size="lg"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Join PRO Side
              </Button>
              <Button
                onClick={() => handleSideSwitch("con")}
                variant="outline"
                className="flex-1 border-con text-con hover:bg-con hover:text-white"
                size="lg"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Join CON Side
              </Button>
            </div>
          )}

          {/* Side Switch Option */}
          {userSide && (
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                onClick={() => handleSideSwitch(userSide === "pro" ? "con" : "pro")}
                className="gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Switch to {userSide === "pro" ? "CON" : "PRO"} side
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="arguments">Arguments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="arguments" className="space-y-4">
          {/* Argument Input */}
          {userSide && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        userSide === "pro"
                          ? "gradient-pro text-white"
                          : userSide === "con"
                            ? "gradient-con text-white"
                            : "bg-neutral-gray text-white"
                      }
                    >
                      {userSide.toUpperCase()} Argument
                    </Badge>
                  </div>
                  <Textarea
                    placeholder={`Make your ${userSide.toUpperCase()} argument...`}
                    value={newArgument}
                    onChange={(e) => setNewArgument(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{newArgument.length}/500 characters</span>
                    <Button onClick={handleSubmitArgument} disabled={!newArgument.trim()}>
                      <Zap className="h-4 w-4 mr-2" />
                      Submit Argument
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Arguments List */}
          <div className="space-y-4">
            {debateArguments.map((argument) => (
              <ArgumentCard key={argument.id} argument={argument} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Debate Analytics
                {isPremium ? null : (
                  <Badge className="gradient-premium text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium Only
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPremium ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-pro/10 rounded-lg">
                      <div className="text-2xl font-bold text-pro">23</div>
                      <div className="text-sm text-muted-foreground">Side Switches to PRO</div>
                    </div>
                    <div className="text-center p-4 bg-con/10 rounded-lg">
                      <div className="text-2xl font-bold text-con">17</div>
                      <div className="text-sm text-muted-foreground">Side Switches to CON</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-lg font-semibold">Persuasion Rate: 3.2%</div>
                    <div className="text-sm text-muted-foreground">Users convinced to switch sides</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-premium" />
                  <h3 className="font-semibold mb-2">Premium Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Unlock detailed debate analytics, persuasion metrics, and trend analysis
                  </p>
                  <Button className="gradient-premium text-white">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top Debaters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "PoliticalAnalyst", score: 2847, badge: "🥇" },
                  { rank: 2, name: "EuropeWatcher", score: 2156, badge: "🥈" },
                  { rank: 3, name: "HistoryBuff", score: 1923, badge: "🥉" },
                ].map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{user.badge}</span>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-muted-foreground">Rank #{user.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-premium">{user.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Debate Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Argument Guidelines:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Support your arguments with credible sources</li>
                  <li>Respect opposing viewpoints</li>
                  <li>No personal attacks or harassment</li>
                  <li>Stay on topic and relevant to the debate question</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Scoring System:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>+10 XP for submitting an argument</li>
                  <li>+5 XP for each upvote received</li>
                  <li>+50 XP for convincing someone to switch sides</li>
                  <li>+100 XP for winning a tournament round</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-sm mx-4">
            <CardHeader>
              <CardTitle>Tip This Argument</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Show appreciation for great arguments with tips
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 5, 10].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => handleTip(showTipModal, amount)}
                    className="flex flex-col gap-1"
                  >
                    <Coins className="h-4 w-4 text-premium" />
                    <span>${amount}</span>
                  </Button>
                ))}
              </div>
              <Button variant="outline" onClick={() => setShowTipModal(null)} className="w-full">
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
