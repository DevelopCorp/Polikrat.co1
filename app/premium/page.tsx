"use client"

import { useTelegram } from "@/hooks/use-telegram"
import { MobileLayout } from "@/components/mobile-layout"
import { TelegramPayment } from "@/components/telegram-payment"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, BarChart3, Zap, Shield, Star } from "lucide-react"

export default function PremiumPage() {
  const { isInTelegram, user, haptic } = useTelegram()

  const handlePaymentSuccess = () => {
    haptic.success()
    console.log("Payment successful!")
  }

  const handlePaymentError = (error: string) => {
    haptic.error()
    console.error("Payment error:", error)
  }

  const content = (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-premium flex items-center justify-center">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Polikrat Premium</h1>
        <p className="text-muted-foreground">Unlock advanced features and exclusive content</p>
      </div>

      {/* Current Plan */}
      {user && (
        <Card className="border-2 border-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Current Plan</h3>
                <p className="text-sm text-muted-foreground">Free Tier</p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Comparison */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center">Premium Features</h2>

        <div className="grid gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-premium" />
                <div>
                  <h3 className="font-semibold">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">Deep insights into political sentiment and trends</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-premium" />
                <div>
                  <h3 className="font-semibold">Exclusive Debates</h3>
                  <p className="text-sm text-muted-foreground">Access to premium-only political discussions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-premium" />
                <div>
                  <h3 className="font-semibold">Ad-Free Experience</h3>
                  <p className="text-sm text-muted-foreground">Enjoy uninterrupted political discourse</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-premium" />
                <div>
                  <h3 className="font-semibold">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">Get help faster with premium support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-premium" />
                <div>
                  <h3 className="font-semibold">Early Access</h3>
                  <p className="text-sm text-muted-foreground">Be first to try new features and debates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Component */}
      <TelegramPayment
        amount={699} // $6.99 in cents
        currency="USD"
        description="Monthly Premium Subscription"
        payload="premium_monthly"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      {/* Testimonials */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-4xl mb-2">⭐⭐⭐⭐⭐</div>
            <p className="text-sm italic mb-2">
              "Premium analytics helped me understand political trends better than any other platform."
            </p>
            <p className="text-xs text-muted-foreground">- Sarah M., Political Analyst</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (isInTelegram) {
    return <MobileLayout currentPath="/premium">{content}</MobileLayout>
  }

  return content
}
