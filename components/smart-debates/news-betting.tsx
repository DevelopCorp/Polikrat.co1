"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTelegram } from "@/hooks/use-telegram"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Eye,
  Share,
  Bookmark,
  ExternalLink,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  Calendar,
  Zap,
} from "lucide-react"

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  sourceReliability: "high" | "medium" | "low"
  publishedAt: Date
  category: string
  imageUrl?: string
  readTime: number
  bettingQuestion: string
  odds: {
    yes: number
    no: number
  }
  volume: number
  deadline: Date
  tags: string[]
  bias: "left" | "center" | "right"
  factuality: "high" | "mixed" | "low"
  userBet?: {
    side: "yes" | "no"
    amount: number
    odds: number
  }
}

interface BettingPosition {
  id: string
  newsId: string
  side: "yes" | "no"
  amount: number
  odds: number
  potentialPayout: number
  status: "active" | "won" | "lost" | "pending"
  placedAt: Date
}

const mockNewsItems: NewsItem[] = [
  {
    id: "1",
    title: "EU Parliament Votes on New AI Regulation Framework",
    summary:
      "The European Parliament is set to vote on comprehensive AI regulation that could reshape the tech industry across Europe. The legislation includes strict guidelines for AI development and deployment.",
    source: "Reuters",
    sourceReliability: "high",
    publishedAt: new Date(Date.now() - 3600000),
    category: "Technology Policy",
    readTime: 4,
    bettingQuestion: "Will the EU AI Act pass with a majority vote this week?",
    odds: { yes: 73, no: 27 },
    volume: 45600,
    deadline: new Date(Date.now() + 86400000 * 3),
    tags: ["AI", "EU", "Regulation", "Technology"],
    bias: "center",
    factuality: "high",
  },
  {
    id: "2",
    title: "Federal Reserve Signals Potential Rate Changes",
    summary:
      "Fed Chair Jerome Powell hints at possible interest rate adjustments in response to inflation data. Markets are closely watching for signals about monetary policy direction.",
    source: "Financial Times",
    sourceReliability: "high",
    publishedAt: new Date(Date.now() - 7200000),
    category: "Economics",
    readTime: 3,
    bettingQuestion: "Will the Fed cut rates by 0.25% or more in the next meeting?",
    odds: { yes: 68, no: 32 },
    volume: 78900,
    deadline: new Date(Date.now() + 86400000 * 14),
    tags: ["Federal Reserve", "Interest Rates", "Economy"],
    bias: "center",
    factuality: "high",
    userBet: { side: "yes", amount: 25, odds: 68 },
  },
  {
    id: "3",
    title: "Ukraine Peace Talks Resume in Geneva",
    summary:
      "Diplomatic efforts to end the conflict in Ukraine resume with new proposals from international mediators. Both sides express cautious optimism about potential breakthrough.",
    source: "BBC News",
    sourceReliability: "high",
    publishedAt: new Date(Date.now() - 10800000),
    category: "International Affairs",
    readTime: 5,
    bettingQuestion: "Will a ceasefire agreement be announced within 30 days?",
    odds: { yes: 34, no: 66 },
    volume: 123400,
    deadline: new Date(Date.now() + 86400000 * 30),
    tags: ["Ukraine", "Peace Talks", "Diplomacy"],
    bias: "center",
    factuality: "high",
  },
]

const mockPositions: BettingPosition[] = [
  {
    id: "1",
    newsId: "2",
    side: "yes",
    amount: 25,
    odds: 68,
    potentialPayout: 36.76,
    status: "active",
    placedAt: new Date(Date.now() - 3600000),
  },
]

