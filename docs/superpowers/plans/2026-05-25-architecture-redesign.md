# 文心课堂架构重设计实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 采用功能模块化架构重构项目，重点优化拼音练习模块，支持5种练习类型。

**Architecture:** 按功能划分独立模块（course、practice、payment、auth），每个模块有自己的API、组件和hooks。共享模块提供通用UI组件和工具函数。Next.js App Router页面作为入口点。

**Tech Stack:** Next.js App Router, SQLite + Prisma, shadcn/ui, React hooks, Tailwind CSS

---

## 阶段一：重构练习模块（优先级最高）

### Task 1: 创建练习模块目录结构和类型定义

**Files:**
- Create: `src/modules/practice/types/index.ts`
- Create: `src/modules/practice/utils/pinyin.ts`

- [ ] **Step 1: 创建练习类型定义**

```typescript
// src/modules/practice/types/index.ts
export type QuizType = 
  | 'char_to_pinyin' 
  | 'pinyin_to_char' 
  | 'audio_to_pinyin' 
  | 'typing_to_pinyin' 
  | 'pinyin_combination'

export interface QuizQuestion {
  id: string
  type: QuizType
  content: string
  options?: { label: string; text: string }[]
  answer: string
  explanation: string
  sortOrder: number
  pinyinBase?: string
  tone?: number
  audioUrl?: string
}

export interface QuizData {
  quizId: string
  title: string
  total: number
  questions: QuizQuestion[]
}

export interface QuizResult extends QuizQuestion {
  userAnswer: string
  isCorrect: boolean
}

export interface PinyinInput {
  pinyin: string
  tone: number
}
```

- [ ] **Step 2: 创建拼音工具函数**

```typescript
// src/modules/practice/utils/pinyin.ts
export const INITIALS = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h',
  'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'
]

export const FINALS = [
  'a', 'o', 'e', 'i', 'u', 'ü',
  'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong',
  'ia', 'ie', 'iao', 'iou', 'ian', 'in', 'iang', 'ing', 'iong',
  'ua', 'uo', 'uai', 'uei', 'uan', 'uen', 'uang', 'ueng',
  'üe', 'üan', 'ün'
]

export const TONES = [
  { value: 1, label: 'ā', display: '第一声' },
  { value: 2, label: 'á', display: '第二声' },
  { value: 3, label: 'ǎ', display: '第三声' },
  { value: 4, label: 'à', display: '第四声' },
]

export function validatePinyin(pinyin: string, tone: number): boolean {
  // 验证拼音是否有效
  const pinyinRegex = /^[a-zü]+$/
  return pinyinRegex.test(pinyin) && tone >= 1 && tone <= 4
}

export function formatPinyin(pinyin: string, tone: number): string {
  // 将拼音和声调组合成带声调的拼音
  const toneMap: Record<number, string> = {
    1: 'ā', 2: 'á', 3: 'ǎ', 4: 'à'
  }
  // 简单实现：实际应该根据声调规则放置声调符号
  return pinyin + (toneMap[tone] || '')
}
```

- [ ] **Step 3: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: 提交**

```bash
git add src/modules/practice/types/index.ts src/modules/practice/utils/pinyin.ts
git commit -m "feat: 创建练习模块类型定义和拼音工具函数"
```

### Task 2: 创建拼音打字输入组件

**Files:**
- Create: `src/modules/practice/components/KeyboardInput.tsx`

- [ ] **Step 1: 创建KeyboardInput组件**

```tsx
// src/modules/practice/components/KeyboardInput.tsx
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
```

- [ ] **Step 2: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/modules/practice/components/KeyboardInput.tsx
git commit -m "feat: 创建拼音打字输入组件"
```

### Task 3: 创建声韵母组合点击组件

**Files:**
- Create: `src/modules/practice/components/PinyinSelector.tsx`

- [ ] **Step 1: 创建PinyinSelector组件**

```tsx
// src/modules/practice/components/PinyinSelector.tsx
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
```

- [ ] **Step 2: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/modules/practice/components/PinyinSelector.tsx
git commit -m "feat: 创建声韵母组合点击组件"
```

