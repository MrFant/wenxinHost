'use client'

import Link from 'next/link'
import type { QuizResult as QuizResultType } from '../types'

interface QuizResultProps {
  results: QuizResultType[]
  onRestart: () => void
  courseId: string
}

export function QuizResult({ results, onRestart, courseId }: QuizResultProps) {
  const correct = results.filter((r) => r.isCorrect).length
  const total = results.length
  const score = Math.round((correct / total) * 100)

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm text-center mb-8">
      <div className="text-5xl font-bold mb-2">
        {score >= 80 ? (
          <span className="text-green-500">{score}分</span>
        ) : score >= 60 ? (
          <span className="text-yellow-500">{score}分</span>
        ) : (
          <span className="text-red-500">{score}分</span>
        )}
      </div>
      <p className="text-gray-500 mb-1">答对 {correct}/{total} 题</p>
      <p className="text-sm text-gray-400">
        {score >= 80 ? '太棒了！掌握得很好 🎉' : score >= 60 ? '还不错，继续加油 💪' : '需要复习一下哦 📖'}
      </p>
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={onRestart}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          重新练习
        </button>
        <Link
          href={`/learn/${courseId}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          返回学习
        </Link>
      </div>
    </div>
  )
}
