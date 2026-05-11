import Link from 'next/link'
import { Clock, BookOpen, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CourseCardProps {
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

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}小时${mins}分钟`
  return `${mins}分钟`
}

const categoryColors: Record<string, string> = {
  编程开发: 'bg-blue-100 text-blue-700',
  人工智能: 'bg-purple-100 text-purple-700',
  设计创意: 'bg-pink-100 text-pink-700',
  职场技能: 'bg-green-100 text-green-700',
  语言学习: 'bg-orange-100 text-orange-700',
}

export function CourseCard({
  id,
  title,
  description,
  cover,
  price,
  category,
  chapterCount,
  totalDuration,
  studentCount,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`} className="group">
      <div className="rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Cover */}
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
          {cover ? (
            <img src={cover} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-12 w-12 text-white/80" />
            </div>
          )}
          <Badge
            className={`absolute top-3 left-3 ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}
          >
            {category}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{description}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {chapterCount}节
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(totalDuration)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {studentCount}人学习
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-red-500">¥{price}</span>
            <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
              查看详情 →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
