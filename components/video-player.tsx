"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Subtitles,
  MessageSquare,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTelegram } from "@/hooks/use-telegram"

interface VideoPlayerProps {
  videoUrl: string
  title: string
  duration: number
  currentTime?: number
  onProgress?: (time: number) => void
  onComplete?: () => void
  subtitles?: Array<{
    start: number
    end: number
    text: string
  }>
  chapters?: Array<{
    time: number
    title: string
    completed?: boolean
  }>
  interactive?: Array<{
    time: number
    type: "quiz" | "note" | "discussion"
    content: any
  }>
}

export function VideoPlayer({
  videoUrl,
  title,
  duration,
  currentTime = 0,
  onProgress,
  onComplete,
  subtitles = [],
  chapters = [],
  interactive = [],
}: VideoPlayerProps) {
  const { haptic, isInTelegram } = useTelegram()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVideoTime, setCurrentVideoTime] = useState(currentTime)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [quality, setQuality] = useState("720p")
  const [showInteractive, setShowInteractive] = useState<any>(null)
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set())

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const time = video.currentTime
      setCurrentVideoTime(time)
      onProgress?.(time)

      // Check for interactive elements
      const activeInteractive = interactive.find((item) => Math.abs(item.time - time) < 0.5 && !showInteractive)
      if (activeInteractive) {
        setShowInteractive(activeInteractive)
        video.pause()
        setIsPlaying(false)
        haptic?.medium()
      }

      // Mark chapters as completed
      chapters.forEach((chapter, index) => {
        if (time >= chapter.time && !completedChapters.has(index)) {
          setCompletedChapters((prev) => new Set([...prev, index]))
        }
      })
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
      haptic?.success()
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
    }
  }, [interactive, showInteractive, chapters, completedChapters, onProgress, onComplete, haptic])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
    haptic?.light()
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const time = (value[0] / 100) * duration
    video.currentTime = time
    setCurrentVideoTime(time)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
    haptic?.light()
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
    haptic?.light()
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      video.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
    haptic?.medium()
  }

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = speed
    setPlaybackSpeed(speed)
    haptic?.light()
  }

  const jumpToChapter = (time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    setCurrentVideoTime(time)
    haptic?.selection()
  }

  const getCurrentSubtitle = () => {
    return subtitles.find((sub) => currentVideoTime >= sub.start && currentVideoTime <= sub.end)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const closeInteractive = () => {
    setShowInteractive(null)
    const video = videoRef.current
    if (video && isPlaying) {
      video.play()
    }
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Subtitles Overlay */}
      {showSubtitles && getCurrentSubtitle() && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded text-center max-w-[80%]">
          {getCurrentSubtitle()?.text}
        </div>
      )}

      {/* Interactive Overlay */}
      {showInteractive && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardContent className="p-6">
              {showInteractive.type === "quiz" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Quick Quiz</h3>
                  <p className="text-muted-foreground">{showInteractive.content.question}</p>
                  <div className="space-y-2">
                    {showInteractive.content.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start"
                        onClick={() => {
                          haptic?.success()
                          closeInteractive()
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {showInteractive.type === "note" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Key Point
                  </h3>
                  <p>{showInteractive.content.text}</p>
                  <Button onClick={closeInteractive} className="w-full">
                    Continue
                  </Button>
                </div>
              )}

              {showInteractive.type === "discussion" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Discussion Point</h3>
                  <p className="text-muted-foreground">{showInteractive.content.prompt}</p>
                  <div className="flex gap-2">
                    <Button onClick={closeInteractive} className="flex-1">
                      Continue
                    </Button>
                    <Button variant="outline" onClick={closeInteractive}>
                      Join Discussion
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[(currentVideoTime / duration) * 100]}
            onValueChange={handleSeek}
            className="w-full"
            step={0.1}
          />
          <div className="flex items-center justify-between text-white text-sm">
            <span>{formatTime(currentVideoTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => skip(-10)} className="text-white hover:bg-white/20">
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => skip(10)} className="text-white hover:bg-white/20">
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={handleVolumeChange}
                className="w-20"
                step={1}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`text-white hover:bg-white/20 ${showSubtitles ? "bg-white/20" : ""}`}
            >
              <Subtitles className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => changePlaybackSpeed(0.5)}>
                  Speed: 0.5x {playbackSpeed === 0.5 && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changePlaybackSpeed(1)}>
                  Speed: 1x {playbackSpeed === 1 && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changePlaybackSpeed(1.25)}>
                  Speed: 1.25x {playbackSpeed === 1.25 && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changePlaybackSpeed(1.5)}>
                  Speed: 1.5x {playbackSpeed === 1.5 && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changePlaybackSpeed(2)}>
                  Speed: 2x {playbackSpeed === 2 && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Chapter Markers */}
      {chapters.length > 0 && (
        <div className="absolute bottom-16 left-4 right-4">
          <div className="relative h-1">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                className={`absolute w-3 h-3 rounded-full transform -translate-y-1 ${
                  completedChapters.has(index) ? "bg-pro" : "bg-white/60"
                } hover:scale-110 transition-transform`}
                style={{ left: `${(chapter.time / duration) * 100}%` }}
                onClick={() => jumpToChapter(chapter.time)}
                title={chapter.title}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
