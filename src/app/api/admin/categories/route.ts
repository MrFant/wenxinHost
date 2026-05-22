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

// GET 获取所有分类（公开，课程编辑页的下拉也需要）
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(categories)
}

// POST 新增分类
export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }

  try {
    const { name, sortOrder } = await request.json()
    if (!name || !name.trim()) {
      return NextResponse.json({ error: '分类名称不能为空' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        sortOrder: sortOrder || 0,
      },
    })
    return NextResponse.json(category)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
      return NextResponse.json({ error: '分类名称已存在' }, { status: 409 })
    }
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}

// PUT 批量更新分类（排序 + 改名）
export async function PUT(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }

  try {
    const { categories } = await request.json()
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    for (const cat of categories) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { name: cat.name, sortOrder: cat.sortOrder },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
      return NextResponse.json({ error: '分类名称已存在' }, { status: 409 })
    }
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

// DELETE 删除分类
export async function DELETE(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }

  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: '缺少分类 ID' }, { status: 400 })
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
