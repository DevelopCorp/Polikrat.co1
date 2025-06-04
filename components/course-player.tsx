"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/video-player"
import { useTelegram } from "@/hooks/use-telegram"
import {
  Play,
  CheckCircle,
  Lock,
  BookOpen,
  MessageSquare,
  Download,
  Share,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Star,
  FileText,
  Link,
  Award,
} from "lucide-react"

interface CoursePlayerProps {
  courseId: string
  onComplete?: () => void
  onProgress?: (lessonId: string, progress: number) => void
}

const courseData = {
  id: "1",
  title: "Political Debate Fundamentals",
  instructor: "Dr. Sarah Chen",
  description: "Master the basics of structured political argumentation and evidence-based reasoning",
  duration: "2 hours",
  totalLessons: 8,
  completedLessons: 3,
  rating: 4.8,
  students: 1247,
  lessons: [
    {
      id: "1",
      title: "Introduction to Political Debate",
      duration: 900, // 15 minutes in seconds
      videoUrl: "/placeholder-video.mp4",
      completed: true,
      locked: false,
      description: "Overview of political debate structure and importance in democratic discourse",
      resources: [
        { type: "pdf", title: "Debate Structure Guide", url: "#" },
        { type: "link", title: "Additional Reading", url: "#" },
      ],
      chapters: [
        { time: 0, title: "Welcome & Overview" },
        { time: 300, title: "What is Political Debate?" },
        { time: 600, title: "Key Components" },
      ],
      interactive: [
        {
          time: 450,
          type: "quiz",
          content: {
            question: "What are the three main components of a political argument?",
            options: [
              "Claim, Evidence, Warrant",
              "Thesis, Body, Conclusion",
              "Pro, Con, Neutral",
              "Facts, Opinions, Bias",
            ],
            correct: 0,
          },
        },
        {
          time: 750,
          type: "note",
          content: {
            text: "Remember: A strong political argument always includes credible evidence from reliable sources.",
          },
        },
      ],
      subtitles: [
        { start: 0, end: 30, text: "Welcome to Political Debate Fundamentals" },
        { start: 30, end: 60, text: "In this course, we'll explore the art of political argumentation" },
        // More subtitles...
      ],
    },
    {
      id: "2",
      title: "Building Strong Arguments",
      duration: 1200, // 20 minutes
      videoUrl: "/placeholder-video.mp4",
      completed: true,
      locked: false,
      description: "Learn how to construct compelling and logical political arguments",
      resources: [
        { type: "pdf", title: "Argument Framework", url: "#" },
        { type: "worksheet", title: "Practice Exercises", url: "#" },
      ],
      chapters: [
        { time: 0, title: "Argument Structure" },
        { time: 400, title: "Evidence Types" },
        { time: 800, title: "Common Fallacies" },
      ],
      interactive: [
        {
          time: 600,
          type: "discussion",
          content: {
            prompt: "Can you identify a logical fallacy in this example argument?",
          },
        },
      ],
      subtitles: [],
    },
    {
      id: "3",
      title: "Research and Evidence",
      duration: 1080, // 18 minutes
      videoUrl: "/placeholder-video.mp4",
      completed: true,
      locked: false,
      description: "Master the art of finding and evaluating credible sources for political arguments",
      resources: [
        { type: "pdf", title: "Source Evaluation Checklist", url: "#" },
        { type: "link", title: "Fact-Checking Resources", url: "#" },
      ],
      chapters: [
        { time: 0, title: "Source Types" },
        { time: 360, title: "Credibility Assessment" },
        { time: 720, title: "Fact-Checking" },
      ],
      interactive: [],
      subtitles: [],
    },
    {
      id: "4",
      title: "Counterarguments and Rebuttals",
      duration: 960, // 16 minutes
      videoUrl: "/placeholder-video.mp4",
      completed: false,
      locked: false,
      description: "Learn to anticipate and effectively respond to opposing viewpoints",
      resources: [{ type: "pdf", title: "Rebuttal Strategies", url: "#" }],
      chapters: [
        { time: 0, title: "Understanding Opposition" },
        { time: 320, title: "Rebuttal Techniques" },
        { time: 640, title: "Strengthening Your Position" },
      ],
      interactive: [
        {
          time: 480,
          type: "quiz",
          content: {
            question: "What is the most effective way to address a counterargument?",
            options: [
              "Ignore it completely",
              "Acknowledge and refute with evidence",
              "Attack the person making it",
              "Change the subject",
            ],
            correct: 1,
          },
        },
      ],
      subtitles: [],
    },
    {
      id: "5",
      title: "Presentation and Delivery",
      duration: 840, // 14 minutes
      videoUrl: "/placeholder-video.mp4",
      completed: false,
      locked: false,
      description: "Master the art of presenting your arguments effectively",
      resources: [],
      chapters: [],
      interactive: [],
      subtitles: [],
    },
    {
      id: "6",
      title: "Ethics in Political Debate",
      duration: 720, // 12 minutes
      videoUrl: "/placeholder-video.mp4",
      completed: false,
      locked: true,
      description: "Understanding ethical boundaries and responsible argumentation",
      resources: [],
      chapters: [],
      interactive: [],
      subtitles: [],
    },
    {
      id: "7",
      title: "Advanced Techniques",
      duration: 1440, // 24 minutes
      videoUrl: "/placeholder-video.mp4",
      completed: false,
      locked: true,
      description: "Advanced strategies for complex political discussions",
      resources: [],
      chapters: [],
      interactive: [],
      subtitles: [],
    },
    {
      id: "8",
      title: "Final Assessment",
      duration: 600, // 10 minutes
      videoUrl: "/placeholder-video.mp4",
      completed: false,
      locked: true,
      description: "Put your skills to the test with a comprehensive assessment",
      resources: [],
      chapters: [],
      interactive: [],
      subtitles: [],
    },
  ],
}

