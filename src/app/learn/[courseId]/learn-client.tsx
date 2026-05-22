'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Play, CheckCircle, Lock, Clock, ClipboardList } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Chapter {
  id: string
  title: string
  videoUrl: string
  duration: number
  sortOrder: number
  freePreview: boolean
}

interface CourseData {
  id: string
  title: string
  chapters: Chapter[]
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function LearnClient({ course }: { course: CourseData }) {
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(
    course.chapters[0] || null
  )
  const [progress, setProgress] = useState<Record<string, { watchedSec: number; completed: boolean }>>({})
  const [token, setToken] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    setToken(t)
  }, [])

  // Load progress for current chapter
  useEffect(() => {
    if (!currentChapter || !token) return

    const loadProgress = async () => {
      try {
        const res = await fetch(`/api/progress/${currentChapter.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setProgress((prev) => ({
            ...prev,
            [currentChapter.id]: data,
          }))

          // Resume from last position
          if (videoRef.current && data.watchedSec > 0) {
            videoRef.current.currentTime = data.watchedSec
          }
        }
      } catch {}
    }
    loadProgress()
  }, [currentChapter, token])

  // Save progress periodically
  useEffect(() => {
    if (!currentChapter || !token || !videoRef.current) return

    const video = videoRef.current
    const interval = setInterval(() => {
      if (video.paused || video.ended) return

      fetch(`/api/progress/${currentChapter.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          watchedSec: Math.floor(video.currentTime),
          completed: video.currentTime >= video.duration * 0.9,
        }),
      }).catch(() => {})
    }, 10000) // Save every 10 seconds

    return () => clearInterval(interval)
  }, [currentChapter, token])

  const handleChapterComplete = async (chapterId: string) => {
    if (!token) return
    await fetch(`/api/progress/${chapterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: true }),
    })
    setProgress((prev) => ({
      ...prev,
      [chapterId]: { ...prev[chapterId], completed: true },
    }))
  }

  const handleVideoEnded = () => {
    if (currentChapter) {
      handleChapterComplete(currentChapter.id)
      // Auto-advance to next chapter
      const currentIndex = course.chapters.findIndex((c) => c.id === currentChapter.id)
      if (currentIndex < course.chapters.length - 1) {
        setCurrentChapter(course.chapters[currentIndex + 1])
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-3">
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {currentChapter?.videoUrl ? (
              <video
                ref={videoRef}
                key={currentChapter.id}
                src={currentChapter.videoUrl}
                controls
                className="w-full h-full"
                onEnded={handleVideoEnded}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">视频暂未上传</p>
                  <p className="text-sm text-gray-400">请联系管理员上传课程视频</p>
                </div>
              </div>
            )}
          </div>

          {/* Chapter Info */}
          {currentChapter && (
            <div className="mb-4">
              <h1 className="text-xl font-bold mb-2">{currentChapter.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(currentChapter.duration)}
                </span>
                {currentChapter.freePreview && (
                  <Badge variant="outline" className="text-green-600">
                    免费试看
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Course Title */}
          <h2 className="text-lg font-semibold text-gray-700">{course.title}</h2>
        </div>

        {/* Chapter Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-white overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold">课程目录</h3>
              <p className="text-xs text-gray-400 mt-1">
                {course.chapters.length}节课程
              </p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {course.chapters.map((chapter, index) => {
                const isActive = currentChapter?.id === chapter.id
                const isCompleted = progress[chapter.id]?.completed
                const isLocked = !chapter.freePreview && !token

                return (
                  <button
                    key={chapter.id}
                    onClick={() => !isLocked && setCurrentChapter(chapter)}
                    disabled={isLocked}
                    className={`w-full text-left p-4 border-b last:border-b-0 transition-colors ${
                      isActive
                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                        : isLocked
                        ? 'bg-gray-50 opacity-60 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : isLocked ? (
                          <Lock className="h-5 w-5 text-gray-300" />
                        ) : isActive ? (
                          <Play className="h-5 w-5 text-blue-600" />
                        ) : (
                          <span className="text-sm text-gray-400">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-blue-600' : ''}`}>
                          {chapter.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDuration(chapter.duration)}
                        </p>
                        {!isLocked && (
                          <Link
                            href={`/learn/${courseId}/practice?chapter=${chapter.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-1"
                          >
                            <ClipboardList className="h-3 w-3" />
                            做练习
                          </Link>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
