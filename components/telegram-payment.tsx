"use client"

import { useState } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, CreditCard, Zap } from "lucide-react"

interface TelegramPaymentProps {
  amount: number
  currency: string
  description: string
  payload: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function TelegramPayment({ amount, currency, description, payload, onSuccess, onError }: TelegramPaymentProps) {
  const { isInTelegram, haptic, showAlert } = useTelegram()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    if (!isInTelegram) {
      showAlert("Payments are only available in Telegram")
      return
    }

    haptic.light()
    setIsProcessing(true)

    try {
      // Telegram payment integration would go here
      // For now, simulate payment process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      haptic.success()
      onSuccess?.()
    } catch (error) {
      haptic.error()
      onError?.(error instanceof Error ? error.message : "Payment failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="border-2 border-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-premium" />
          Premium Upgrade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-premium mb-2">
            {currency === "USD" ? "$" : ""}
            {(amount / 100).toFixed(2)}
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-premium" />
            <span className="text-sm">Advanced Analytics Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-premium" />
            <span className="text-sm">Exclusive Premium Debates</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-premium" />
            <span className="text-sm">Ad-free Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-premium" />
            <span className="text-sm">Priority Customer Support</span>
          </div>
        </div>

        <Button className="w-full gradient-premium text-white h-12" onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay with Telegram
            </>
          )}
        </Button>

        {isInTelegram && (
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              Secure payment via Telegram
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
