import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const courses = await prisma.course.findMany({
    include: {
      chapters: { select: { id: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    courses.map((c) => ({
      ...c,
      chapterCount: c.chapters.length,
      orderCount: c._count.orders,
      chapters: undefined,
      _count: undefined,
    }))
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const course = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description || '',
        cover: body.cover || '',
        price: body.price || 0,
        category: body.category || '编程开发',
        status: body.status || 'draft',
      },
    })

    return NextResponse.json(course)
  } catch (err) {
    return NextResponse.json({ error: '创建课程失败' }, { status: 500 })
  }
}
