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
