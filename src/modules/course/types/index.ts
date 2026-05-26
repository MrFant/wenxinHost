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
