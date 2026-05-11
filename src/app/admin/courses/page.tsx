'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Course {
  id: string
  title: string
  category: string
  price: number
  status: string
  chapterCount: number
  orderCount: number
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      setCourses(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    await fetch(`/api/admin/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchCourses()
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('确定要删除此课程吗？此操作不可撤销。')) return
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    fetchCourses()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">课程管理</h1>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            添加课程
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 text-sm font-medium text-gray-500">课程名称</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">分类</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">价格</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">章节</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">订单</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">状态</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{course.title}</td>
                <td className="p-4">
                  <Badge variant="outline">{course.category}</Badge>
                </td>
                <td className="p-4 font-medium">¥{course.price}</td>
                <td className="p-4">{course.chapterCount}节</td>
                <td className="p-4">{course.orderCount}单</td>
                <td className="p-4">
                  <Badge
                    variant={course.status === 'published' ? 'default' : 'secondary'}
                  >
                    {course.status === 'published' ? '已发布' : '草稿'}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(course.id, course.status)}
                      title={course.status === 'published' ? '下架' : '发布'}
                    >
                      {course.status === 'published' ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/courses/${course.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCourse(course.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  {loading ? '加载中...' : '暂无课程'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