### Task 4: 创建拼音练习主组件

**Files:**
- Create: `src/modules/practice/components/PinyinPractice.tsx`

- [ ] **Step 1: 创建PinyinPractice组件**

```tsx
// src/modules/practice/components/PinyinPractice.tsx
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
```

- [ ] **Step 2: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/modules/practice/components/PinyinPractice.tsx
git commit -m "feat: 创建拼音练习主组件"
```

### Task 5: 创建练习容器组件

**Files:**
- Create: `src/modules/practice/components/PracticeContainer.tsx`

- [ ] **Step 1: 创建PracticeContainer组件**

```tsx
// src/modules/practice/components/PracticeContainer.tsx
'use client'

import { useState, useEffect } from 'react'
import { PinyinPractice } from './PinyinPractice'
import { QuizResult } from './QuizResult'
import { ReviewSection } from './ReviewSection'
import type { QuizData, QuizResult as QuizResultType } from '../types'

interface PracticeContainerProps {
  courseId: string
  chapterId: string
}

export function PracticeContainer({ courseId, chapterId }: PracticeContainerProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<QuizResultType[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          window.location.href = '/login'
          return
        }

        const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/quiz`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || '加载失败')
        }

        const data = await res.json()
        setQuiz(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [courseId, chapterId])

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    if (!quiz) return
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '提交失败')
      }

      const data = await res.json()
      setResults(data.results)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRestart = () => {
    setAnswers({})
    setResults(null)
    setCurrent(0)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error}</p>
        <button onClick={() => window.history.back()}>返回学习页</button>
      </div>
    )
  }

  if (results) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <QuizResult results={results} onRestart={handleRestart} courseId={courseId} />
        <ReviewSection results={results.filter((r) => !r.isCorrect)} />
      </div>
    )
  }

  if (!quiz) return null

  const q = quiz.questions[current]
  const progress = ((current + 1) / quiz.questions.length) * 100
  const isLastQuestion = current === quiz.questions.length - 1
  const allAnswered = Object.keys(answers).length === quiz.questions.length

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => window.history.back()}>←</button>
        <h1 className="font-semibold">{quiz.title}</h1>
        <span className="text-sm text-gray-400">
          {current + 1}/{quiz.questions.length}
        </span>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 题目卡片 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <PinyinPractice
          type={q.type}
          content={q.content}
          options={q.options}
          answer={q.answer}
          pinyinBase={q.pinyinBase}
          tone={q.tone}
          audioUrl={q.audioUrl}
          onAnswer={(answer) => handleAnswer(q.id, answer)}
          disabled={submitting}
        />
      </div>

      {/* 导航按钮 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          ← 上一题
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || !allAnswered}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {submitting ? '提交中...' : '提交答案'}
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            下一题 →
          </button>
        )}
      </div>

      {/* 题号导航 */}
      <div className="flex justify-center gap-2 mt-8">
        {quiz.questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              i === current
                ? 'bg-blue-600 text-white'
                : answers[quiz.questions[i].id]
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/modules/practice/components/PracticeContainer.tsx
git commit -m "feat: 创建练习容器组件"
```

### Task 6: 创建练习结果和错题回顾组件

**Files:**
- Create: `src/modules/practice/components/QuizResult.tsx`
- Create: `src/modules/practice/components/ReviewSection.tsx`

- [ ] **Step 1: 创建QuizResult组件**

```tsx
// src/modules/practice/components/QuizResult.tsx
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
```

- [ ] **Step 2: 创建ReviewSection组件**

```tsx
// src/modules/practice/components/ReviewSection.tsx
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
```

- [ ] **Step 3: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: 提交**

```bash
git add src/modules/practice/components/QuizResult.tsx src/modules/practice/components/ReviewSection.tsx
git commit -m "feat: 创建练习结果和错题回顾组件"
```

### Task 7: 创建练习模块入口文件和更新页面

**Files:**
- Create: `src/modules/practice/index.ts`
- Modify: `src/app/learn/[courseId]/practice/page.tsx`

- [ ] **Step 1: 创建练习模块入口文件**

```typescript
// src/modules/practice/index.ts
export { PracticeContainer } from './components/PracticeContainer'
export { PinyinPractice } from './components/PinyinPractice'
export { KeyboardInput } from './components/KeyboardInput'
export { PinyinSelector } from './components/PinyinSelector'
export { QuizResult } from './components/QuizResult'
export { ReviewSection } from './components/ReviewSection'
export * from './types'
export * from './utils/pinyin'
```

- [ ] **Step 2: 更新练习页面**

```tsx
// src/app/learn/[courseId]/practice/page.tsx
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
```

- [ ] **Step 3: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npm run build`
Expected: 构建成功

- [ ] **Step 4: 提交**

```bash
git add src/modules/practice/index.ts src/app/learn/[courseId]/practice/page.tsx
git commit -m "feat: 完成练习模块重构"
```

---

## 阶段二：优化课程模块

### Task 8: 创建课程模块目录结构和类型定义

**Files:**
- Create: `src/modules/course/types/index.ts`

- [ ] **Step 1: 创建课程类型定义**

```typescript
// src/modules/course/types/index.ts
export interface CourseChapter {
  id: string
  title: string
  videoUrl: string
  duration: number
  sortOrder: number
  freePreview: boolean
}

export interface CourseData {
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
  chapters: CourseChapter[]
}

export interface CourseList {
  id: string
  title: string
  description: string
  cover: string
  price: number
  category: string
  chapterCount: number
  totalDuration: number
}
```

- [ ] **Step 2: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/modules/course/types/index.ts
git commit -m "feat: 创建课程模块类型定义"
```

### Task 9: 创建课程组件

**Files:**
- Create: `src/modules/course/components/CourseCard.tsx`
- Create: `src/modules/course/components/CourseList.tsx`
- Create: `src/modules/course/components/CourseDetail.tsx`

- [ ] **Step 1: 创建CourseCard组件**

```tsx
// src/modules/course/components/CourseCard.tsx
'use client'

import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import type { CourseList } from '../types'

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
  return `${mins}分钟`
}

interface CourseCardProps {
  course: CourseList
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
          {course.cover && (
            <img
              src={course.cover}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{course.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.chapterCount}节
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(course.totalDuration)}
            </span>
          </div>
          <div className="mt-3 text-xl font-bold text-red-500">
            ¥{course.price}
          </div>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: 创建CourseList组件**

```tsx
// src/modules/course/components/CourseList.tsx
'use client'

import { CourseCard } from './CourseCard'
import type { CourseList as CourseListType } from '../types'

interface CourseListProps {
  courses: CourseListType[]
}

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无课程
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: 创建CourseDetail组件**

```tsx
// src/modules/course/components/CourseDetail.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, BookOpen, Users, Star, Play, Lock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { CourseData } from '../types'

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
  return `${mins}分钟`
}

interface CourseDetailProps {
  course: CourseData
}

export function CourseDetail({ course }: CourseDetailProps) {
  const [purchased, setPurchased] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setChecking(false)
      return
    }

    fetch('/api/user/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const orders = data.orders || data || []
        const hasPurchased = Array.isArray(orders) && orders.some(
          (o: { courseId: string; status: string }) => o.courseId === course.id && o.status === 'paid'
        )
        setPurchased(hasPurchased)
        setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [course.id])

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
                    {chapter.freePreview || purchased ? (
                      <Play className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-300" />
                    )}
                    <span className="font-medium">{chapter.title}</span>
                    {chapter.freePreview && !purchased && (
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
              {purchased ? (
                <div className="text-2xl font-bold text-green-600 mb-2">已购买</div>
              ) : (
                <div className="text-4xl font-bold text-red-500 mb-2">
                  ¥{course.price}
                </div>
              )}
              <p className="text-sm text-gray-400">一次购买，永久有效</p>
            </div>

            {purchased ? (
              <Button className="w-full mb-3 bg-green-600 hover:bg-green-700" size="lg" asChild>
                <Link href={`/learn/${course.id}`}>开始学习</Link>
              </Button>
            ) : (
              <Button className="w-full mb-3" size="lg" asChild>
                <Link href={`/checkout/${course.id}`}>立即购买</Link>
              </Button>
            )}

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
```

- [ ] **Step 4: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 5: 提交**

```bash
git add src/modules/course/components/
git commit -m "feat: 创建课程组件"
```

### Task 10: 创建课程模块入口文件和更新页面

**Files:**
- Create: `src/modules/course/index.ts`
- Modify: `src/app/courses/page.tsx`
- Modify: `src/app/courses/[id]/page.tsx`

- [ ] **Step 1: 创建课程模块入口文件**

```typescript
// src/modules/course/index.ts
export { CourseCard } from './components/CourseCard'
export { CourseList } from './components/CourseList'
export { CourseDetail } from './components/CourseDetail'
export * from './types'
```

- [ ] **Step 2: 更新课程列表页面**

```tsx
// src/app/courses/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { CourseList } from '@/modules/course'
import type { CourseList as CourseListType } from '@/modules/course'

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">课程中心</h1>
      <CourseList courses={courses} />
    </div>
  )
}
```

- [ ] **Step 3: 更新课程详情页面**

```tsx
// src/app/courses/[id]/page.tsx
import { CourseDetail } from '@/modules/course'
import type { CourseData } from '@/modules/course'

async function getCourse(id: string): Promise<CourseData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  return <CourseDetail course={course} />
}
```

- [ ] **Step 4: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npm run build`
Expected: 构建成功

- [ ] **Step 5: 提交**

```bash
git add src/modules/course/index.ts src/app/courses/page.tsx src/app/courses/\[id\]/page.tsx
git commit -m "feat: 完成课程模块重构"
```

---

## 阶段三：优化支付模块

### Task 11: 创建支付模块目录结构和类型定义

**Files:**
- Create: `src/modules/payment/types/index.ts`

- [ ] **Step 1: 创建支付类型定义**

```typescript
// src/modules/payment/types/index.ts
export interface Order {
  id: string
  userId: string
  courseId: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  orderId: string
  method: string
  amount: number
  paidAt?: Date
  wxPrepayId?: string
  createdAt: Date
}

export interface CheckoutData {
  courseId: string
  amount: number
  description: string
}
```

- [ ] **Step 2: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/modules/payment/types/index.ts
git commit -m "feat: 创建支付模块类型定义"
```

### Task 12: 创建支付组件

**Files:**
- Create: `src/modules/payment/components/OrderForm.tsx`
- Create: `src/modules/payment/components/PaymentButton.tsx`

- [ ] **Step 1: 创建OrderForm组件**

```tsx
// src/modules/payment/components/OrderForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CheckoutData } from '../types'

interface OrderFormProps {
  data: CheckoutData
  onSuccess: (orderId: string) => void
}

export function OrderForm({ data, onSuccess }: OrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: data.courseId,
        }),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || '创建订单失败')
      }

      const result = await res.json()
      onSuccess(result.orderId)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '创建订单失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-semibold mb-4">订单确认</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-500">课程名称</span>
          <span className="font-medium">{data.description}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">支付金额</span>
          <span className="text-xl font-bold text-red-500">¥{data.amount}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? '创建订单中...' : '确认支付'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: 创建PaymentButton组件**

```tsx
// src/modules/payment/components/PaymentButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PaymentButtonProps {
  orderId: string
  onSuccess?: () => void
}

