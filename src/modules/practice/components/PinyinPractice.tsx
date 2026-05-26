'use client'

import { KeyboardInput } from './KeyboardInput'
import { PinyinSelector } from './PinyinSelector'
import type { QuizType, PinyinInput } from '../types'

interface PinyinPracticeProps {
  type: QuizType
  content: string
  options?: { label: string; text: string }[]
  answer: string
  pinyinBase?: string
  tone?: number
  audioUrl?: string
  onAnswer: (answer: string) => void
  disabled?: boolean
}

export function PinyinPractice({
  type,
  content,
  options,
  answer,
  pinyinBase,
  tone,
  audioUrl,
  onAnswer,
  disabled
}: PinyinPracticeProps) {
  const handleInput = (pinyin: string, tone: number) => {
    // 将拼音和声调组合成答案格式
    const answerText = `${pinyin}${tone}`
    onAnswer(answerText)
  }

  const handleOptionSelect = (label: string) => {
    onAnswer(label)
  }

  switch (type) {
    case 'typing_to_pinyin':
      return (
        <KeyboardInput
          targetChar={content}
          onInput={handleInput}
          disabled={disabled}
        />
      )

    case 'pinyin_combination':
      return (
        <PinyinSelector
          targetChar={content}
          onInput={handleInput}
          disabled={disabled}
        />
      )

    case 'char_to_pinyin':
    case 'pinyin_to_char':
    case 'audio_to_pinyin':
      return (
        <div className="flex flex-col items-center gap-6">
          {type === 'audio_to_pinyin' && audioUrl && (
            <div className="w-full max-w-md">
              <audio controls src={audioUrl} className="w-full">
                您的浏览器不支持音频播放
              </audio>
            </div>
          )}

          <div className="text-4xl font-bold text-center">{content}</div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {options?.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleOptionSelect(opt.label)}
                disabled={disabled}
                className="p-4 rounded-xl border-2 text-left transition-all hover:border-blue-300 border-gray-200 hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-400 mr-2">
                  {opt.label}.
                </span>
                <span className="text-lg">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}
