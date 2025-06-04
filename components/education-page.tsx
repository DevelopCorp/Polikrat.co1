"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  Award,
  CheckCircle,
  Lock,
  Search,
  GraduationCap,
  Target,
  TrendingUp,
  Crown,
} from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Political Debate Fundamentals",
    description: "Master the basics of structured political argumentation and evidence-based reasoning",
    instructor: "Dr. Sarah Chen",
    duration: "2 hours",
    lessons: 8,
    students: 1247,
    rating: 4.8,
    level: "Beginner",
    category: "Debate Skills",
    price: "Free",
    isPremium: false,
    progress: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Advanced Argumentation Strategies",
    description: "Learn sophisticated techniques for building compelling political arguments",
    instructor: "Prof. Michael Rodriguez",
    duration: "3.5 hours",
    lessons: 12,
    students: 892,
    rating: 4.9,
    level: "Advanced",
    category: "Debate Skills",
    price: "Premium",
    isPremium: true,
    progress: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Understanding Political Systems",
    description: "Comprehensive overview of democratic institutions and governance structures",
    instructor: "Dr. Lisa Wang",
    duration: "4 hours",
    lessons: 16,
    students: 2156,
    rating: 4.7,
    level: "Intermediate",
    category: "Political Science",
    price: "Free",
    isPremium: false,
    progress: 45,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Economic Policy Analysis",
    description: "Learn to analyze and debate economic policies with data-driven approaches",
    instructor: "Dr. James Wilson",
    duration: "5 hours",
    lessons: 20,
    students: 1534,
    rating: 4.6,
    level: "Advanced",
    category: "Economics",
    price: "Premium",
    isPremium: true,
    progress: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Media Literacy & Fact-Checking",
    description: "Essential skills for evaluating sources and identifying misinformation",
    instructor: "Dr. Anna Kowalski",
    duration: "2.5 hours",
    lessons: 10,
    students: 3421,
    rating: 4.9,
    level: "Beginner",
    category: "Critical Thinking",
    price: "Free",
    isPremium: false,
    progress: 100,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "International Relations Fundamentals",
    description: "Understanding global politics, diplomacy, and international law",
    instructor: "Prof. David Kim",
    duration: "6 hours",
    lessons: 24,
    students: 987,
    rating: 4.8,
    level: "Intermediate",
    category: "International Affairs",
    price: "Premium",
    isPremium: true,
    progress: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

const achievements = [
  {
    id: 1,
    title: "Debate Novice",
    description: "Complete your first debate course",
    icon: BookOpen,
    earned: true,
    points: 100,
  },
  {
    id: 2,
    title: "Critical Thinker",
    description: "Complete the Media Literacy course",
    icon: Target,
    earned: true,
    points: 150,
  },
  {
    id: 3,
    title: "Policy Expert",
    description: "Complete 3 advanced policy courses",
    icon: GraduationCap,
    earned: false,
    points: 300,
  },
  {
    id: 4,
    title: "Master Debater",
    description: "Complete all debate skill courses",
    icon: Award,
    earned: false,
    points: 500,
  },
]

const categories = [
  "All Categories",
  "Debate Skills",
  "Political Science",
  "Economics",
  "Critical Thinking",
  "International Affairs",
]

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"]

export function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("courses")

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesLevel && matchesSearch
  })

  const completedCourses = courses.filter((course) => course.progress === 100).length
  const inProgressCourses = courses.filter((course) => course.progress > 0 && course.progress < 100).length
  const totalPoints = achievements.filter((a) => a.earned).reduce((sum, a) => sum + a.points, 0)

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">📚 Education Hub</h1>
          <p className="text-muted-foreground">Master political discourse through structured learning</p>
        </div>
        <Button className="gradient-premium text-white">
          <GraduationCap className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Learning Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-primary-brand">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pro">{completedCourses}</div>
              <div className="text-sm text-muted-foreground">Courses Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-brand">{inProgressCourses}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-premium">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Learning Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-gray">{achievements.filter((a) => a.earned).length}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses by title or topic..."
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  {course.isPremium && (
                    <Badge className="absolute top-2 right-2 gradient-premium text-white flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                  {course.progress > 0 && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>by {course.instructor}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="font-semibold text-premium">{course.price}</div>
                  </div>

                  <div className="pt-2">
                    {course.progress === 100 ? (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle className="h-4 w-4 mr-2 text-pro" />
                        Completed
                      </Button>
                    ) : course.progress > 0 ? (
                      <Button className="w-full gradient-primary text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : course.isPremium ? (
                      <Button className="w-full gradient-premium text-white">
                        <Lock className="h-4 w-4 mr-2" />
                        Unlock Premium
                      </Button>
                    ) : (
                      <Button className="w-full gradient-pro text-white">
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

        <TabsContent value="my-learning" className="space-y-6">
          <div className="grid gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Continue Learning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses
                  .filter((course) => course.progress > 0 && course.progress < 100)
                  .map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 space-y-2">
                            <h4 className="font-semibold">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            <Button size="sm" className="gradient-primary text-white">
                              <Play className="h-3 w-3 mr-1" />
                              Continue
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Completed Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses
                  .filter((course) => course.progress === 100)
                  .map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 space-y-2">
                            <h4 className="font-semibold">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-pro" />
                              <span className="text-sm text-pro font-medium">Completed</span>
                            </div>
                            <Button size="sm" variant="outline">
                              <Award className="h-3 w-3 mr-1" />
                              View Certificate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`hover:shadow-md transition-shadow ${achievement.earned ? "border-pro bg-pro-muted" : "border-muted"}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${achievement.earned ? "gradient-pro" : "bg-muted"}`}>
                      <achievement.icon
                        className={`h-6 w-6 ${achievement.earned ? "text-white" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                      <p className="text-muted-foreground mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-premium">{achievement.points} points</span>
                        </div>
                        {achievement.earned ? (
                          <Badge className="bg-pro text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Earned
                          </Badge>
                        ) : (
                          <Badge variant="outline">
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
          </div>

          {/* Achievement Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Achievement Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Overall Progress</span>
                  <span className="font-medium">
                    {achievements.filter((a) => a.earned).length} / {achievements.length}
                  </span>
                </div>
                <Progress
                  value={(achievements.filter((a) => a.earned).length / achievements.length) * 100}
                  className="h-3"
                />
                <p className="text-sm text-muted-foreground">
                  Complete more courses and participate in debates to unlock achievements and earn learning points.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Premium Upgrade CTA */}
      <Card className="border-2 border-premium bg-premium-muted">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full gradient-premium">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Unlock Premium Courses</h3>
                <p className="text-muted-foreground">
                  Access advanced courses, expert instructors, and exclusive content
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-premium">$6.99/mo</div>
              <Button className="gradient-premium text-white mt-2">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