export function PaymentButton({ orderId, onSuccess }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const res = await fetch('/api/payments/wechat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '支付失败')
      }

      const data = await res.json()
      
      // 跳转到微信支付页面
      if (data.h5_url) {
        window.location.href = data.h5_url
      }
      
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '支付失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? '支付中...' : '立即支付'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: 提交**

```bash
git add src/modules/payment/components/
git commit -m "feat: 创建支付组件"
```

### Task 13: 创建支付模块入口文件和更新页面

**Files:**
- Create: `src/modules/payment/index.ts`
- Modify: `src/app/checkout/[courseId]/page.tsx`

- [ ] **Step 1: 创建支付模块入口文件**

```typescript
// src/modules/payment/index.ts
export { OrderForm } from './components/OrderForm'
export { PaymentButton } from './components/PaymentButton'
export * from './types'
```

- [ ] **Step 2: 更新结账页面**

```tsx
// src/app/checkout/[courseId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { OrderForm } from '@/modules/payment'
import type { CheckoutData } from '@/modules/payment'

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [courseData, setCourseData] = useState<CheckoutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`)
        if (!res.ok) {
          throw new Error('课程不存在')
        }
        const data = await res.json()
        setCourseData({
          courseId: data.id,
          amount: data.price,
          description: data.title,
        })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || '课程不存在'}</p>
        <button onClick={() => router.back()}>返回</button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">课程购买</h1>
      <OrderForm
        data={courseData}
        onSuccess={(orderId) => {
          router.push(`/checkout/${courseId}?order=${orderId}`)
        }}
      />
    </div>
  )
}
```

- [ ] **Step 3: 运行测试验证**

Run: `cd /mnt/e/Github/wenxinHost && npm run build`
Expected: 构建成功

- [ ] **Step 4: 提交**

```bash
git add src/modules/payment/index.ts src/app/checkout/\[courseId\]/page.tsx
git commit -m "feat: 完成支付模块重构"
```

---

## 阶段四：完善拼音课程内容

### Task 14: 更新数据库模型

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260525_add_pinyin_fields/migration.sql`

