'use client'

import { useState, useEffect } from 'react'
import { CourseList } from '@/modules/course'
import type { CourseListType } from '@/modules/course'

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses')
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
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">课程中心</h1>
      <CourseList courses={courses} />
    </div>
  )
}
