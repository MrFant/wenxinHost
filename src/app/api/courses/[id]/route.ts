import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOSSClient } from '@/lib/oss'

function signVideoUrl(videoUrl: string): string {
  if (!videoUrl || !videoUrl.includes('.oss-')) return videoUrl
  try {
    const client = getOSSClient()
    const urlObj = new URL(videoUrl)
    const key = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname
    return client.signatureUrl(key, { expires: 7200 })
  } catch {
    return videoUrl
  }
}

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
      orders: {
        where: { status: 'paid' },
        select: { id: true },
      },
      _count: { select: { reviews: true } },
    },
  })

  if (!course) {
    return NextResponse.json({ error: '课程不存在' }, { status: 404 })
  }

  const totalDuration = course.chapters.reduce((sum, c) => sum + c.duration, 0)

  const { orders, _count, ...courseData } = course
  return NextResponse.json({
    ...courseData,
    chapters: course.chapters.map((ch) => ({
      ...ch,
      videoUrl: signVideoUrl(ch.videoUrl),
    })),
    chapterCount: course.chapters.length,
    totalDuration,
    studentCount: orders.length,
    reviewCount: _count.reviews,
  })
}
