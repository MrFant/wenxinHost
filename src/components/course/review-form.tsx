'use client'

import { useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReviewFormProps {
  courseId: string
  onSuccess: () => void
}

export function ReviewForm({ courseId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setError('请选择评分')
      return
    }
    if (!content.trim()) {
      setError('请输入评价内容')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/courses/${courseId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, content: content.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      // 成功
      setRating(0)
      setContent('')
      onSuccess()
    } catch {
      setError('提交失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium mb-3">写评价</h3>

      {/* 星级评分 */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                i <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-gray-500 ml-2">{rating} 分</span>
        )}
      </div>

      {/* 评价内容 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="分享你对这门课程的看法..."
        maxLength={500}
        rows={3}
        className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">{content.length}/500</span>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>

      {/* 提交按钮 */}
      <Button
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        className="mt-3"
        size="sm"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        ) : null}
        提交评价
      </Button>
    </div>
  )
}
