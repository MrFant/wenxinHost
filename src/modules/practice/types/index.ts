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