export function CoursePlayer({ courseId, onComplete, onProgress }: CoursePlayerProps) {
  const { haptic, setMainButton, hideMainButton } = useTelegram()
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [selectedTab, setSelectedTab] = useState("video")
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({})
  const [bookmarked, setBookmarked] = useState(false)

  const currentLesson = courseData.lessons[currentLessonIndex]
  const canGoNext = currentLessonIndex < courseData.lessons.length - 1
  const canGoPrev = currentLessonIndex > 0

  useEffect(() => {
    if (currentLesson?.completed) {
      setMainButton({
        text: canGoNext ? "Next Lesson" : "Complete Course",
        onClick: () => {
          if (canGoNext) {
            goToNextLesson()
          } else {
            onComplete?.()
          }
        },
        color: "#22c55e",
      })
    } else {
      hideMainButton()
    }
  }, [currentLessonIndex, currentLesson, canGoNext, onComplete, setMainButton, hideMainButton])

  const goToNextLesson = () => {
    if (canGoNext) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      haptic?.success()
    }
  }

  const goToPrevLesson = () => {
    if (canGoPrev) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      haptic?.light()
    }
  }

  const handleVideoProgress = (time: number) => {
    const progress = (time / currentLesson.duration) * 100
    setLessonProgress((prev) => ({
      ...prev,
      [currentLesson.id]: progress,
    }))
    onProgress?.(currentLesson.id, progress)
  }

  const handleVideoComplete = () => {
    // Mark lesson as completed
    currentLesson.completed = true
    setLessonProgress((prev) => ({
      ...prev,
      [currentLesson.id]: 100,
    }))
    haptic?.success()

    // Unlock next lesson if it exists
    if (canGoNext) {
      courseData.lessons[currentLessonIndex + 1].locked = false
    }
  }

  const jumpToLesson = (index: number) => {
    const lesson = courseData.lessons[index]
    if (!lesson.locked) {
      setCurrentLessonIndex(index)
      haptic?.selection()
    }
  }

  const toggleBookmark = () => {
    setBookmarked(!bookmarked)
    haptic?.light()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{courseData.title}</CardTitle>
              <p className="text-muted-foreground mb-3">{courseData.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{courseData.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{courseData.duration}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleBookmark}>
                <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Lesson Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{currentLesson.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Lesson {currentLessonIndex + 1} of {courseData.totalLessons} •{" "}
                    {formatDuration(currentLesson.duration)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToPrevLesson} disabled={!canGoPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextLesson} disabled={!canGoNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {lessonProgress[currentLesson.id] > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(lessonProgress[currentLesson.id] || 0)}%</span>
                  </div>
                  <Progress value={lessonProgress[currentLesson.id] || 0} className="h-2" />
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Video Player */}
          {!currentLesson.locked ? (
            <VideoPlayer
              videoUrl={currentLesson.videoUrl}
              title={currentLesson.title}
              duration={currentLesson.duration}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
              subtitles={currentLesson.subtitles}
              chapters={currentLesson.chapters}
              interactive={currentLesson.interactive}
            />
          ) : (
            <Card className="aspect-video flex items-center justify-center bg-muted">
              <div className="text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Lesson Locked</h3>
                <p className="text-muted-foreground">Complete previous lessons to unlock this content</p>
              </div>
            </Card>
          )}

          {/* Lesson Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="video">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">About This Lesson</h3>
                  <p className="text-muted-foreground mb-4">{currentLesson.description}</p>

                  {currentLesson.chapters.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Chapters</h4>
                      <div className="space-y-2">
                        {currentLesson.chapters.map((chapter, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                            <span className="text-sm">{chapter.title}</span>
                            <span className="text-xs text-muted-foreground">{formatDuration(chapter.time)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Lesson Resources</h3>
                  {currentLesson.resources.length > 0 ? (
                    <div className="space-y-3">
                      {currentLesson.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
                          {resource.type === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                          {resource.type === "link" && <Link className="h-5 w-5 text-blue-500" />}
                          {resource.type === "worksheet" && <BookOpen className="h-5 w-5 text-green-500" />}
                          <div className="flex-1">
                            <h4 className="font-medium">{resource.title}</h4>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No additional resources for this lesson.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussion" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Lesson Discussion</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-brand text-white flex items-center justify-center text-sm font-medium">
                          JD
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">John Doe</span>
                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                          </div>
                          <p className="text-sm">
                            Great explanation of argument structure! The examples really helped clarify the concepts.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Your Notes</h3>
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-32 p-3 border rounded-lg resize-none"
                      placeholder="Take notes about this lesson..."
                    />
                    <Button>Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Course Navigation */}
        <div className="space-y-6">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Progress</span>
                  <span className="text-sm font-medium">
                    {courseData.completedLessons} / {courseData.totalLessons}
                  </span>
                </div>
                <Progress value={(courseData.completedLessons / courseData.totalLessons) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {courseData.totalLessons - courseData.completedLessons} lessons remaining
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lesson List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lessons</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {courseData.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => jumpToLesson(index)}
                    disabled={lesson.locked}
                    className={`w-full p-3 text-left hover:bg-muted transition-colors ${
                      index === currentLessonIndex ? "bg-primary-brand/10 border-r-2 border-primary-brand" : ""
                    } ${lesson.locked ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5 text-pro" />
                        ) : lesson.locked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Play className="h-5 w-5 text-primary-brand" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{lesson.title}</h4>
                        <p className="text-xs text-muted-foreground">{formatDuration(lesson.duration)}</p>
                        {lessonProgress[lesson.id] > 0 && lessonProgress[lesson.id] < 100 && (
                          <Progress value={lessonProgress[lesson.id]} className="h-1 mt-1" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certificate */}
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-premium" />
              <h3 className="font-semibold mb-2">Course Certificate</h3>
              <p className="text-sm text-muted-foreground mb-4">Complete all lessons to earn your certificate</p>
              <Button disabled className="w-full">
                <Award className="h-4 w-4 mr-2" />
                Get Certificate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