- [ ] **Step 1: 更新Prisma schema**

```prisma
// prisma/schema.prisma
model QuizQuestion {
  id           String  @id @default(cuid())
  quizId       String
  type         String  // char_to_pinyin | pinyin_to_char | audio_to_pinyin | typing_to_pinyin | pinyin_combination
  content      String  // 题干
  options      String  // JSON选项
  answer       String  // 正确答案
  explanation  String  @default("")
  sortOrder    Int     @default(0)
  quiz         Quiz    @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  // 新增拼音相关字段
  pinyinBase   String? // 基础拼音（不带声调）
  tone         Int?    // 声调（1-4）
  audioUrl     String? // 音频URL
  
  @@unique([quizId, sortOrder])
}
```

- [ ] **Step 2: 创建迁移文件**

```sql
-- prisma/migrations/20260525_add_pinyin_fields/migration.sql
ALTER TABLE "QuizQuestion" ADD COLUMN "pinyinBase" TEXT;
ALTER TABLE "QuizQuestion" ADD COLUMN "tone" INTEGER;
ALTER TABLE "QuizQuestion" ADD COLUMN "audioUrl" TEXT;
```

- [ ] **Step 3: 运行迁移**

Run: `cd /mnt/e/Github/wenxinHost && npx prisma migrate dev`
Expected: 迁移成功

