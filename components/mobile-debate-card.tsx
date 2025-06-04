"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTelegram } from "@/hooks/use-telegram"
import { Clock, Users, DollarSign, ThumbsUp, ThumbsDown, Share, Bookmark, Flame, Crown } from "lucide-react"

interface MobileDebateCardProps {
  debate: {
    id: number
    title: string
    category: string
    participants: number
    timeLeft: string
    proVotes: number
    conVotes: number
    prize: string
    entryFee: string
    isHot: boolean
    isPremium: boolean
  }
}

export function MobileDebateCard({ debate }: MobileDebateCardProps) {
  const { haptic, setMainButton, hideMainButton } = useTelegram()
  const [selectedSide, setSelectedSide] = useState<"pro" | "con" | null>(null)

  const handleSideSelection = (side: "pro" | "con") => {
    haptic.selection()
    setSelectedSide(side)

    setMainButton({
      text: `Join ${side.toUpperCase()} - ${debate.entryFee}`,
      onClick: () => {
        haptic.success()
        // Handle debate joining logic
        console.log(`Joining ${side} side of debate ${debate.id}`)
      },
      color: side === "pro" ? "#22c55e" : "#ef4444",
      isActive: true,
    })
  }

  const handleShare = () => {
    haptic.light()
    // Telegram sharing logic
    console.log("Sharing debate:", debate.title)
  }

  const handleBookmark = () => {
    haptic.light()
    // Bookmark logic
    console.log("Bookmarking debate:", debate.id)
  }

  return (
    <Card className="mx-4 mb-4 overflow-hidden">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {debate.category}
            </Badge>
            {debate.isHot && (
              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                <Flame className="h-3 w-3" />
                Hot
              </Badge>
            )}
            {debate.isPremium && (
              <Badge className="gradient-premium text-white flex items-center gap-1 text-xs">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>

          <h3 className="font-bold text-lg leading-tight">{debate.title}</h3>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{debate.timeLeft}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{debate.participants.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-premium">
            <DollarSign className="h-4 w-4" />
            <span>{debate.prize}</span>
          </div>
        </div>

        {/* Voting Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-pro" />
              <span className="text-pro font-medium">PRO {debate.proVotes}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-con font-medium">CON {debate.conVotes}%</span>
              <ThumbsDown className="h-4 w-4 text-con" />
            </div>
          </div>
          <Progress value={debate.proVotes} className="h-3" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={selectedSide === "pro" ? "default" : "outline"}
              className={`${selectedSide === "pro" ? "gradient-pro text-white" : "border-pro text-pro"} h-12`}
              onClick={() => handleSideSelection("pro")}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Join PRO
            </Button>
            <Button
              variant={selectedSide === "con" ? "default" : "outline"}
              className={`${selectedSide === "con" ? "gradient-con text-white" : "border-con text-con"} h-12`}
              onClick={() => handleSideSelection("con")}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Join CON
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Entry fee: <span className="font-medium text-premium">{debate.entryFee}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBookmark}>
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
