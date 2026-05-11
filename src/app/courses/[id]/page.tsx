import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CourseDetailClient from './course-detail-client'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id, status: 'published' },
    include: {
      chapters: {
        orderBy: { sortOrder: 'asc' },
      },
      _count: { select: { orders: true, reviews: true } },
    },
  })

  if (!course) notFound()

  const totalDuration = course.chapters.reduce((sum, c) => sum + c.duration, 0)

  return (
    <CourseDetailClient
      course={{
        id: course.id,
        title: course.title,
        description: course.description,
        cover: course.cover,
        price: course.price,
        category: course.category,
        chapterCount: course.chapters.length,
        totalDuration,
        studentCount: course._count.orders,
        reviewCount: course._count.reviews,
        chapters: course.chapters.map((c) => ({
          id: c.id,
          title: c.title,
          duration: c.duration,
          sortOrder: c.sortOrder,
          freePreview: c.freePreview,
        })),
      }}
    />
  )
}
