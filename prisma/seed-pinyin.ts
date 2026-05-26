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