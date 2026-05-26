import { notFound } from 'next/navigation'
import { CourseDetail } from '@/modules/course'
import type { CourseData } from '@/modules/course'

async function getCourse(id: string): Promise<CourseData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('课程不存在')
  }

  return res.json()
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const course = await getCourse(id)
    return <CourseDetail course={course} />
  } catch {
    return notFound()
  }
}
