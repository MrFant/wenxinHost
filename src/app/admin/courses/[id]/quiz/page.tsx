'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QuizQuestion {
  id?: string
  type: string
  content: string
  options: { label: string; text: string }[]
  answer: string
  explanation: string
  sortOrder: number
}

interface Quiz {
  id: string
  chapterId: string
  title: string
  questions: QuizQuestion[]
}

interface Chapter {
  id: string
  title: string
  quiz?: Quiz
}

const typeLabels: Record<string, string> = {
  char_to_pinyin: '看字选拼音',
  pinyin_to_char: '看拼音选字',
  audio_to_pinyin: '听音选拼音',
}

const emptyQuestion = (): QuizQuestion => ({
  type: 'char_to_pinyin',
  content: '',
  options: [
    { label: 'A', text: '' },
    { label: 'B', text: '' },
    { label: 'C', text: '' },
    { label: 'D', text: '' },
  ],
  answer: 'A',
  explanation: '',
  sortOrder: 0,
})

export default function AdminQuizPage() {
  const params = useParams()
  const courseId = params.id as string
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [newQuestion, setNewQuestion] = useState<QuizQuestion>(emptyQuestion())

  useEffect(() => {
    fetchChapters()
  }, [courseId])

  const fetchChapters = async () => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`)
      const data = await res.json()
      setChapters(data.chapters || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  const loadQuiz = async (chapterId: string) => {
    setExpandedChapter(chapterId)
    try {
      const res = await fetch(`/api/admin/quiz/${chapterId}`)
      const data = await res.json()
      setEditingQuiz(data)
      setNewQuestion(emptyQuestion())
    } catch {}
  }

  const saveQuestions = async () => {
    if (!editingQuiz) return
    setSaving(true)
    try {
      await fetch(`/api/admin/quiz/${editingQuiz.chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: editingQuiz.questions }),
      })
    } catch {} finally {
      setSaving(false)
    }
  }

  const addQuestion = async () => {
    if (!editingQuiz || !newQuestion.content.trim()) return
    try {
      const res = await fetch(`/api/admin/quiz/${editingQuiz.chapterId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newQuestion,
          sortOrder: editingQuiz.questions.length,
        }),
      })
      if (res.ok) {
        const q = await res.json()
        q.options = JSON.parse(q.options)
        setEditingQuiz({
          ...editingQuiz,
          questions: [...editingQuiz.questions, q],
        })
        setNewQuestion(emptyQuestion())
      }
    } catch {}
  }

  const deleteQuestion = async (questionId: string) => {
    if (!editingQuiz) return
    if (!confirm('确定删除此题目？')) return
    try {
      await fetch(`/api/admin/quiz/${editingQuiz.chapterId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      })
      setEditingQuiz({
        ...editingQuiz,
        questions: editingQuiz.questions.filter(q => q.id !== questionId),
      })
    } catch {}
  }

  const updateQuestionOption = (qIndex: number, optIndex: number, value: string) => {
    if (!editingQuiz) return
    const updated = [...editingQuiz.questions]
    updated[qIndex] = {
      ...updated[qIndex],
      options: updated[qIndex].options.map((o, i) =>
        i === optIndex ? { ...o, text: value } : o
      ),
    }
    setEditingQuiz({ ...editingQuiz, questions: updated })
  }

  if (loading) {
    return <div className="text-center py-8">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/courses/${courseId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">练习管理</h1>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id
          const questionCount = editingQuiz?.chapterId === chapter.id
            ? editingQuiz.questions.length
            : chapter.quiz?.questions?.length || 0

          return (
            <div key={chapter.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 章节标题行 */}
              <button
                onClick={() => isExpanded ? setExpandedChapter(null) : loadQuiz(chapter.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="font-medium">{chapter.title}</span>
                </div>
                <span className="text-sm text-gray-400">{questionCount} 道题</span>
              </button>

              {/* 展开的题目管理 */}
              {isExpanded && editingQuiz && editingQuiz.chapterId === chapter.id && (
                <div className="border-t p-4 space-y-4">
                  {/* 现有题目列表 */}
                  {editingQuiz.questions.length > 0 && (
                    <div className="space-y-3">
                      {editingQuiz.questions.map((q, qIndex) => (
                        <div key={q.id || qIndex} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">#{qIndex + 1}</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {typeLabels[q.type] || q.type}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => q.id && deleteQuestion(q.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>

                          <p className="font-medium mb-2">{q.content}</p>

                          <div className="grid grid-cols-2 gap-2 mb-2">
                            {q.options.map((opt, optIndex) => (
                              <div key={opt.label} className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">{opt.label}.</span>
                                <Input
                                  value={opt.text}
                                  onChange={(e) => updateQuestionOption(qIndex, optIndex, e.target.value)}
                                  className="h-8 text-sm"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>答案: <strong className="text-green-600">{q.answer}</strong></span>
                            {q.explanation && <span>解析: {q.explanation}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 新增题目表单 */}
                  <div className="border-2 border-dashed rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-sm text-gray-500">添加新题目</h3>

                    <div className="flex gap-2">
                      <select
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="char_to_pinyin">看字选拼音</option>
                        <option value="pinyin_to_char">看拼音选字</option>
                        <option value="audio_to_pinyin">听音选拼音</option>
                      </select>
                      <Input
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                        placeholder="题干（汉字 / 拼音 / 音频 URL）"
                        className="flex-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {newQuestion.options.map((opt, i) => (
                        <div key={opt.label} className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">{opt.label}.</span>
                          <Input
                            value={opt.text}
                            onChange={(e) => {
                              const opts = [...newQuestion.options]
                              opts[i] = { ...opts[i], text: e.target.value }
                              setNewQuestion({ ...newQuestion, options: opts })
                            }}
                            placeholder={`选项 ${opt.label}`}
                            className="h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-400">正确答案:</span>
                        <select
                          value={newQuestion.answer}
                          onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                          className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                        >
                          {newQuestion.options.map(opt => (
                            <option key={opt.label} value={opt.label}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        value={newQuestion.explanation}
                        onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                        placeholder="解析（可选）"
                        className="flex-1 h-8 text-sm"
                      />
                      <Button size="sm" onClick={addQuestion} disabled={!newQuestion.content.trim()}>
                        <Plus className="h-4 w-4 mr-1" />
                        添加
                      </Button>
                    </div>
                  </div>

                  {/* 保存按钮 */}
                  <div className="flex justify-end">
                    <Button onClick={saveQuestions} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                      保存题目
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {chapters.length === 0 && (
          <p className="text-center text-gray-400 py-8">暂无章节，请先添加章节</p>
        )}
      </div>
    </div>
  )
}
