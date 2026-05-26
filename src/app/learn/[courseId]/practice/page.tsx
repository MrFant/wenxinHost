'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { PracticeContainer } from '@/modules/practice'

export default function PracticePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const courseId = params.courseId as string
  const chapterId = searchParams.get('chapter') || ''

  if (!chapterId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">缺少章节参数</p>
        <button onClick={() => window.history.back()}>返回学习页</button>
      </div>
    )
  }

  return <PracticeContainer courseId={courseId} chapterId={chapterId} />
}
