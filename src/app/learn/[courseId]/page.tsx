import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import LearnClient from './learn-client'

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  const course = await prisma.course.findUnique({
    where: { id: courseId, status: 'published' },
    include: {
      chapters: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!course) notFound()

  return (
    <LearnClient
      course={{
        id: course.id,
        title: course.title,
        chapters: course.chapters.map((c) => ({
          id: c.id,
          title: c.title,
          videoUrl: c.videoUrl ?? '',
          duration: c.duration,
          sortOrder: c.sortOrder,
          freePreview: c.freePreview,
        })),
      }}
    />
  )
}
