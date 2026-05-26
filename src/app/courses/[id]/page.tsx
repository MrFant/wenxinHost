import { CourseDetail } from '@/modules/course'
import type { CourseData } from '@/modules/course'

async function getCourse(id: string): Promise<CourseData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  return <CourseDetail course={course} />
}
