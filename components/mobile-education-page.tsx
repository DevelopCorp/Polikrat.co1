"use client"

import { useState } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Play,
  Clock,
  Star,
  Award,
  CheckCircle,
  Lock,
  Search,
  GraduationCap,
  Crown,
  RefreshCw,
  Target,
} from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Political Debate Fundamentals",
    instructor: "Dr. Sarah Chen",
    duration: "2h",
    rating: 4.8,
    level: "Beginner",
    price: "Free",
    isPremium: false,
    progress: 0,
  },
  {
    id: 2,
    title: "Advanced Argumentation",
    instructor: "Prof. Rodriguez",
    duration: "3.5h",
    rating: 4.9,
    level: "Advanced",
    price: "Premium",
    isPremium: true,
    progress: 0,
  },
  {
    id: 3,
    title: "Political Systems",
    instructor: "Dr. Lisa Wang",
    duration: "4h",
    rating: 4.7,
    level: "Intermediate",
    price: "Free",
    isPremium: false,
    progress: 45,
  },
  {
    id: 4,
    title: "Media Literacy",
    instructor: "Dr. Anna Kowalski",
    duration: "2.5h",
    rating: 4.9,
    level: "Beginner",
    price: "Free",
    isPremium: false,
    progress: 100,
  },
]

const achievements = [
  {
    id: 1,
    title: "Debate Novice",
    description: "Complete your first course",
    icon: BookOpen,
    earned: true,
    points: 100,
  },
  {
    id: 2,
    title: "Critical Thinker",
    description: "Complete Media Literacy",
    icon: Target,
    earned: true,
    points: 150,
  },
  {
    id: 3,
    title: "Policy Expert",
    description: "Complete 3 advanced courses",
    icon: GraduationCap,
    earned: false,
    points: 300,
  },
]

export function MobileEducationPage() {
  const { haptic, setMainButton } = useTelegram()
  const [selectedTab, setSelectedTab] = useState("courses")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleTabChange = (tab: string) => {
    haptic.selection()
    setSelectedTab(tab)

    if (tab === "courses") {
      setMainButton({
        text: "Browse All Courses",
        onClick: () => {
          haptic.medium()
          console.log("Browsing all courses")
        },
        color: "#3b82f6",
      })
    }
  }

  const handleRefresh = async () => {
    haptic.light()
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    haptic.success()
  }

  const handleCourseAction = (courseId: number, action: string) => {
    haptic.medium()
    console.log(`${action} course ${courseId}`)
  }

  const completedCourses = courses.filter((course) => course.progress === 100).length
  const inProgressCourses = courses.filter((course) => course.progress > 0 && course.progress < 100).length
  const totalPoints = achievements.filter((a) => a.earned).reduce((sum, a) => sum + a.points, 0)

  return (
    <div className="p-4 space-y-4 pb-16">
      {/* Learning Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-primary-brand">
        <CardContent className="p-4">
          <h2 className="font-bold text-lg mb-3 text-center">Your Learning Journey</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-bold text-pro">{completedCourses}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary-brand">{inProgressCourses}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-xl font-bold text-premium">{totalPoints}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses" className="text-xs">
              <BookOpen className="h-4 w-4 mr-1" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="learning" className="text-xs">
              <GraduationCap className="h-4 w-4 mr-1" />
              My Learning
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">
              <Award className="h-4 w-4 mr-1" />
              Achievements
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} className="ml-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsContent value="courses" className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Course List */}
          <div className="space-y-4">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                      {course.isPremium && (
                        <Badge className="gradient-premium text-white flex items-center gap-1 text-xs">
                          <Crown className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                      {course.progress === 100 && (
                        <Badge className="bg-pro text-white flex items-center gap-1 text-xs">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <div className="font-semibold text-premium">{course.price}</div>
                  </div>

                  {/* Progress */}
                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {course.progress === 100 ? (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle className="h-4 w-4 mr-2 text-pro" />
                        Completed
                      </Button>
                    ) : course.progress > 0 ? (
                      <Button
                        className="w-full gradient-primary text-white"
                        onClick={() => handleCourseAction(course.id, "continue")}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : course.isPremium ? (
                      <Button
                        className="w-full gradient-premium text-white"
                        onClick={() => handleCourseAction(course.id, "unlock")}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Unlock Premium
                      </Button>
                    ) : (
                      <Button
                        className="w-full gradient-pro text-white"
                        onClick={() => handleCourseAction(course.id, "start")}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Course
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4 mt-4">
          {/* In Progress */}
          <div className="space-y-3">
            <h3 className="font-semibold">Continue Learning</h3>
            {courses
              .filter((course) => course.progress > 0 && course.progress < 100)
              .map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <Button size="sm" className="gradient-primary text-white w-full">
                        <Play className="h-3 w-3 mr-1" />
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Completed */}
          <div className="space-y-3">
            <h3 className="font-semibold">Completed Courses</h3>
            {courses
              .filter((course) => course.progress === 100)
              .map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle className="h-4 w-4 text-pro" />
                          <span className="text-sm text-pro font-medium">Completed</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        Certificate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`${achievement.earned ? "border-pro bg-pro-muted" : "border-muted"}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${achievement.earned ? "gradient-pro" : "bg-muted"}`}>
                    <achievement.icon
                      className={`h-5 w-5 ${achievement.earned ? "text-white" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-premium">{achievement.points} points</span>
                      {achievement.earned ? (
                        <Badge className="bg-pro text-white text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Earned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Progress Summary */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-center">Achievement Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>
                    {achievements.filter((a) => a.earned).length} / {achievements.length}
                  </span>
                </div>
                <Progress
                  value={(achievements.filter((a) => a.earned).length / achievements.length) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Premium Upgrade CTA */}
      <Card className="border-2 border-premium bg-premium-muted">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full gradient-premium">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Unlock Premium Courses</h3>
              <p className="text-sm text-muted-foreground">Access advanced content & expert instructors</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-premium">$6.99</div>
              <Button size="sm" className="gradient-premium text-white">
                Upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