export function NewsBetting() {
  const { haptic, user } = useTelegram()
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockNewsItems)
  const [positions, setPositions] = useState<BettingPosition[]>(mockPositions)
  const [selectedTab, setSelectedTab] = useState("news")
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [betAmount, setBetAmount] = useState(10)
  const [showBetModal, setShowBetModal] = useState<{ newsId: string; side: "yes" | "no" } | null>(null)

  const handlePlaceBet = (newsId: string, side: "yes" | "no", amount: number) => {
    const newsItem = newsItems.find((item) => item.id === newsId)
    if (!newsItem) return

    const odds = newsItem.odds[side]
    const potentialPayout = (amount * 100) / odds

    const newPosition: BettingPosition = {
      id: Date.now().toString(),
      newsId,
      side,
      amount,
      odds,
      potentialPayout,
      status: "active",
      placedAt: new Date(),
    }

    setPositions([...positions, newPosition])
    setShowBetModal(null)
    haptic?.success()

    // Update news item with user bet
    setNewsItems(newsItems.map((item) => (item.id === newsId ? { ...item, userBet: { side, amount, odds } } : item)))
  }

  const getSourceReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case "high":
        return "text-pro"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-con"
      default:
        return "text-muted-foreground"
    }
  }

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case "left":
        return "🔵"
      case "right":
        return "🔴"
      case "center":
        return "⚪"
      default:
        return "⚪"
    }
  }

  const formatTimeRemaining = (deadline: Date) => {
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h`
    return "Ending soon"
  }

  const NewsCard = ({ news }: { news: NewsItem }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary">{news.category}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <span className={getSourceReliabilityColor(news.sourceReliability)}>
                    {news.sourceReliability === "high" ? "✓" : news.sourceReliability === "medium" ? "~" : "!"}
                  </span>
                  <span className="text-muted-foreground">{news.source}</span>
                </div>
                <span className="text-sm">{getBiasIcon(news.bias)}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{news.readTime} min read</span>
                </div>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-2">{news.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{news.summary}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {news.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Betting Section */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-premium" />
              <h4 className="font-semibold">Prediction Market</h4>
            </div>

            <p className="text-sm font-medium">{news.bettingQuestion}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-pro font-medium">YES {news.odds.yes}%</span>
                <span className="text-con font-medium">NO {news.odds.no}%</span>
              </div>
              <Progress value={news.odds.yes} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>${(news.volume / 1000).toFixed(1)}k volume</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatTimeRemaining(news.deadline)}</span>
                </div>
              </div>
            </div>

            {/* Betting Buttons */}
            {news.userBet ? (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <div className="font-medium">Your bet: {news.userBet.side.toUpperCase()}</div>
                  <div className="text-muted-foreground">
                    ${news.userBet.amount} at {news.userBet.odds}%
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setShowBetModal({ newsId: news.id, side: "yes" })}
                  className="gradient-pro text-white"
                >
                  Bet YES
                  <span className="ml-1 text-xs opacity-75">${((betAmount * 100) / news.odds.yes).toFixed(2)}</span>
                </Button>
                <Button
                  onClick={() => setShowBetModal({ newsId: news.id, side: "no" })}
                  variant="outline"
                  className="border-con text-con hover:bg-con hover:text-white"
                >
                  Bet NO
                  <span className="ml-1 text-xs opacity-75">${((betAmount * 100) / news.odds.no).toFixed(2)}</span>
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedNews(news)}>
                <Eye className="h-4 w-4 mr-1" />
                Read Full
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
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
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-primary-brand">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            News + Prediction Markets
          </CardTitle>
          <p className="text-muted-foreground">
            Read breaking news and bet on outcomes with real-time prediction markets
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-brand">{newsItems.length}</div>
              <div className="text-sm text-muted-foreground">Active Markets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-premium">
                ${newsItems.reduce((sum, item) => sum + item.volume, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pro">{positions.length}</div>
              <div className="text-sm text-muted-foreground">Your Positions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="news">Latest News</TabsTrigger>
          <TabsTrigger value="positions">My Positions</TabsTrigger>
          <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          <div className="space-y-6">
            {newsItems.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          {positions.length > 0 ? (
            <div className="space-y-4">
              {positions.map((position) => {
                const news = newsItems.find((item) => item.id === position.newsId)
                if (!news) return null

                return (
                  <Card key={position.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{news.bettingQuestion}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{news.title}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Bet:</span>
                              <Badge
                                className={
                                  position.side === "yes" ? "gradient-pro text-white" : "gradient-con text-white"
                                }
                              >
                                {position.side.toUpperCase()}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="font-medium ml-1">${position.amount}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Potential:</span>
                              <span className="font-medium ml-1 text-premium">
                                ${position.potentialPayout.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              position.status === "won"
                                ? "default"
                                : position.status === "lost"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {position.status === "won" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {position.status === "lost" && <XCircle className="h-3 w-3 mr-1" />}
                            {position.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {position.status.toUpperCase()}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatTimeRemaining(news.deadline)} left
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Active Positions</h3>
                <p className="text-muted-foreground mb-4">Start betting on news outcomes to see your positions here</p>
                <Button onClick={() => setSelectedTab("news")}>
                  <Zap className="h-4 w-4 mr-2" />
                  Browse Markets
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-pro/10 rounded-lg">
                    <div>
                      <div className="font-semibold text-pro">Bullish Sentiment</div>
                      <div className="text-sm text-muted-foreground">EU AI Regulation</div>
                    </div>
                    <div className="flex items-center gap-1 text-pro">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-bold">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-con/10 rounded-lg">
                    <div>
                      <div className="font-semibold text-con">Bearish Sentiment</div>
                      <div className="text-sm text-muted-foreground">Peace Talks Success</div>
                    </div>
                    <div className="flex items-center gap-1 text-con">
                      <TrendingDown className="h-4 w-4" />
                      <span className="font-bold">-8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fed Rate Decision</span>
                    <div className="flex items-center gap-1 text-pro">
                      <span className="font-semibold">+24%</span>
                      <TrendingUp className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Regulation Vote</span>
                    <div className="flex items-center gap-1 text-pro">
                      <span className="font-semibold">+18%</span>
                      <TrendingUp className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ukraine Ceasefire</span>
                    <div className="flex items-center gap-1 text-con">
                      <span className="font-semibold">-15%</span>
                      <TrendingDown className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Volume by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "Economics", volume: 234500, percentage: 45 },
                  { category: "Technology Policy", volume: 156800, percentage: 30 },
                  { category: "International Affairs", volume: 98200, percentage: 19 },
                  { category: "Other", volume: 31500, percentage: 6 },
                ].map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-muted-foreground">${item.volume.toLocaleString()}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bet Modal */}
      {showBetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 w-full">
            <CardHeader>
              <CardTitle>Place Your Bet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const news = newsItems.find((item) => item.id === showBetModal.newsId)
                if (!news) return null

                const odds = news.odds[showBetModal.side]
                const potentialPayout = (betAmount * 100) / odds

                return (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-semibold">{news.bettingQuestion}</h4>
                      <Badge
                        className={showBetModal.side === "yes" ? "gradient-pro text-white" : "gradient-con text-white"}
                      >
                        Betting {showBetModal.side.toUpperCase()} at {odds}%
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Bet Amount</label>
                        <div className="flex gap-2 mt-1">
                          {[5, 10, 25, 50].map((amount) => (
                            <Button
                              key={amount}
                              variant={betAmount === amount ? "default" : "outline"}
                              size="sm"
                              onClick={() => setBetAmount(amount)}
                            >
                              ${amount}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Bet Amount:</span>
                          <span className="font-medium">${betAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Potential Payout:</span>
                          <span className="font-medium text-premium">${potentialPayout.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Potential Profit:</span>
                          <span className="font-medium text-pro">+${(potentialPayout - betAmount).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowBetModal(null)} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handlePlaceBet(showBetModal.newsId, showBetModal.side, betAmount)}
                        className="flex-1 gradient-premium text-white"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Place Bet
                      </Button>
                    </div>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{selectedNews.category}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <span className={getSourceReliabilityColor(selectedNews.sourceReliability)}>
                        {selectedNews.sourceReliability === "high"
                          ? "✓"
                          : selectedNews.sourceReliability === "medium"
                            ? "~"
                            : "!"}
                      </span>
                      <span className="text-muted-foreground">{selectedNews.source}</span>
                    </div>
                    <span>{getBiasIcon(selectedNews.bias)}</span>
                  </div>
                  <CardTitle className="text-xl">{selectedNews.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNews(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedNews.summary}</p>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Source Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Factuality:</span>
                      <span
                        className={`ml-2 font-medium ${
                          selectedNews.factuality === "high"
                            ? "text-pro"
                            : selectedNews.factuality === "mixed"
                              ? "text-yellow-600"
                              : "text-con"
                        }`}
                      >
                        {selectedNews.factuality.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bias:</span>
                      <span className="ml-2 font-medium">
                        {getBiasIcon(selectedNews.bias)} {selectedNews.bias.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Prediction Market</h4>
                  <p className="font-medium mb-3">{selectedNews.bettingQuestion}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-pro font-medium">YES {selectedNews.odds.yes}%</span>
                      <span className="text-con font-medium">NO {selectedNews.odds.no}%</span>
                    </div>
                    <Progress value={selectedNews.odds.yes} className="h-3" />
                  </div>

                  {!selectedNews.userBet && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => {
                          setSelectedNews(null)
                          setShowBetModal({ newsId: selectedNews.id, side: "yes" })
                        }}
                        className="gradient-pro text-white"
                      >
                        Bet YES
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedNews(null)
                          setShowBetModal({ newsId: selectedNews.id, side: "no" })
                        }}
                        variant="outline"
                        className="border-con text-con hover:bg-con hover:text-white"
                      >
                        Bet NO
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
