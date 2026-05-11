'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CourseCard } from '@/components/course/course-card'

const categories = ['全部', '编程开发', '人工智能', '设计创意', '职场技能', '语言学习']

interface Course {
  id: string
  title: string
  description: string
  cover: string
  price: number
  category: string
  chapterCount: number
  totalDuration: number
  studentCount: number
}

export default function CoursesContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || '全部'

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (category !== '全部') params.set('category', category)
      if (search) params.set('search', search)

      const res = await fetch(`/api/courses?${params}`)
      const data = await res.json()
      setCourses(data.courses || [])
      setLoading(false)
    }

    fetchCourses()
  }, [category, search])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">课程中心</h1>
        <p className="text-gray-500">选择适合你的课程，开始学习之旅</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索课程..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border bg-white overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">没有找到相关课程</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      )}
    </div>
  )
}
