"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTelegram } from "@/hooks/use-telegram"
import {
  Sparkles,
  Check,
  X,
  AlertCircle,
  Lightbulb,
  Search,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Link,
  BarChart3,
  Wand2,
  Loader2,
} from "lucide-react"

interface FactCheckResult {
  claim: string
  verdict: "true" | "mostly-true" | "mixed" | "mostly-false" | "false" | "unverifiable"
  explanation: string
  sources: {
    title: string
    url: string
  }[]
}

interface ArgumentSuggestion {
  id: string
  text: string
  strength: "strong" | "moderate" | "weak"
  type: "pro" | "con" | "neutral"
  sources?: {
    title: string
    url: string
  }[]
}

interface CounterArgument {
  id: string
  text: string
  targetClaim: string
  strength: "strong" | "moderate" | "weak"
  sources?: {
    title: string
    url: string
  }[]
}

interface BiasAnalysis {
  score: number // -100 to 100, negative is left, positive is right
  emotionalLanguage: number // 0-100
  factualDensity: number // 0-100
  subjectivity: number // 0-100
  fallacies: {
    type: string
    explanation: string
  }[]
}

export function AIDebateAssistant({
  debateQuestion,
  userSide,
  currentArgument,
  onUpdateArgument,
}: {
  debateQuestion: string
  userSide: "pro" | "con" | "neutral"
  currentArgument: string
  onUpdateArgument: (text: string) => void
}) {
  const { haptic } = useTelegram()
  const [selectedTab, setSelectedTab] = useState("suggestions")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [factCheckResults, setFactCheckResults] = useState<FactCheckResult[]>([])
  const [suggestions, setSuggestions] = useState<ArgumentSuggestion[]>([])
  const [counterArguments, setCounterArguments] = useState<CounterArgument[]>([])
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock data for demonstration
  const mockSuggestions: ArgumentSuggestion[] = [
    {
      id: "1",
      text: "Ukraine's NATO membership would provide crucial security guarantees under Article 5, deterring further Russian aggression and stabilizing the region.",
      strength: "strong",
      type: "pro",
      sources: [
        { title: "NATO Official Charter", url: "https://www.nato.int/charter" },
        { title: "European Security Analysis", url: "https://example.com/security" },
      ],
    },
    {
      id: "2",
      text: "Historical precedent shows that countries under immediate threat have successfully fast-tracked NATO membership, as seen with the Baltic states in 2004.",
      strength: "moderate",
      type: "pro",
      sources: [{ title: "NATO Expansion History", url: "https://example.com/nato-history" }],
    },
    {
      id: "3",
      text: "NATO membership would allow Ukraine to access advanced military training and equipment, strengthening its defensive capabilities.",
      strength: "moderate",
      type: "pro",
    },
  ]

  const mockCounterArguments: CounterArgument[] = [
    {
      id: "1",
      text: "NATO expansion eastward has historically increased tensions with Russia, potentially leading to greater regional instability rather than security.",
      targetClaim: "NATO membership would provide security",
      strength: "strong",
      sources: [
        { title: "Cold War Analysis", url: "https://example.com/cold-war" },
        { title: "Russia-NATO Relations", url: "https://example.com/relations" },
      ],
    },
    {
      id: "2",
      text: "Article 5 guarantees might not be as reliable as claimed, as they require consensus among all member states, which could be difficult to achieve in a complex conflict.",
      targetClaim: "Article 5 guarantees",
      strength: "moderate",
      sources: [{ title: "NATO Decision Making", url: "https://example.com/nato-decisions" }],
    },
  ]

  const mockFactChecks: FactCheckResult[] = [
    {
      claim: "Ukraine has met all NATO membership requirements",
      verdict: "mostly-false",
      explanation:
        "Ukraine has made progress but has not yet met all requirements, particularly regarding military interoperability, democratic institutions, and ongoing territorial disputes.",
      sources: [
        { title: "NATO Membership Action Plan", url: "https://example.com/nato-map" },
        { title: "Ukraine-NATO Commission Report", url: "https://example.com/report" },
      ],
    },
  ]

  const mockBiasAnalysis: BiasAnalysis = {
    score: 15, // slightly right-leaning
    emotionalLanguage: 45,
    factualDensity: 65,
    subjectivity: 40,
    fallacies: [
      {
        type: "Appeal to Emotion",
        explanation: "Using emotional language rather than factual evidence when discussing security threats.",
      },
      {
        type: "False Dilemma",
        explanation: "Presenting NATO membership as the only path to security, ignoring other options.",
      },
    ],
  }

  useEffect(() => {
    // Simulate loading suggestions based on the debate question and user side
    if (debateQuestion && userSide) {
      setIsGenerating(true)
      setTimeout(() => {
        setSuggestions(mockSuggestions.filter((s) => s.type === userSide || s.type === "neutral"))
        setCounterArguments(mockCounterArguments)
        setIsGenerating(false)
      }, 1500)
    }
  }, [debateQuestion, userSide])

  const handleAnalyzeArgument = () => {
    if (!currentArgument.trim()) return

    setIsAnalyzing(true)
    haptic?.light()

    // Simulate API call for analysis
    setTimeout(() => {
      setFactCheckResults(mockFactChecks)
      setBiasAnalysis(mockBiasAnalysis)
      setIsAnalyzing(false)
      haptic?.success()
    }, 2000)
  }

  const handleRefreshSuggestions = () => {
    setIsGenerating(true)
    haptic?.light()

    // Simulate API call for new suggestions
    setTimeout(() => {
      // Shuffle and slightly modify existing suggestions for demo
      const shuffled = [...mockSuggestions]
        .sort(() => 0.5 - Math.random())
        .map((s) => ({
          ...s,
          id: Math.random().toString(),
          text: s.text.replace("crucial", "essential").replace("successfully", "effectively"),
        }))
      setSuggestions(shuffled.filter((s) => s.type === userSide || s.type === "neutral"))
      setIsGenerating(false)
      haptic?.success()
    }, 1500)
  }

  const handleApplySuggestion = (suggestion: ArgumentSuggestion) => {
    onUpdateArgument(suggestion.text)
    setSelectedSuggestion(suggestion.id)
    haptic?.medium()

    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleImproveArgument = () => {
    if (!currentArgument.trim()) return

    setIsAnalyzing(true)
    haptic?.light()

    // Simulate API call for improvement
    setTimeout(() => {
      const improved =
        currentArgument
          .replace("I think", "Evidence suggests")
          .replace("maybe", "likely")
          .replace("good", "beneficial") +
        " Furthermore, historical precedent supports this position, as seen in similar geopolitical situations."

      onUpdateArgument(improved)
      setIsAnalyzing(false)
      haptic?.success()
    }, 1500)
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "true":
        return "text-pro"
      case "mostly-true":
        return "text-pro/80"
      case "mixed":
        return "text-yellow-600"
      case "mostly-false":
        return "text-con/80"
      case "false":
        return "text-con"
      default:
        return "text-muted-foreground"
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "true":
        return <Check className="h-4 w-4" />
      case "mostly-true":
        return <Check className="h-4 w-4" />
      case "mixed":
        return <AlertCircle className="h-4 w-4" />
      case "mostly-false":
        return <X className="h-4 w-4" />
      case "false":
        return <X className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "text-pro"
      case "moderate":
        return "text-yellow-600"
      case "weak":
        return "text-con"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="border-primary-brand">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary-brand" />
          AI Debate Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="suggestions" className="text-xs">
              <Lightbulb className="h-3 w-3 mr-1" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="fact-check" className="text-xs">
              <Search className="h-3 w-3 mr-1" />
              Fact Check
            </TabsTrigger>
            <TabsTrigger value="counter" className="text-xs">
              <Scale className="h-3 w-3 mr-1" />
              Counter-Args
            </TabsTrigger>
            <TabsTrigger value="bias" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              Bias Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Argument Suggestions</span>
              <Button variant="ghost" size="sm" onClick={handleRefreshSuggestions} disabled={isGenerating}>
                <RefreshCw className={`h-3 w-3 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-brand" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-3 rounded-lg border ${
                      selectedSuggestion === suggestion.id
                        ? "border-primary-brand bg-primary-brand/5"
                        : "border-muted bg-muted/50"
                    } hover:border-primary-brand transition-colors cursor-pointer`}
                    onClick={() => handleApplySuggestion(suggestion)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">{suggestion.text}</p>
                      <Badge variant="outline" className={`shrink-0 ${getStrengthColor(suggestion.strength)}`}>
                        {suggestion.strength}
                      </Badge>
                    </div>
                    {suggestion.sources && suggestion.sources.length > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Link className="h-3 w-3" />
                        <span>
                          {suggestion.sources.length} source{suggestion.sources.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                <p>Enter your debate topic to get AI-powered argument suggestions</p>
              </div>
            )}

            <div className="pt-2">
              <Button
                onClick={handleImproveArgument}
                className="w-full"
                disabled={!currentArgument.trim() || isAnalyzing}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isAnalyzing ? "Improving..." : "Improve My Argument"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="fact-check" className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fact Check Results</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAnalyzeArgument}
                disabled={!currentArgument.trim() || isAnalyzing}
              >
                <Search className={`h-3 w-3 mr-1 ${isAnalyzing ? "animate-spin" : ""}`} />
                Check Facts
              </Button>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-brand" />
              </div>
            ) : factCheckResults.length > 0 ? (
              <div className="space-y-3">
                {factCheckResults.map((result, index) => (
                  <div key={index} className="p-3 rounded-lg border border-muted bg-muted/50">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">Claim:</p>
                          <p className="text-sm">{result.claim}</p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 ${getVerdictColor(result.verdict)}`}>
                          <span className="flex items-center gap-1">
                            {getVerdictIcon(result.verdict)}
                            {result.verdict.replace("-", " ")}
                          </span>
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Explanation:</p>
                        <p className="text-sm text-muted-foreground">{result.explanation}</p>
                      </div>
                      {result.sources && result.sources.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Sources:</p>
                          <ul className="text-xs text-primary-brand space-y-1">
                            {result.sources.map((source, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <Link className="h-3 w-3" />
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {source.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <p>Enter your argument and click "Check Facts" to verify claims</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="counter" className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Potential Counter-Arguments</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAnalyzeArgument}
                disabled={!currentArgument.trim() || isAnalyzing}
              >
                <Scale className={`h-3 w-3 mr-1 ${isAnalyzing ? "animate-spin" : ""}`} />
                Analyze
              </Button>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-brand" />
              </div>
            ) : counterArguments.length > 0 ? (
              <div className="space-y-3">
                {counterArguments.map((counter) => (
                  <div key={counter.id} className="p-3 rounded-lg border border-muted bg-muted/50">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm">{counter.text}</p>
                        <Badge variant="outline" className={`shrink-0 ${getStrengthColor(counter.strength)}`}>
                          {counter.strength}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Targets:</span> {counter.targetClaim}
                      </div>
                      {counter.sources && counter.sources.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-primary-brand">
                          <Link className="h-3 w-3" />
                          <span>
                            {counter.sources.length} source{counter.sources.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Scale className="h-8 w-8 mx-auto mb-2" />
                <p>Enter your argument to see potential counter-arguments</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bias" className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bias & Quality Analysis</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAnalyzeArgument}
                disabled={!currentArgument.trim() || isAnalyzing}
              >
                <BarChart3 className={`h-3 w-3 mr-1 ${isAnalyzing ? "animate-spin" : ""}`} />
                Analyze
              </Button>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-brand" />
              </div>
            ) : biasAnalysis ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Political Bias</span>
                    <span
                      className={
                        biasAnalysis.score < -20
                          ? "text-blue-500"
                          : biasAnalysis.score > 20
                            ? "text-red-500"
                            : "text-green-500"
                      }
                    >
                      {biasAnalysis.score < -20
                        ? "Left-leaning"
                        : biasAnalysis.score > 20
                          ? "Right-leaning"
                          : "Balanced"}
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-muted-foreground" />
                    <div
                      className={`absolute top-0 bottom-0 ${
                        biasAnalysis.score < 0 ? "right-1/2" : "left-1/2"
                      } bg-${biasAnalysis.score < -20 ? "blue-500" : biasAnalysis.score > 20 ? "red-500" : "green-500"}`}
                      style={{
                        width: `${Math.abs(biasAnalysis.score) / 2}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Emotional Language</span>
                      <span>{biasAnalysis.emotionalLanguage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          biasAnalysis.emotionalLanguage > 60
                            ? "bg-con"
                            : biasAnalysis.emotionalLanguage > 30
                              ? "bg-yellow-500"
                              : "bg-pro"
                        }`}
                        style={{ width: `${biasAnalysis.emotionalLanguage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Factual Density</span>
                      <span>{biasAnalysis.factualDensity}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          biasAnalysis.factualDensity > 60
                            ? "bg-pro"
                            : biasAnalysis.factualDensity > 30
                              ? "bg-yellow-500"
                              : "bg-con"
                        }`}
                        style={{ width: `${biasAnalysis.factualDensity}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Subjectivity</span>
                      <span>{biasAnalysis.subjectivity}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          biasAnalysis.subjectivity > 60
                            ? "bg-con"
                            : biasAnalysis.subjectivity > 30
                              ? "bg-yellow-500"
                              : "bg-pro"
                        }`}
                        style={{ width: `${biasAnalysis.subjectivity}%` }}
                      />
                    </div>
                  </div>
                </div>

                {biasAnalysis.fallacies.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Potential Logical Fallacies:</p>
                    <div className="space-y-2">
                      {biasAnalysis.fallacies.map((fallacy, index) => (
                        <div key={index} className="p-2 rounded-lg bg-muted/50 text-sm">
                          <p className="font-medium text-con">{fallacy.type}</p>
                          <p className="text-xs text-muted-foreground">{fallacy.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p>Enter your argument to analyze bias and quality</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary-brand" />
            <span>AI-powered by Polikrat</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
