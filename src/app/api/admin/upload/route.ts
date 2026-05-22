import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function checkAdmin(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return false
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role: string }
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    // 检查文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: '只支持 jpg/png/webp 格式' }, { status: 400 })
    }

    // 检查文件大小
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '文件不能超过 5MB' }, { status: 400 })
    }

    // 确保 uploads 目录存在
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // 生成唯一文件名
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filepath = path.join(uploadsDir, filename)

    // 写入文件
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    console.log(`[Upload] ${filename} (${file.size} bytes)`)

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
    })
  } catch {
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}
