import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getOSSClient } from '@/lib/oss'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

const ALLOWED_EXTENSIONS = ['mp4', 'webm', 'mov']
const MAX_SIZE = 500 * 1024 * 1024 // 500MB

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
      return NextResponse.json({ error: '请选择视频文件' }, { status: 400 })
    }

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: '只支持 mp4, webm, mov 格式' },
        { status: 400 }
      )
    }

    // Validate MIME type (some browsers may not set it correctly for videos)
    const typeValid =
      ALLOWED_VIDEO_TYPES.includes(file.type) ||
      file.type.startsWith('video/')
    if (!typeValid) {
      return NextResponse.json(
        { error: '只支持视频文件' },
        { status: 400 }
      )
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: '文件不能超过 500MB' },
        { status: 400 }
      )
    }

    const client = getOSSClient()

    // Generate unique key
    const timestamp = Date.now()
    const random = Math.random().toString(36).slice(2, 8)
    const key = `videos/${timestamp}-${random}.${ext}`

    // Upload buffer to OSS
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await client.put(key, buffer, {
      headers: {
        'Content-Type': file.type || 'video/mp4',
        'Content-Disposition': `inline; filename="${encodeURIComponent(file.name)}"`,
      },
    })

    console.log(`[VideoUpload] ${key} (${file.size} bytes) -> ${result.url}`)

    return NextResponse.json({
      url: result.url,
      key,
      filename: file.name,
      size: file.size,
    })
  } catch (err) {
    console.error('[VideoUpload] Error:', err)
    return NextResponse.json({ error: '视频上传失败' }, { status: 500 })
  }
}
