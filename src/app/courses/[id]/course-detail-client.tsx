'use client'

import Link from 'next/link'
import { Clock, BookOpen, Users, Star, Play, Lock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Chapter {
  id: string
  title: string
  duration: number
  sortOrder: number
  freePreview: boolean
}

interface CourseData {
  id: string
  title: string
  description: string
  cover: string
  price: number
  category: string
  chapterCount: number
  totalDuration: number
  studentCount: number
  reviewCount: number
  chapters: Chapter[]
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
  return `${mins}分钟`
}

export default function CourseDetailClient({ course }: { course: CourseData }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/courses" className="hover:text-blue-600">课程中心</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Hero */}
          <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden mb-6">
            {course.cover ? (
              <img src={course.cover} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Play className="h-16 w-16 text-white/80" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <Badge>{course.category}</Badge>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.chapterCount}节课程
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(course.totalDuration)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.studentCount}人学习
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              {course.reviewCount}条评价
            </span>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">课程介绍</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {course.description}
            </p>
          </div>

          {/* Chapter List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">课程大纲</h2>
            <div className="space-y-2">
              {course.chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-8">{index + 1}</span>
                    {chapter.freePreview ? (
                      <Play className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-300" />
                    )}
                    <span className="font-medium">{chapter.title}</span>
                    {chapter.freePreview && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        免费试看
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatDuration(chapter.duration)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Purchase Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-red-500 mb-2">
                ¥{course.price}
              </div>
              <p className="text-sm text-gray-400">一次购买，永久有效</p>
            </div>

            <Button className="w-full mb-3" size="lg" asChild>
              <Link href={`/checkout/${course.id}`}>立即购买</Link>
            </Button>

            <Button variant="outline" className="w-full mb-6" size="lg">
              免费试看
            </Button>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">课程节数</span>
                <span>{course.chapterCount}节</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">总时长</span>
                <span>{formatDuration(course.totalDuration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">学习人数</span>
                <span>{course.studentCount}人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">有效期</span>
                <span>永久有效</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
