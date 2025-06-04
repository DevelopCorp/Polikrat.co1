"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  DollarSign,
  Users,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Globe,
  Calendar,
  Target,
  Zap,
} from "lucide-react"

const marketCategories = [
  "All Markets",
  "Elections",
  "Economics",
  "International",
  "Technology",
  "Climate",
  "Sports",
  "Entertainment",
]

const markets = [
  {
    id: 1,
    title: "2024 US Presidential Election Winner",
    description: "Who will win the 2024 United States Presidential Election?",
    category: "Elections",
    volume: "$4.2M",
    participants: 15420,
    endDate: "Nov 5, 2024",
    options: [
      { name: "Democratic Candidate", odds: 52, change: "+2.1%" },
      { name: "Republican Candidate", odds: 45, change: "-1.8%" },
      { name: "Third Party", odds: 3, change: "-0.3%" },
    ],
    isHot: true,
    liquidity: "High",
  },
  {
    id: 2,
    title: "Federal Reserve Rate Decision",
    description: "Will the Fed cut rates by 0.25% or more in the next meeting?",
    category: "Economics",
    volume: "$1.8M",
    participants: 8934,
    endDate: "Dec 18, 2024",
    options: [
      { name: "Yes (0.25%+ cut)", odds: 73, change: "+5.2%" },
      { name: "No rate cut", odds: 27, change: "-5.2%" },
    ],
    isHot: true,
    liquidity: "Medium",
  },
  {
    id: 3,
    title: "UK General Election Timing",
    description: "Will the UK hold a general election before the end of 2024?",
    category: "International",
    volume: "$890K",
    participants: 4521,
    endDate: "Dec 31, 2024",
    options: [
      { name: "Yes, before 2025", odds: 34, change: "+1.7%" },
      { name: "No, in 2025 or later", odds: 66, change: "-1.7%" },
    ],
    isHot: false,
    liquidity: "Medium",
  },
  {
    id: 4,
    title: "AI Regulation Passage",
    description: "Will comprehensive AI regulation be passed in the US by end of 2024?",
    category: "Technology",
    volume: "$650K",
    participants: 3287,
    endDate: "Dec 31, 2024",
    options: [
      { name: "Yes, regulation passed", odds: 41, change: "+3.4%" },
      { name: "No regulation", odds: 59, change: "-3.4%" },
    ],
    isHot: false,
    liquidity: "Low",
  },
]

const portfolioData = [
  { market: "2024 Election", position: "Democratic +$150", value: "$275", pnl: "+83%" },
  { market: "Fed Rates", position: "Rate Cut +$50", value: "$73", pnl: "+46%" },
  { market: "Tech Stocks", position: "Bearish -$25", value: "$18", pnl: "-28%" },
]

export function MarketsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Markets")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("volume")

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">📈 Prediction Markets</h1>
          <p className="text-muted-foreground">Trade on the outcomes of real-world events</p>
        </div>
        <Button className="gradient-premium text-white">
          <Target className="h-4 w-4 mr-2" />
          Create Market
        </Button>
      </div>

      {/* Portfolio Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+$318</div>
              <div className="text-sm text-muted-foreground">Total P&L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$1,247</div>
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-muted-foreground">Active Positions</div>
            </div>
          </div>
          <div className="space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{item.market}</span>
                <span className="text-muted-foreground">{item.position}</span>
                <span className="font-medium">{item.value}</span>
                <span className={`font-bold ${item.pnl.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                  {item.pnl}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search markets by event, topic, or keyword..."
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
                {marketCategories.map((category) => (
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
                <SelectItem value="volume">💰 Volume</SelectItem>
                <SelectItem value="trending">🔥 Trending</SelectItem>
                <SelectItem value="newest">🆕 Newest</SelectItem>
                <SelectItem value="ending">⏰ Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Markets Grid */}
      <div className="grid gap-6">
        {markets.map((market) => (
          <Card key={market.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{market.category}</Badge>
                    <Badge
                      variant="outline"
                      className={
                        market.liquidity === "High"
                          ? "border-green-500 text-green-700"
                          : market.liquidity === "Medium"
                            ? "border-yellow-500 text-yellow-700"
                            : "border-red-500 text-red-700"
                      }
                    >
                      {market.liquidity} Liquidity
                    </Badge>
                    {market.isHot && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl leading-tight mb-2">{market.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{market.description}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground ml-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" />
                    {market.endDate}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">{market.volume}</span>
                    <span className="text-muted-foreground">volume</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{market.participants.toLocaleString()}</span>
                    <span className="text-muted-foreground">traders</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {market.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.name}</span>
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            option.change.startsWith("+") ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {option.change.startsWith("+") ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {option.change}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold">{option.odds}%</span>
                        <Button size="sm" className="gradient-pro text-white">
                          Buy ${(option.odds / 100).toFixed(2)}
                        </Button>
                      </div>
                    </div>
                    <Progress value={option.odds} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Chart
                  </Button>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">Market closes {market.endDate}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Creation CTA */}
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Create Your Own Market</h3>
          <p className="text-muted-foreground mb-4">
            Have an idea for a prediction market? Create one and earn fees from trading activity.
          </p>
          <Button className="gradient-premium text-white">
            <Target className="h-4 w-4 mr-2" />
            Create Market
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
