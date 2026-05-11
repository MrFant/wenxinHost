import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      chapters: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!course) {
    return NextResponse.json({ error: '课程不存在' }, { status: 404 })
  }

  return NextResponse.json(course)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Update course basic info
    const course = await prisma.course.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        cover: body.cover,
        price: body.price,
        category: body.category,
        status: body.status,
      },
    })

    // Update chapters if provided
    if (body.chapters) {
      // Delete removed chapters
      await prisma.chapter.deleteMany({
        where: {
          courseId: id,
          id: { notIn: body.chapters.filter((c: { id: string }) => c.id).map((c: { id: string }) => c.id) },
        },
      })

      // Upsert chapters
      for (const chapter of body.chapters) {
        if (chapter.id) {
          await prisma.chapter.update({
            where: { id: chapter.id },
            data: {
              title: chapter.title,
              videoUrl: chapter.videoUrl,
              duration: chapter.duration,
              sortOrder: chapter.sortOrder,
              freePreview: chapter.freePreview,
            },
          })
        } else {
          await prisma.chapter.create({
            data: {
              courseId: id,
              title: chapter.title,
              videoUrl: chapter.videoUrl || '',
              duration: chapter.duration || 0,
              sortOrder: chapter.sortOrder || 0,
              freePreview: chapter.freePreview || false,
            },
          })
        }
      }
    }

    return NextResponse.json(course)
  } catch (err) {
    return NextResponse.json({ error: '更新课程失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: '删除课程失败' }, { status: 500 })
  }
}
