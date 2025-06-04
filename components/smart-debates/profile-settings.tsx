"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTelegram } from "@/hooks/use-telegram"
import {
  User,
  Settings,
  Bell,
  Shield,
  Wallet,
  LogOut,
  Upload,
  Trash2,
  Save,
  MessageSquare,
  Crown,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface UserProfile {
  id: string
  username: string
  displayName: string
  email: string
  bio: string
  avatar?: string
  location?: string
  joinDate: Date
  isPremium: boolean
  politicalLean: "left" | "center-left" | "center" | "center-right" | "right" | "undisclosed"
  expertise: string[]
  debateStats: {
    participated: number
    won: number
    lost: number
    persuasionRate: number
  }
  tournamentStats: {
    participated: number
    won: number
    earnings: number
  }
  xp: number
  level: number
  badges: {
    id: string
    name: string
    description: string
    icon: string
    earned: Date
  }[]
  settings: {
    notifications: {
      debates: boolean
      tournaments: boolean
      mentions: boolean
      news: boolean
      marketing: boolean
    }
    privacy: {
      profileVisibility: "public" | "registered" | "private"
      showPoliticalLean: boolean
      showActivity: boolean
      allowDirectMessages: boolean
    }
    debates: {
      autoJoinSimilar: boolean
      receiveArgumentSuggestions: boolean
      factCheckEnabled: boolean
      aiAssistanceLevel: "none" | "minimal" | "moderate" | "extensive"
    }
  }
}

const mockUserProfile: UserProfile = {
  id: "user123",
  username: "politicalanalyst",
  displayName: "Political Analyst",
  email: "analyst@example.com",
  bio: "Political science researcher with focus on European policy and international relations. Passionate about evidence-based debate and democratic discourse.",
  avatar: "/placeholder.svg?height=200&width=200",
  location: "Brussels, Belgium",
  joinDate: new Date("2023-05-15"),
  isPremium: true,
  politicalLean: "center",
  expertise: ["EU Policy", "International Relations", "Economic Policy"],
  debateStats: {
    participated: 47,
    won: 32,
    lost: 12,
    persuasionRate: 8.4,
  },
  tournamentStats: {
    participated: 5,
    won: 2,
    earnings: 350,
  },
  xp: 2847,
  level: 12,
  badges: [
    {
      id: "badge1",
      name: "Master Debater",
      description: "Won 25+ debates",
      icon: "🏆",
      earned: new Date("2023-08-10"),
    },
    {
      id: "badge2",
      name: "Persuasive Voice",
      description: "Changed 50+ opinions",
      icon: "🎯",
      earned: new Date("2023-09-22"),
    },
    {
      id: "badge3",
      name: "Tournament Champion",
      description: "Won a premium tournament",
      icon: "👑",
      earned: new Date("2023-10-05"),
    },
  ],
  settings: {
    notifications: {
      debates: true,
      tournaments: true,
      mentions: true,
      news: false,
      marketing: false,
    },
    privacy: {
      profileVisibility: "public",
      showPoliticalLean: true,
      showActivity: true,
      allowDirectMessages: true,
    },
    debates: {
      autoJoinSimilar: false,
      receiveArgumentSuggestions: true,
      factCheckEnabled: true,
      aiAssistanceLevel: "moderate",
    },
  },
}

export function ProfileSettings() {
  const { haptic, user: telegramUser } = useTelegram()
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile)
  const [selectedTab, setSelectedTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  useEffect(() => {
    // If we have a Telegram user, we could merge that data with our profile
    if (telegramUser) {
      setProfile((prev) => ({
        ...prev,
        displayName: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ""),
        avatar: telegramUser.photo_url || prev.avatar,
      }))
    }
  }, [telegramUser])

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfile((prev) => ({ ...prev, ...editedProfile }))
      setSaveStatus("saving")

      // Simulate API call
      setTimeout(() => {
        setSaveStatus("success")
        setTimeout(() => setSaveStatus("idle"), 2000)
      }, 1000)
    }

    setIsEditing(!isEditing)
    haptic?.light()
  }

  const handleInputChange = (field: string, value: any) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [category]: {
          ...prev.settings[category as keyof typeof prev.settings],
          [setting]: value,
        },
      },
    }))
    haptic?.light()
  }

  const calculateLevelProgress = () => {
    const xpForCurrentLevel = profile.level * 200
    const xpForNextLevel = (profile.level + 1) * 200
    const xpInCurrentLevel = profile.xp - xpForCurrentLevel
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel
    return (xpInCurrentLevel / xpNeededForNextLevel) * 100
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card className={profile.isPremium ? "border-premium bg-premium/5" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary-brand">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{profile.displayName}</CardTitle>
                  {profile.isPremium && (
                    <Badge className="gradient-premium text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <CardDescription>@{profile.username}</CardDescription>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <Badge variant="outline">Level {profile.level}</Badge>
                  <span className="text-muted-foreground">{profile.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
            <Button onClick={handleEditToggle} variant={isEditing ? "default" : "outline"}>
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* XP Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to Level {profile.level + 1}</span>
              <span>{Math.round(calculateLevelProgress())}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary-brand h-2 rounded-full transition-all duration-500"
                style={{ width: `${calculateLevelProgress()}%` }}
              />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary-brand">{profile.debateStats.participated}</div>
              <div className="text-xs text-muted-foreground">Debates</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-pro">{profile.debateStats.won}</div>
              <div className="text-xs text-muted-foreground">Wins</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-premium">${profile.tournamentStats.earnings}</div>
              <div className="text-xs text-muted-foreground">Earnings</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary-brand">{profile.debateStats.persuasionRate}%</div>
              <div className="text-xs text-muted-foreground">Persuasion Rate</div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                title={badge.description}
              >
                <span className="text-lg">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="debates" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Debates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={isEditing ? editedProfile.displayName || profile.displayName : profile.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={isEditing ? editedProfile.username || profile.username : profile.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedProfile.email || profile.email : profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={isEditing ? editedProfile.location || profile.location || "" : profile.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={isEditing ? editedProfile.bio || profile.bio : profile.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="politicalLean">Political Leaning</Label>
                <Select
                  value={profile.politicalLean}
                  onValueChange={(value) => handleInputChange("politicalLean", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="politicalLean">
                    <SelectValue placeholder="Select your political leaning" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center-left">Center-Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="center-right">Center-Right</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="undisclosed">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Expertise</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map((item, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {item}
                      {isEditing && (
                        <button
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            const newExpertise = [...profile.expertise]
                            newExpertise.splice(index, 1)
                            setProfile({ ...profile, expertise: newExpertise })
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const expertise = prompt("Add expertise:")
                        if (expertise && !profile.expertise.includes(expertise)) {
                          setProfile({
                            ...profile,
                            expertise: [...profile.expertise, expertise],
                          })
                        }
                      }}
                    >
                      + Add
                    </Button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm" className="text-con">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-premium" />
                  <div>
                    <h3 className="font-semibold">Premium Membership</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile.isPremium ? "Active until Dec 15, 2023" : "Upgrade for exclusive features"}
                    </p>
                  </div>
                </div>
                <Button className={profile.isPremium ? "gradient-premium text-white" : ""}>
                  {profile.isPremium ? "Manage" : "Upgrade"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">Manage your payment options</p>
                  </div>
                </div>
                <Button variant="outline">Manage</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-con" />
                  <div>
                    <h3 className="font-semibold">Password</h3>
                    <p className="text-sm text-muted-foreground">Change your password</p>
                  </div>
                </div>
                <Button variant="outline">Change</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-con" />
                  <div>
                    <h3 className="font-semibold">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">Log out of your account</p>
                  </div>
                </div>
                <Button variant="outline" className="text-con">
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debates-notification">Debate Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about debates you're participating in
                    </p>
                  </div>
                  <Switch
                    id="debates-notification"
                    checked={profile.settings.notifications.debates}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "debates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tournaments-notification">Tournament Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about tournaments you've entered
                    </p>
                  </div>
                  <Switch
                    id="tournaments-notification"
                    checked={profile.settings.notifications.tournaments}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "tournaments", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mentions-notification">Mentions & Replies</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when someone mentions or replies to you
                    </p>
                  </div>
                  <Switch
                    id="mentions-notification"
                    checked={profile.settings.notifications.mentions}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "mentions", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="news-notification">News Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about breaking news and betting opportunities
                    </p>
                  </div>
                  <Switch
                    id="news-notification"
                    checked={profile.settings.notifications.news}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "news", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-notification">Marketing & Promotions</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and special offers
                    </p>
                  </div>
                  <Switch
                    id="marketing-notification"
                    checked={profile.settings.notifications.marketing}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "marketing", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select
                    value={profile.settings.privacy.profileVisibility}
                    onValueChange={(value) =>
                      handleSettingChange("privacy", "profileVisibility", value as "public" | "registered" | "private")
                    }
                  >
                    <SelectTrigger id="profile-visibility">
                      <SelectValue placeholder="Who can see your profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public (Everyone)</SelectItem>
                      <SelectItem value="registered">Registered Users Only</SelectItem>
                      <SelectItem value="private">Private (Only You)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-political-lean">Show Political Leaning</Label>
                    <p className="text-sm text-muted-foreground">Display your political leaning on your profile</p>
                  </div>
                  <Switch
                    id="show-political-lean"
                    checked={profile.settings.privacy.showPoliticalLean}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "showPoliticalLean", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-activity">Show Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your recent debates and activities on your profile
                    </p>
                  </div>
                  <Switch
                    id="show-activity"
                    checked={profile.settings.privacy.showActivity}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "showActivity", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-messages">Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Let other users send you direct messages</p>
                  </div>
                  <Switch
                    id="allow-messages"
                    checked={profile.settings.privacy.allowDirectMessages}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "allowDirectMessages", checked)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="text-con">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Debate Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-join">Auto-join Similar Debates</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically join debates on topics you've engaged with before
                    </p>
                  </div>
                  <Switch
                    id="auto-join"
                    checked={profile.settings.debates.autoJoinSimilar}
                    onCheckedChange={(checked) => handleSettingChange("debates", "autoJoinSimilar", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="argument-suggestions">Receive Argument Suggestions</Label>
                    <p className="text-sm text-muted-foreground">Get AI-powered suggestions for your arguments</p>
                  </div>
                  <Switch
                    id="argument-suggestions"
                    checked={profile.settings.debates.receiveArgumentSuggestions}
                    onCheckedChange={(checked) => handleSettingChange("debates", "receiveArgumentSuggestions", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="fact-check">Enable Fact-Checking</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically fact-check your arguments before posting
                    </p>
                  </div>
                  <Switch
                    id="fact-check"
                    checked={profile.settings.debates.factCheckEnabled}
                    onCheckedChange={(checked) => handleSettingChange("debates", "factCheckEnabled", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-assistance">AI Assistance Level</Label>
                  <Select
                    value={profile.settings.debates.aiAssistanceLevel}
                    onValueChange={(value) =>
                      handleSettingChange(
                        "debates",
                        "aiAssistanceLevel",
                        value as "none" | "minimal" | "moderate" | "extensive",
                      )
                    }
                  >
                    <SelectTrigger id="ai-assistance">
                      <SelectValue placeholder="Select AI assistance level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="minimal">Minimal (Grammar & Spelling)</SelectItem>
                      <SelectItem value="moderate">Moderate (Suggestions & Fact-Checking)</SelectItem>
                      <SelectItem value="extensive">Extensive (Full Argument Assistance)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Status Indicator */}
      {saveStatus !== "idle" && (
        <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-background border">
          {saveStatus === "saving" && (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-primary-brand border-t-transparent rounded-full" />
              <span>Saving changes...</span>
            </div>
          )}
          {saveStatus === "success" && (
            <div className="flex items-center gap-2 text-pro">
              <CheckCircle className="h-4 w-4" />
              <span>Changes saved successfully!</span>
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center gap-2 text-con">
              <AlertCircle className="h-4 w-4" />
              <span>Error saving changes. Please try again.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