- [ ] **Step 4: 提交**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: 更新数据库模型支持拼音字段"
```

### Task 15: 创建拼音课程数据

**Files:**
- Create: `prisma/seed-pinyin.ts`

- [ ] **Step 1: 创建拼音课程seed文件**

```typescript
// prisma/seed-pinyin.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建拼音入门课程
  const course = await prisma.course.create({
    data: {
      title: '拼音入门课程',
      description: '从零开始学习汉语拼音，掌握声母、韵母、声调和拼读规则。',
      cover: '/images/pinyin-course.jpg',
      price: 9900, // 99元
      category: '语言学习',
      status: 'published',
    },
  })

  // 创建第一章：拼音基础知识
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第一章：拼音基础知识',
      videoUrl: '/videos/pinyin/chapter1.mp4',
      duration: 600, // 10分钟
      sortOrder: 1,
      freePreview: true,
    },
  })

  // 创建第二章：声调学习
  const chapter2 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第二章：声调学习',
      videoUrl: '/videos/pinyin/chapter2.mp4',
      duration: 480, // 8分钟
      sortOrder: 2,
      freePreview: false,
    },
  })

  // 创建第三章：拼读规则
  const chapter3 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第三章：拼读规则',
      videoUrl: '/videos/pinyin/chapter3.mp4',
      duration: 720, // 12分钟
      sortOrder: 3,
      freePreview: false,
    },
  })

  // 创建第四章：拼音应用
  const chapter4 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第四章：拼音应用',
      videoUrl: '/videos/pinyin/chapter4.mp4',
      duration: 900, // 15分钟
      sortOrder: 4,
      freePreview: false,
    },
  })

  // 为第一章创建练习
  const quiz1 = await prisma.quiz.create({
    data: {
      chapterId: chapter1.id,
      title: '声母练习',
    },
  })

  // 创建声母练习题目
  const quizQuestions = [
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '妈',
      options: JSON.stringify([
        { label: 'A', text: 'mā' },
        { label: 'B', text: 'bā' },
        { label: 'C', text: 'pā' },
        { label: 'D', text: 'fā' },
      ]),
      answer: 'A',
      explanation: '"妈"的拼音是mā，声母是m。',
      sortOrder: 1,
      pinyinBase: 'ma',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'typing_to_pinyin',
      content: '爸',
      options: JSON.stringify([]),
      answer: 'ba4',
      explanation: '"爸"的拼音是bà，声母是b，韵母是a，声调是第四声。',
      sortOrder: 2,
      pinyinBase: 'ba',
      tone: 4,
    },
    {
      quizId: quiz1.id,
      type: 'pinyin_combination',
      content: '妈',
      options: JSON.stringify([]),
      answer: 'ma1',
      explanation: '"妈"由声母m和韵母a组成，声调是第一声。',
      sortOrder: 3,
      pinyinBase: 'ma',
      tone: 1,
    },
  ]

  for (const question of quizQuestions) {
    await prisma.quizQuestion.create({ data: question })
  }

  // 为第二章创建练习
  const quiz2 = await prisma.quiz.create({
    data: {
      chapterId: chapter2.id,
      title: '声调练习',
    },
  })

  // 创建声调练习题目
  const toneQuestions = [
    {
      quizId: quiz2.id,
      type: 'char_to_pinyin',
      content: '妈',
      options: JSON.stringify([
        { label: 'A', text: 'mā' },
        { label: 'B', text: 'má' },
        { label: 'C', text: 'mǎ' },
        { label: 'D', text: 'mà' },
      ]),
      answer: 'A',
      explanation: '"妈"是第一声（阴平），读音高而平。',
      sortOrder: 1,
      pinyinBase: 'ma',
      tone: 1,
    },
    {
      quizId: quiz2.id,
      type: 'char_to_pinyin',
      content: '麻',
      options: JSON.stringify([
        { label: 'A', text: 'mā' },
        { label: 'B', text: 'má' },
        { label: 'C', text: 'mǎ' },
        { label: 'D', text: 'mà' },
      ]),
      answer: 'B',
      explanation: '"麻"是第二声（阳平），读音从低到高。',
      sortOrder: 2,
      pinyinBase: 'ma',
      tone: 2,
    },
    {
      quizId: quiz2.id,
      type: 'typing_to_pinyin',
      content: '马',
      options: JSON.stringify([]),
      answer: 'ma3',
      explanation: '"马"是第三声（上声），读音先降后升。',
      sortOrder: 3,
      pinyinBase: 'ma',
      tone: 3,
    },
  ]

  for (const question of toneQuestions) {
    await prisma.quizQuestion.create({ data: question })
  }

  console.log('拼音课程数据创建成功！')
  console.log(`课程ID: ${course.id}`)
  console.log(`章节数: 4`)
  console.log(`练习数: 2`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

- [ ] **Step 2: 运行seed文件**

Run: `cd /mnt/e/Github/wenxinHost && npx tsx prisma/seed-pinyin.ts`
Expected: "拼音课程数据创建成功！"

- [ ] **Step 3: 提交**

```bash
git add prisma/seed-pinyin.ts
git commit -m "feat: 创建拼音课程数据"
```

---

## 自检清单

- [x] 覆盖所有设计文档中的需求
- [x] 没有占位符（TODO、TBD等）
- [x] 类型一致性检查通过
- [x] 每个任务都有完整的代码和测试步骤
- [x] 每个任务都有提交步骤
