'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TONES } from '../utils/pinyin'

interface KeyboardInputProps {
  targetChar: string
  onInput: (pinyin: string, tone: number) => void
  disabled?: boolean
}

export function KeyboardInput({ targetChar, onInput, disabled }: KeyboardInputProps) {
  const [pinyin, setPinyin] = useState('')
  const [selectedTone, setSelectedTone] = useState<number | null>(null)

  const handleSubmit = () => {
    if (pinyin && selectedTone !== null) {
      onInput(pinyin, selectedTone)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-6xl font-bold text-center">{targetChar}</div>

      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          输入拼音
        </label>
        <input
          type="text"
          value={pinyin}
          onChange={(e) => setPinyin(e.target.value.toLowerCase())}
          disabled={disabled}
          placeholder="例如：ma"
          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择声调
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TONES.map((tone) => (
            <Button
              key={tone.value}
              variant={selectedTone === tone.value ? 'default' : 'outline'}
              onClick={() => setSelectedTone(tone.value)}
              disabled={disabled}
              className="text-2xl h-12"
            >
              {tone.label}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!pinyin || selectedTone === null || disabled}
        className="w-full max-w-md"
      >
        确认答案
      </Button>
    </div>
  )
}
