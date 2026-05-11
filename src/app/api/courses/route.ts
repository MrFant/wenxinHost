import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  const where: Record<string, unknown> = { status: 'published' }
  if (category) where.category = category
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ]
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        chapters: { select: { id: true, duration: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({ where }),
  ])

  const coursesWithMeta = courses.map((course) => ({
    ...course,
    chapterCount: course.chapters.length,
    totalDuration: course.chapters.reduce((sum, c) => sum + c.duration, 0),
    studentCount: course._count.orders,
    chapters: undefined,
    _count: undefined,
  }))

  return NextResponse.json({
    courses: coursesWithMeta,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
