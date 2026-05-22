'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CourseItem {
  courseId: string
  title: string
  cover: string | null
  totalChapters: number
  completedChapters: number
  progress: number
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/courses')
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/user" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">我的课程</h1>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">还没有购买课程</p>
          <Link href="/courses">
            <Button>去选课</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Link
              key={course.courseId}
              href={`/learn/${course.courseId}`}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              {/* 封面 */}
              <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                {course.cover ? (
                  <img src={course.cover} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{course.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  已完成 {course.completedChapters}/{course.totalChapters} 章
                </p>
                {/* 进度条 */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* 进度百分比 */}
              <div className="text-sm font-medium text-blue-600 flex-shrink-0">
                {course.progress}%
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
