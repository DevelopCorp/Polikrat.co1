"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useTelegram } from "@/hooks/use-telegram"
import {
  CreditCard,
  Wallet,
  DollarSign,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Coins,
  Gift,
  Crown,
  Trophy,
} from "lucide-react"

interface PaymentMethod {
  id: string
  type: "card" | "wallet" | "telegram" | "crypto"
  name: string
  icon: React.ReactNode
  description: string
  fees: string
  processingTime: string
  available: boolean
}

interface PaymentIntegrationProps {
  type: "tournament" | "premium" | "tip" | "bet"
  amount: number
  description: string
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "telegram",
    type: "telegram",
    name: "Telegram Payments",
    icon: <Zap className="h-5 w-5" />,
    description: "Pay securely through Telegram",
    fees: "2.9% + $0.30",
    processingTime: "Instant",
    available: true,
  },
  {
    id: "card",
    type: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Visa, Mastercard, American Express",
    fees: "2.9% + $0.30",
    processingTime: "Instant",
    available: true,
  },
  {
    id: "wallet",
    type: "wallet",
    name: "Digital Wallet",
    icon: <Wallet className="h-5 w-5" />,
    description: "Apple Pay, Google Pay, PayPal",
    fees: "2.9% + $0.30",
    processingTime: "Instant",
    available: true,
  },
  {
    id: "crypto",
    type: "crypto",
    name: "Cryptocurrency",
    icon: <Coins className="h-5 w-5" />,
    description: "Bitcoin, Ethereum, USDC",
    fees: "1.5%",
    processingTime: "5-15 minutes",
    available: false,
  },
]

export function PaymentIntegration({ type, amount, description, onSuccess, onError }: PaymentIntegrationProps) {
  const { haptic, isInTelegram, user } = useTelegram()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "details" | "confirm" | "processing" | "success">("select")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const calculateFees = (method: PaymentMethod) => {
    if (method.id === "crypto") {
      return amount * 0.015
    }
    return amount * 0.029 + 0.3
  }

  const calculateTotal = (method: PaymentMethod) => {
    return amount + calculateFees(method)
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    if (!method.available) return

    setSelectedMethod(method)
    haptic?.light()

    if (method.type === "telegram" && isInTelegram) {
      // Skip details for Telegram payments
      setPaymentStep("confirm")
    } else {
      setPaymentStep("details")
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod) return

    setIsProcessing(true)
    setPaymentStep("processing")
    haptic?.medium()

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (selectedMethod.type === "telegram" && isInTelegram) {
        // Handle Telegram payment
        // In real implementation, this would use Telegram's payment API
        console.log("Processing Telegram payment")
      } else if (selectedMethod.type === "card") {
        // Handle Stripe payment
        console.log("Processing card payment with Stripe")
      } else if (selectedMethod.type === "wallet") {
        // Handle wallet payment
        console.log("Processing wallet payment")
      }

      setPaymentStep("success")
      haptic?.success()

      setTimeout(() => {
        onSuccess?.("payment_" + Date.now())
      }, 1500)
    } catch (error) {
      setIsProcessing(false)
      setPaymentStep("select")
      haptic?.error()
      onError?.(error instanceof Error ? error.message : "Payment failed")
    }
  }

  const getPaymentIcon = () => {
    switch (type) {
      case "tournament":
        return <Trophy className="h-6 w-6 text-premium" />
      case "premium":
        return <Crown className="h-6 w-6 text-premium" />
      case "tip":
        return <Gift className="h-6 w-6 text-premium" />
      case "bet":
        return <DollarSign className="h-6 w-6 text-premium" />
      default:
        return <DollarSign className="h-6 w-6 text-premium" />
    }
  }

  const getPaymentTitle = () => {
    switch (type) {
      case "tournament":
        return "Tournament Entry"
      case "premium":
        return "Premium Subscription"
      case "tip":
        return "Tip Debater"
      case "bet":
        return "Place Bet"
      default:
        return "Payment"
    }
  }

  if (paymentStep === "success") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pro/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-pro" />
          </div>
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="text-2xl font-bold text-premium mb-4">${amount.toFixed(2)}</div>
          <Badge className="bg-pro text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        </CardContent>
      </Card>
    )
  }

  if (paymentStep === "processing") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-brand/10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-brand" />
          </div>
          <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
          <p className="text-muted-foreground mb-4">Please wait while we process your payment...</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure payment processing</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Payment Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {getPaymentIcon()}
            <div>
              <CardTitle>{getPaymentTitle()}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-premium">${amount.toFixed(2)}</div>
            {selectedMethod && (
              <div className="text-sm text-muted-foreground mt-1">
                + ${calculateFees(selectedMethod).toFixed(2)} fees = ${calculateTotal(selectedMethod).toFixed(2)} total
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      {paymentStep === "select" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method)}
                disabled={!method.available}
                className={`w-full p-4 border rounded-lg text-left transition-all ${
                  method.available
                    ? "hover:border-primary-brand hover:bg-primary-brand/5 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                } ${selectedMethod?.id === method.id ? "border-primary-brand bg-primary-brand/5" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">{method.icon}</div>
                    <div>
                      <div className="font-semibold">{method.name}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{method.fees}</div>
                    <div className="text-xs text-muted-foreground">{method.processingTime}</div>
                    {!method.available && (
                      <Badge variant="outline" className="mt-1">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Payment Details */}
      {paymentStep === "details" && selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMethod.type === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Card Number</label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Expiry</label>
                    <Input
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CVC</label>
                    <Input
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Cardholder Name</label>
                  <Input
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            {selectedMethod.type === "wallet" && (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Digital Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to complete payment with your selected wallet
                </p>
              </div>
            )}

            <Button onClick={() => setPaymentStep("confirm")} className="w-full">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Confirmation */}
      {paymentStep === "confirm" && selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confirm Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span>${calculateFees(selectedMethod).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-premium">${calculateTotal(selectedMethod).toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {selectedMethod.icon}
                <span className="font-medium">{selectedMethod.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">{selectedMethod.description}</div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPaymentStep("select")} className="flex-1">
                Back
              </Button>
              <Button onClick={handlePayment} disabled={isProcessing} className="flex-1 gradient-premium text-white">
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Pay ${calculateTotal(selectedMethod).toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
