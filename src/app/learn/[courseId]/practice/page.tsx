'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuizQuestion {
  id: string
  type: string
  content: string
  options: { label: string; text: string }[]
  sortOrder: number
}

interface QuizResult extends QuizQuestion {
  answer: string
  explanation: string
  userAnswer: string
  isCorrect: boolean
}

interface QuizData {
  quizId: string
  title: string
  total: number
  questions: QuizQuestion[]
}

const typeLabels: Record<string, string> = {
  char_to_pinyin: '看字选拼音',
  pinyin_to_char: '看拼音选字',
  audio_to_pinyin: '听音选拼音',
}

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = params.courseId as string
  const chapterId = searchParams.get('chapter') || ''

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<QuizResult[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!chapterId) {
      setError('缺少章节参数')
      setLoading(false)
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch(`/api/courses/${courseId}/chapters/${chapterId}/quiz`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || '加载失败')
        }
        return res.json()
      })
      .then((data) => {
        setQuiz(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [courseId, chapterId, router])

  const selectAnswer = useCallback((questionId: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: label }))
  }, [])

  const goNext = () => {
    if (quiz && current < quiz.questions.length - 1) {
      setCurrent((c) => c + 1)
    }
  }

  const goPrev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1)
    }
  }

  const submit = async () => {
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

  const restart = () => {
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
        <Button variant="outline" onClick={() => router.back()}>
          返回学习页
        </Button>
      </div>
    )
  }

  // 结果页
  if (results) {
    const correct = results.filter((r) => r.isCorrect).length
    const total = results.length
    const score = Math.round((correct / total) * 100)

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 得分卡片 */}
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
            <Button variant="outline" onClick={restart}>
              <RotateCcw className="h-4 w-4 mr-1" />
              重新练习
            </Button>
            <Button onClick={() => router.push(`/learn/${courseId}`)}>
              返回学习
            </Button>
          </div>
        </div>

        {/* 错题回顾 */}
        {results.filter((r) => !r.isCorrect).length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">错题回顾</h2>
            <div className="space-y-4">
              {results
                .filter((r) => !r.isCorrect)
                .map((r) => (
                  <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-400">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        {typeLabels[r.type] || r.type}
                      </span>
                    </div>
                    <p className="font-medium mb-3">{r.content}</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {r.options.map((opt) => (
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
        )}
      </div>
    )
  }

  // 做题页
  if (!quiz) return null
  const q = quiz.questions[current]
  const progress = ((current + 1) / quiz.questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
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
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="h-5 w-5 text-blue-500" />
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {typeLabels[q.type] || q.type}
          </span>
        </div>

        <p className="text-2xl font-bold text-center mb-8">{q.content}</p>

        {/* 选项 */}
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => selectAnswer(q.id, opt.label)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:border-blue-300 ${
                answers[q.id] === opt.label
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-medium text-gray-400 mr-2">{opt.label}.</span>
              <span className="text-lg">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={current === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          上一题
        </Button>

        {current === quiz.questions.length - 1 ? (
          <Button
            onClick={submit}
            disabled={submitting || Object.keys(answers).length < quiz.questions.length}
            className="bg-green-600 hover:bg-green-700"
          >
            {submitting ? '提交中...' : '提交答案'}
          </Button>
        ) : (
          <Button onClick={goNext}>
            下一题
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
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
