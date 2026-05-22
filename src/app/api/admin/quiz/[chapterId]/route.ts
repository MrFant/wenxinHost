import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

function checkAdmin(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return false
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role: string }
    return payload.role === 'admin' || payload.role === 'superadmin'
  } catch {
    return false
  }
}

// GET 获取章节的练习题
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }

  const { chapterId } = await params

  let quiz = await prisma.quiz.findUnique({
    where: { chapterId },
    include: { questions: { orderBy: { sortOrder: 'asc' } } },
  })

  // 如果章节还没有练习集，自动创建一个
  if (!quiz) {
    const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } })
    if (!chapter) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 })
    }
    quiz = await prisma.quiz.create({
      data: { chapterId, title: `${chapter.title} 练习` },
      include: { questions: { orderBy: { sortOrder: 'asc' } } },
    })
  }

  return NextResponse.json(quiz)
}

// POST 新增题目
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }

  const { chapterId } = await params
  const body = await request.json()

  // 确保 quiz 存在
  let quiz = await prisma.quiz.findUnique({ where: { chapterId } })
  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: { chapterId, title: body.quizTitle || '章节练习' },
    })
  }

  const question = await prisma.quizQuestion.create({
    data: {
      quizId: quiz.id,
      type: body.type || 'char_to_pinyin',
      content: body.content,
      options: JSON.stringify(body.options),
      answer: body.answer,
      explanation: body.explanation || '',
      sortOrder: body.sortOrder || 0,
    },
  })

  return NextResponse.json(question)
}

// PUT 批量更新（排序 + 题目内容）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }

  const { chapterId } = await params
  const { questions } = await request.json()

  if (!Array.isArray(questions)) {
    return NextResponse.json({ error: '参数错误' }, { status: 400 })
  }

  for (const q of questions) {
    await prisma.quizQuestion.update({
      where: { id: q.id },
      data: {
        type: q.type,
        content: q.content,
        options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
        answer: q.answer,
        explanation: q.explanation || '',
        sortOrder: q.sortOrder,
      },
    })
  }

  return NextResponse.json({ success: true })
}

// DELETE 删除题目
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }

  const body = await request.json()
  if (!body.questionId) {
    return NextResponse.json({ error: '缺少题目 ID' }, { status: 400 })
  }

  await prisma.quizQuestion.delete({ where: { id: body.questionId } })
  return NextResponse.json({ success: true })
}
