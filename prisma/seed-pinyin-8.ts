import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// OSS 视频基础路径
const OSS_BASE = 'https://pinyin-course-videos.oss-cn-beijing.aliyuncs.com/courses/pinyin-basic'

const chapters = [
  { title: '1课：课程介绍', file: '1课：课程介绍', duration: 0, sortOrder: 1, freePreview: true },
  { title: '2课：声母学习', file: '2课：声母学习', duration: 0, sortOrder: 2, freePreview: false },
  { title: '3课：韵母学习', file: '3课：韵母学习', duration: 0, sortOrder: 3, freePreview: false },
  { title: '4课：整体认读音节学习', file: '4课：整体认读音节学习', duration: 0, sortOrder: 4, freePreview: false },
  { title: '5课：拼读规则学习', file: '5课：拼读规则学习', duration: 0, sortOrder: 5, freePreview: false },
  { title: '6课：拼读规则应用', file: '6课：拼读规则应用', duration: 0, sortOrder: 6, freePreview: false },
  { title: '7课：26个字母大小写', file: '7课：26个字母大小写', duration: 0, sortOrder: 7, freePreview: false },
  { title: '8课：四步教会你拼音打字', file: '8课：四步教会你拼音打字', duration: 0, sortOrder: 8, freePreview: false },
]

async function main() {
  // 清除旧数据（按依赖顺序删除）
  await prisma.quizQuestion.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.review.deleteMany()
  await prisma.order.deleteMany()
  await prisma.course.deleteMany()

  // 创建拼音入门课程
  const course = await prisma.course.create({
    data: {
      title: '拼音打字入门课程',
      description: '从零开始学习汉语拼音，掌握声母、韵母、声调和拼读规则，轻松学会拼音打字。',
      cover: '/images/pinyin-course.jpg',
      price: 9900, // 99元
      category: '语言学习',
      status: 'published',
    },
  })

  // 创建 8 个章节，指向 OSS 视频
  for (const ch of chapters) {
    await prisma.chapter.create({
      data: {
        courseId: course.id,
        title: ch.title,
        videoUrl: `${OSS_BASE}/${ch.file}.mp4`,
        duration: ch.duration,
        sortOrder: ch.sortOrder,
        freePreview: ch.freePreview,
      },
    })
  }

  const courseChapters = await prisma.chapter.findMany({
    where: { courseId: course.id },
    orderBy: { sortOrder: 'asc' },
  })

  console.log('拼音打字课程数据创建成功！')
  console.log(`课程ID: ${course.id}`)
  console.log(`章节数: ${courseChapters.length}`)
  courseChapters.forEach((ch) => {
    console.log(`  ${ch.sortOrder}. ${ch.title} -> ${ch.videoUrl}`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
