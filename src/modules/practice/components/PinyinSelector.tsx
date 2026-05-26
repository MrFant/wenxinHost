'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { INITIALS, FINALS, TONES } from '../utils/pinyin'

interface PinyinSelectorProps {
  targetChar: string
  onInput: (pinyin: string, tone: number) => void
  disabled?: boolean
}

export function PinyinSelector({ targetChar, onInput, disabled }: PinyinSelectorProps) {
  const [selectedInitial, setSelectedInitial] = useState<string | null>(null)
  const [selectedFinal, setSelectedFinal] = useState<string | null>(null)
  const [selectedTone, setSelectedTone] = useState<number | null>(null)

  const handleSubmit = () => {
    if (selectedInitial && selectedFinal && selectedTone !== null) {
      onInput(selectedInitial + selectedFinal, selectedTone)
    }
  }

  const handleReset = () => {
    setSelectedInitial(null)
    setSelectedFinal(null)
    setSelectedTone(null)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-6xl font-bold text-center">{targetChar}</div>

      {/* 声母选择 */}
      <div className="w-full max-w-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择声母
        </label>
        <div className="flex flex-wrap gap-2">
          {INITIALS.map((initial) => (
            <Button
              key={initial}
              variant={selectedInitial === initial ? 'default' : 'outline'}
              onClick={() => setSelectedInitial(initial)}
              disabled={disabled}
              className="min-w-[3rem]"
            >
              {initial}
            </Button>
          ))}
        </div>
      </div>

      {/* 韵母选择 */}
      <div className="w-full max-w-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择韵母
        </label>
        <div className="flex flex-wrap gap-2">
          {FINALS.map((final) => (
            <Button
              key={final}
              variant={selectedFinal === final ? 'default' : 'outline'}
              onClick={() => setSelectedFinal(final)}
              disabled={disabled}
              className="min-w-[3rem]"
            >
              {final}
            </Button>
          ))}
        </div>
      </div>

      {/* 声调选择 */}
      <div className="w-full max-w-lg">
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

      {/* 操作按钮 */}
      <div className="flex gap-4 w-full max-w-lg">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={disabled}
          className="flex-1"
        >
          重置
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedInitial || !selectedFinal || selectedTone === null || disabled}
          className="flex-1"
        >
          确认答案
        </Button>
      </div>
    </div>
  )
}
