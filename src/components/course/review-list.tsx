'use client'

import { Star, User } from 'lucide-react'

interface Review {
  id: string
  rating: number
  content: string
  createdAt: string
  user: {
    id: string
    nickname: string
    avatar: string | null
  }
}

interface ReviewListProps {
  reviews: Review[]
  avgRating: number
  total: number
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export function ReviewList({ reviews, avgRating, total }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>暂无评价</p>
      </div>
    )
  }

  return (
    <div>
      {/* 平均评分 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-3xl font-bold text-yellow-500">{avgRating}</div>
        <div>
          <StarRating rating={Math.round(avgRating)} />
          <p className="text-sm text-gray-500 mt-1">{total} 条评价</p>
        </div>
      </div>

      {/* 评价列表 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-center gap-3 mb-2">
              {/* 头像 */}
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {review.user.avatar ? (
                  <img src={review.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{review.user.nickname}</p>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 ml-11">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
