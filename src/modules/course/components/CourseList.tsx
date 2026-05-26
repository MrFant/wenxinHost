'use client'

import { CourseCard } from './CourseCard'
import type { CourseList as CourseListType } from '../types'

interface CourseListProps {
  courses: CourseListType[]
}

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无课程
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
