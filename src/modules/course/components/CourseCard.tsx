'use client'

import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import type { CourseList } from '../types'

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
  return `${mins}分钟`
}

interface CourseCardProps {
  course: CourseList
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
          {course.cover && (
            <img
              src={course.cover}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{course.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.chapterCount}节
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(course.totalDuration)}
            </span>
          </div>
          <div className="mt-3 text-xl font-bold text-red-500">
            ¥{course.price}
          </div>
        </div>
      </div>
    </Link>
  )
}
