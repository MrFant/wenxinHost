import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  if (!course) {
    return NextResponse.json({ error: '课程不存在' }, { status: 404 })
  }

  const totalDuration = course.chapters.reduce((sum, c) => sum + c.duration, 0)

  return NextResponse.json({
    ...course,
    chapterCount: course.chapters.length,
    totalDuration,
    studentCount: course._count.orders,
    reviewCount: course._count.reviews,
    _count: undefined,
  })
}
