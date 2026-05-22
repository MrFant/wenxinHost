'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, Plus, Trash2, ArrowLeft, Upload, Loader2, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Chapter {
  id?: string
  title: string
  videoUrl: string
  duration: number
  sortOrder: number
  freePreview: boolean
}

interface CourseForm {
  title: string
  description: string
  cover: string
  price: number
  category: string
  status: string
  chapters: Chapter[]
}

interface Category {
  id: string
  name: string
}

export default function AdminCourseEditPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const isNew = courseId === 'new'
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<CourseForm>({
    title: '',
    description: '',
    cover: '',
    price: 0,
    category: '',
    status: 'draft',
    chapters: [],
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // 拉分类列表
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(() => {})

    if (isNew) return

    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}`)
        const data = await res.json()
        setForm({
          title: data.title,
          description: data.description,
          cover: data.cover,
          price: data.price,
          category: data.category,
          status: data.status,
          chapters: data.chapters || [],
        })
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId, isNew])

  // 封面图上传
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        setForm(f => ({ ...f, cover: data.path }))
      } else {
        alert('上传失败')
      }
    } catch {
      alert('上传出错')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = isNew ? '/api/admin/courses' : `/api/admin/courses/${courseId}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push('/admin/courses')
      }
    } catch {} finally {
      setSaving(false)
    }
  }

  const addChapter = () => {
    setForm((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          title: '',
          videoUrl: '',
          duration: 0,
          sortOrder: prev.chapters.length,
          freePreview: false,
        },
      ],
    }))
  }

  const updateChapter = (index: number, field: keyof Chapter, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === index ? { ...ch, [field]: value } : ch
      ),
    }))
  }

  const removeChapter = (index: number) => {
    setForm((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return <div className="text-center py-8">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{isNew ? '添加课程' : '编辑课程'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">课程标题</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="输入课程标题"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">课程描述</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="输入课程描述"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">分类</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">价格 (元)</label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              {/* 封面图 */}
              <div>
                <label className="text-sm font-medium mb-1 block">封面图</label>
                <div className="flex gap-2">
                  <Input
                    value={form.cover}
                    onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
                    placeholder="图片 URL 或上传后自动填入"
                    className="flex-1"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                </div>
                {form.cover && (
                  <img
                    src={form.cover}
                    alt="封面预览"
                    className="mt-2 h-32 rounded-lg object-cover border"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">课程章节</h2>
              <Button variant="outline" size="sm" onClick={addChapter}>
                <Plus className="h-4 w-4 mr-1" />
                添加章节
              </Button>
            </div>
            <div className="space-y-3">
              {form.chapters.map((chapter, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-gray-400 w-8">#{index + 1}</span>
                    <Input
                      value={chapter.title}
                      onChange={(e) => updateChapter(index, 'title', e.target.value)}
                      placeholder="章节标题"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChapter(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 ml-11">
                    <Input
                      value={chapter.videoUrl}
                      onChange={(e) => updateChapter(index, 'videoUrl', e.target.value)}
                      placeholder="视频URL"
                    />
                    <Input
                      type="number"
                      value={chapter.duration}
                      onChange={(e) => updateChapter(index, 'duration', parseInt(e.target.value) || 0)}
                      placeholder="时长(秒)"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={chapter.freePreview}
                        onChange={(e) => updateChapter(index, 'freePreview', e.target.checked)}
                      />
                      免费试看
                    </label>
                  </div>
                </div>
              ))}
              {form.chapters.length === 0 && (
                <p className="text-center text-gray-400 py-4">暂无章节，点击上方按钮添加</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">发布设置</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">状态</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                </select>
              </div>
              <Button className="w-full" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存课程'}
              </Button>
              {!isNew && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/admin/courses/${courseId}/quiz`}>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    练习管理
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
