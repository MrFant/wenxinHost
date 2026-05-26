'use client'

import type { QuizResult } from '../types'

const typeLabels: Record<string, string> = {
  char_to_pinyin: '看字选拼音',
  pinyin_to_char: '看拼音选字',
  audio_to_pinyin: '听音选拼音',
  typing_to_pinyin: '键盘打字输入',
  pinyin_combination: '声韵母组合点击',
}

interface ReviewSectionProps {
  results: QuizResult[]
}

export function ReviewSection({ results }: ReviewSectionProps) {
  if (results.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">错题回顾</h2>
      <div className="space-y-4">
        {results.map((r) => (
          <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-400">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500">✗</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                {typeLabels[r.type] || r.type}
              </span>
            </div>
            <p className="font-medium mb-3">{r.content}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {r.options?.map((opt) => (
                <div
                  key={opt.label}
                  className={`p-2 rounded text-sm ${
                    opt.label === r.answer
                      ? 'bg-green-100 text-green-700 font-medium'
                      : opt.label === r.userAnswer
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {opt.label}. {opt.text}
                  {opt.label === r.answer && ' ✓'}
                  {opt.label === r.userAnswer && opt.label !== r.answer && ' ✗'}
                </div>
              ))}
            </div>
            {r.explanation && (
              <p className="text-sm text-gray-500 bg-gray-50 rounded p-2">
                💡 {r.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
