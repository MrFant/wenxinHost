import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 清除旧数据（按依赖顺序删除）
  await prisma.quizQuestion.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.review.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.course.deleteMany()

  // 创建拼音入门课程
  const course = await prisma.course.create({
    data: {
      title: '拼音入门课程',
      description: '从零开始学习汉语拼音，掌握声母、韵母、声调和拼读规则。',
      cover: '/images/pinyin-course.jpg',
      price: 9900,
      category: '语言学习',
      status: 'published',
    },
  })

  // ============================================================
  // 第一章：拼音基础知识
  // ============================================================
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第一章：拼音基础知识',
      videoUrl: '/videos/pinyin/chapter1.mp4',
      duration: 600,
      sortOrder: 1,
      freePreview: true,
    },
  })

  const quiz1 = await prisma.quiz.create({
    data: {
      chapterId: chapter1.id,
      title: '拼音基础练习',
    },
  })

  const chapter1Questions = [
    // ---- char_to_pinyin: 声母识别 ----
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '八',
      options: JSON.stringify([
        { label: 'A', text: 'bā' },
        { label: 'B', text: 'pā' },
        { label: 'C', text: 'dā' },
        { label: 'D', text: 'mā' },
      ]),
      answer: 'A',
      explanation: '"八"的拼音是bā，声母是b。',
      sortOrder: 1,
      pinyinBase: 'ba',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '趴',
      options: JSON.stringify([
        { label: 'A', text: 'bā' },
        { label: 'B', text: 'pā' },
        { label: 'C', text: 'fā' },
        { label: 'D', text: 'dā' },
      ]),
      answer: 'B',
      explanation: '"趴"的拼音是pā，声母是p。',
      sortOrder: 2,
      pinyinBase: 'pa',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '妈',
      options: JSON.stringify([
        { label: 'A', text: 'bā' },
        { label: 'B', text: 'mā' },
        { label: 'C', text: 'nā' },
        { label: 'D', text: 'lā' },
      ]),
      answer: 'B',
      explanation: '"妈"的拼音是mā，声母是m。',
      sortOrder: 3,
      pinyinBase: 'ma',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '发',
      options: JSON.stringify([
        { label: 'A', text: 'pā' },
        { label: 'B', text: 'hā' },
        { label: 'C', text: 'fā' },
        { label: 'D', text: 'dā' },
      ]),
      answer: 'C',
      explanation: '"发"的拼音是fā，声母是f。',
      sortOrder: 4,
      pinyinBase: 'fa',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '搭',
      options: JSON.stringify([
        { label: 'A', text: 'tā' },
        { label: 'B', text: 'dā' },
        { label: 'C', text: 'nā' },
        { label: 'D', text: 'lā' },
      ]),
      answer: 'B',
      explanation: '"搭"的拼音是dā，声母是d。',
      sortOrder: 5,
      pinyinBase: 'da',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '他',
      options: JSON.stringify([
        { label: 'A', text: 'dā' },
        { label: 'B', text: 'tā' },
        { label: 'C', text: 'gā' },
        { label: 'D', text: 'kā' },
      ]),
      answer: 'B',
      explanation: '"他"的拼音是tā，声母是t。',
      sortOrder: 6,
      pinyinBase: 'ta',
      tone: 1,
    },

    // ---- char_to_pinyin: 韵母识别 ----
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '衣',
      options: JSON.stringify([
        { label: 'A', text: 'yī' },
        { label: 'B', text: 'wū' },
        { label: 'C', text: 'yú' },
        { label: 'D', text: 'yì' },
      ]),
      answer: 'A',
      explanation: '"衣"的拼音是yī，韵母是i。',
      sortOrder: 7,
      pinyinBase: 'yi',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'char_to_pinyin',
      content: '乌',
      options: JSON.stringify([
        { label: 'A', text: 'yī' },
        { label: 'B', text: 'wū' },
        { label: 'C', text: 'yú' },
        { label: 'D', text: 'ē' },
      ]),
      answer: 'B',
      explanation: '"乌"的拼音是wū，韵母是u。',
      sortOrder: 8,
      pinyinBase: 'wu',
      tone: 1,
    },

    // ---- typing_to_pinyin ----
    {
      quizId: quiz1.id,
      type: 'typing_to_pinyin',
      content: '爸',
      options: JSON.stringify([]),
      answer: 'ba4',
      explanation: '"爸"的拼音是bà，声母是b，韵母是a，声调是第四声。',
      sortOrder: 9,
      pinyinBase: 'ba',
      tone: 4,
    },
    {
      quizId: quiz1.id,
      type: 'typing_to_pinyin',
      content: '大',
      options: JSON.stringify([]),
      answer: 'da4',
      explanation: '"大"的拼音是dà，声母是d，韵母是a，声调是第四声。',
      sortOrder: 10,
      pinyinBase: 'da',
      tone: 4,
    },
    {
      quizId: quiz1.id,
      type: 'typing_to_pinyin',
      content: '米',
      options: JSON.stringify([]),
      answer: 'mi3',
      explanation: '"米"的拼音是mǐ，声母是m，韵母是i，声调是第三声。',
      sortOrder: 11,
      pinyinBase: 'mi',
      tone: 3,
    },

    // ---- pinyin_combination ----
    {
      quizId: quiz1.id,
      type: 'pinyin_combination',
      content: '请将声母和韵母组合：声母 b + 韵母 a + 声调 1',
      options: JSON.stringify([]),
      answer: 'ba1',
      explanation: '声母b和韵母a组合，加第一声，得到bā。',
      sortOrder: 12,
      pinyinBase: 'ba',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'pinyin_combination',
      content: '请将声母和韵母组合：声母 m + 韵母 i + 声调 2',
      options: JSON.stringify([]),
      answer: 'mi2',
      explanation: '声母m和韵母i组合，加第二声，得到mí。',
      sortOrder: 13,
      pinyinBase: 'mi',
      tone: 2,
    },
    {
      quizId: quiz1.id,
      type: 'pinyin_combination',
      content: '请将声母和韵母组合：声母 d + 韵母 u + 声调 3',
      options: JSON.stringify([]),
      answer: 'du3',
      explanation: '声母d和韵母u组合，加第三声，得到dǔ。',
      sortOrder: 14,
      pinyinBase: 'du',
      tone: 3,
    },

    // ---- pinyin_to_char ----
    {
      quizId: quiz1.id,
      type: 'pinyin_to_char',
      content: 'bā',
      options: JSON.stringify([
        { label: 'A', text: '八' },
        { label: 'B', text: '大' },
        { label: 'C', text: '马' },
        { label: 'D', text: '鱼' },
      ]),
      answer: 'A',
      explanation: '"bā"对应的汉字是"八"。',
      sortOrder: 15,
      pinyinBase: 'ba',
      tone: 1,
    },
    {
      quizId: quiz1.id,
      type: 'pinyin_to_char',
      content: 'fēng',
      options: JSON.stringify([
        { label: 'A', text: '风' },
        { label: 'B', text: '分' },
        { label: 'C', text: '封' },
        { label: 'D', text: '疯' },
      ]),
      answer: 'A',
      explanation: '"fēng"对应的常用字是"风"。',
      sortOrder: 16,
      pinyinBase: 'feng',
      tone: 1,
    },
  ]

  for (const q of chapter1Questions) {
    await prisma.quizQuestion.create({ data: q })
  }

  // ============================================================
  // 第二章：声调学习
  // ============================================================
  const chapter2 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第二章：声调学习',
      videoUrl: '/videos/pinyin/chapter2.mp4',
      duration: 480,
      sortOrder: 2,
      freePreview: false,
    },
  })

  const quiz2 = await prisma.quiz.create({
    data: {
      chapterId: chapter2.id,
      title: '声调辨别练习',
    },
  })

  const chapter2Questions = [
    // ---- 声调辨别 char_to_pinyin ----
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
      type: 'char_to_pinyin',
      content: '马',
      options: JSON.stringify([
        { label: 'A', text: 'mā' },
        { label: 'B', text: 'má' },
        { label: 'C', text: 'mǎ' },
        { label: 'D', text: 'mà' },
      ]),
      answer: 'C',
      explanation: '"马"是第三声（上声），读音先降后升。',
      sortOrder: 3,
      pinyinBase: 'ma',
      tone: 3,
    },
    {
      quizId: quiz2.id,
      type: 'char_to_pinyin',
      content: '骂',
      options: JSON.stringify([
        { label: 'A', text: 'mā' },
        { label: 'B', text: 'má' },
        { label: 'C', text: 'mǎ' },
        { label: 'D', text: 'mà' },
      ]),
      answer: 'D',
      explanation: '"骂"是第四声（去声），读音从高到低。',
      sortOrder: 4,
      pinyinBase: 'ma',
      tone: 4,
    },

    // ---- 不同韵母的声调辨别 ----
    {
      quizId: quiz2.id,
      type: 'char_to_pinyin',
      content: '飞',
      options: JSON.stringify([
        { label: 'A', text: 'fēi' },
        { label: 'B', text: 'féi' },
        { label: 'C', text: 'fěi' },
        { label: 'D', text: 'fèi' },
      ]),
      answer: 'A',
      explanation: '"飞"是第一声，fēi。',
      sortOrder: 5,
      pinyinBase: 'fei',
      tone: 1,
    },
    {
      quizId: quiz2.id,
      type: 'char_to_pinyin',
      content: '肥',
      options: JSON.stringify([
        { label: 'A', text: 'fēi' },
        { label: 'B', text: 'féi' },
        { label: 'C', text: 'fěi' },
        { label: 'D', text: 'fèi' },
      ]),
      answer: 'B',
      explanation: '"肥"是第二声，féi。',
      sortOrder: 6,
      pinyinBase: 'fei',
      tone: 2,
    },
    {
      quizId: quiz2.id,
      type: 'char_to_pinyin',
      content: '匪',
      options: JSON.stringify([
        { label: 'A', text: 'fēi' },
        { label: 'B', text: 'féi' },
        { label: 'C', text: 'fěi' },
        { label: 'D', text: 'fèi' },
      ]),
      answer: 'C',
      explanation: '"匪"是第三声，fěi。',
      sortOrder: 7,
      pinyinBase: 'fei',
      tone: 3,
    },
    {
      quizId: quiz2.id,
      type: 'char_to_pinyin',
      content: '费',
      options: JSON.stringify([
        { label: 'A', text: 'fēi' },
        { label: 'B', text: 'féi' },
        { label: 'C', text: 'fěi' },
        { label: 'D', text: 'fèi' },
      ]),
      answer: 'D',
      explanation: '"费"是第四声，fèi。',
      sortOrder: 8,
      pinyinBase: 'fei',
      tone: 4,
    },

    // ---- typing_to_pinyin: 声调输入 ----
    {
      quizId: quiz2.id,
      type: 'typing_to_pinyin',
      content: '请写出"雨"的拼音（含声调）',
      options: JSON.stringify([]),
      answer: 'yu3',
      explanation: '"雨"的拼音是yǔ，第三声。',
      sortOrder: 9,
      pinyinBase: 'yu',
      tone: 3,
    },
    {
      quizId: quiz2.id,
      type: 'typing_to_pinyin',
      content: '请写出"火"的拼音（含声调）',
      options: JSON.stringify([]),
      answer: 'huo3',
      explanation: '"火"的拼音是huǒ，第三声。',
      sortOrder: 10,
      pinyinBase: 'huo',
      tone: 3,
    },
    {
      quizId: quiz2.id,
      type: 'typing_to_pinyin',
      content: '请写出"水"的拼音（含声调）',
      options: JSON.stringify([]),
      answer: 'shui3',
      explanation: '"水"的拼音是shuǐ，第三声。',
      sortOrder: 11,
      pinyinBase: 'shui',
      tone: 3,
    },
    {
      quizId: quiz2.id,
      type: 'typing_to_pinyin',
      content: '请写出"天"的拼音（含声调）',
      options: JSON.stringify([]),
      answer: 'tian1',
      explanation: '"天"的拼音是tiān，第一声。',
      sortOrder: 12,
      pinyinBase: 'tian',
      tone: 1,
    },

    // ---- pinyin_to_char: 听声调选字 ----
    {
      quizId: quiz2.id,
      type: 'pinyin_to_char',
      content: 'xué',
      options: JSON.stringify([
        { label: 'A', text: '学' },
        { label: 'B', text: '雪' },
        { label: 'C', text: '血' },
        { label: 'D', text: '穴' },
      ]),
      answer: 'A',
      explanation: '"xué"第二声是"学"。',
      sortOrder: 13,
      pinyinBase: 'xue',
      tone: 2,
    },
    {
      quizId: quiz2.id,
      type: 'pinyin_to_char',
      content: 'mèi',
      options: JSON.stringify([
        { label: 'A', text: '妹' },
        { label: 'B', text: '每' },
        { label: 'C', text: '美' },
        { label: 'D', text: '梅' },
      ]),
      answer: 'A',
      explanation: '"mèi"第四声是"妹"。',
      sortOrder: 14,
      pinyinBase: 'mei',
      tone: 4,
    },

    // ---- pinyin_combination: 声调组合 ----
    {
      quizId: quiz2.id,
      type: 'pinyin_combination',
      content: '组合声母h + 韵母e + 第二声',
      options: JSON.stringify([]),
      answer: 'he2',
      explanation: 'h + e + 第二声 = hé（和）。',
      sortOrder: 15,
      pinyinBase: 'he',
      tone: 2,
    },
    {
      quizId: quiz2.id,
      type: 'pinyin_combination',
      content: '组合声母sh + 韵母ui + 第三声',
      options: JSON.stringify([]),
      answer: 'shui3',
      explanation: 'sh + ui + 第三声 = shuǐ（水）。',
      sortOrder: 16,
      pinyinBase: 'shui',
      tone: 3,
    },
  ]

  for (const q of chapter2Questions) {
    await prisma.quizQuestion.create({ data: q })
  }

  // ============================================================
  // 第三章：拼读规则
  // ============================================================
  const chapter3 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第三章：拼读规则',
      videoUrl: '/videos/pinyin/chapter3.mp4',
      duration: 720,
      sortOrder: 3,
      freePreview: false,
    },
  })

  const quiz3 = await prisma.quiz.create({
    data: {
      chapterId: chapter3.id,
      title: '拼读规则练习',
    },
  })

  const chapter3Questions = [
    // ---- 两拼音节拼读 ----
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '花',
      options: JSON.stringify([
        { label: 'A', text: 'huā' },
        { label: 'B', text: 'guā' },
        { label: 'C', text: 'kuā' },
        { label: 'D', text: 'huá' },
      ]),
      answer: 'A',
      explanation: '"花"的拼音是huā，由声母h和韵母ua组成，第一声。',
      sortOrder: 1,
      pinyinBase: 'hua',
      tone: 1,
    },
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '哥',
      options: JSON.stringify([
        { label: 'A', text: 'kē' },
        { label: 'B', text: 'gē' },
        { label: 'C', text: 'hē' },
        { label: 'D', text: 'gě' },
      ]),
      answer: 'B',
      explanation: '"哥"的拼音是gē，由声母g和韵母e组成，第一声。',
      sortOrder: 2,
      pinyinBase: 'ge',
      tone: 1,
    },
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '喝',
      options: JSON.stringify([
        { label: 'A', text: 'gē' },
        { label: 'B', text: 'kē' },
        { label: 'C', text: 'hē' },
        { label: 'D', text: 'hè' },
      ]),
      answer: 'C',
      explanation: '"喝"的拼音是hē，由声母h和韵母e组成，第一声。',
      sortOrder: 3,
      pinyinBase: 'he',
      tone: 1,
    },

    // ---- 三拼音节 ----
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '家',
      options: JSON.stringify([
        { label: 'A', text: 'jiā' },
        { label: 'B', text: 'qiā' },
        { label: 'C', text: 'xiā' },
        { label: 'D', text: 'jiá' },
      ]),
      answer: 'A',
      explanation: '"家"的拼音是jiā，三拼音节：声母j + 介母i + 韵母a。',
      sortOrder: 4,
      pinyinBase: 'jia',
      tone: 1,
    },
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '瓜',
      options: JSON.stringify([
        { label: 'A', text: 'huā' },
        { label: 'B', text: 'guā' },
        { label: 'C', text: 'kuā' },
        { label: 'D', text: 'guá' },
      ]),
      answer: 'B',
      explanation: '"瓜"的拼音是guā，三拼音节：声母g + 介母u + 韵母a。',
      sortOrder: 5,
      pinyinBase: 'gua',
      tone: 1,
    },
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '学',
      options: JSON.stringify([
        { label: 'A', text: 'xué' },
        { label: 'B', text: 'jué' },
        { label: 'C', text: 'quē' },
        { label: 'D', text: 'xuě' },
      ]),
      answer: 'A',
      explanation: '"学"的拼音是xué，三拼音节：声母x + 介母ü + 韵母e。',
      sortOrder: 6,
      pinyinBase: 'xue',
      tone: 2,
    },

    // ---- jqx 与 ü 相拼规则 ----
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '鱼',
      options: JSON.stringify([
        { label: 'A', text: 'yú' },
        { label: 'B', text: 'yū' },
        { label: 'C', text: 'yǚ' },
        { label: 'D', text: 'yǜ' },
      ]),
      answer: 'A',
      explanation: '"鱼"的拼音是yú，ü 行韵母前没有声母时，ü 写成 yu。',
      sortOrder: 7,
      pinyinBase: 'yu',
      tone: 2,
    },
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '女',
      options: JSON.stringify([
        { label: 'A', text: 'nǚ' },
        { label: 'B', text: 'lǚ' },
        { label: 'C', text: 'nǔ' },
        { label: 'D', text: 'lǔ' },
      ]),
      answer: 'A',
      explanation: '"女"的拼音是nǚ，声母n和韵母ü相拼，ü上两点保留。',
      sortOrder: 8,
      pinyinBase: 'nv',
      tone: 3,
    },
    {
      quizId: quiz3.id,
      type: 'char_to_pinyin',
      content: '绿',
      options: JSON.stringify([
        { label: 'A', text: 'lǜ' },
        { label: 'B', text: 'lù' },
        { label: 'C', text: 'nǜ' },
        { label: 'D', text: 'lú' },
      ]),
      answer: 'A',
      explanation: '"绿"的拼音是lǜ，声母l和韵母ü相拼，ü上两点保留。',
      sortOrder: 9,
      pinyinBase: 'lv',
      tone: 4,
    },

    // ---- typing_to_pinyin: 拼读输入 ----
    {
      quizId: quiz3.id,
      type: 'typing_to_pinyin',
      content: '请写出"想"的拼音',
      options: JSON.stringify([]),
      answer: 'xiang3',
      explanation: '"想"的拼音是xiǎng，三拼音节。',
      sortOrder: 10,
      pinyinBase: 'xiang',
      tone: 3,
    },
    {
      quizId: quiz3.id,
      type: 'typing_to_pinyin',
      content: '请写出"光"的拼音',
      options: JSON.stringify([]),
      answer: 'guang1',
      explanation: '"光"的拼音是guāng，三拼音节。',
      sortOrder: 11,
      pinyinBase: 'guang',
      tone: 1,
    },
    {
      quizId: quiz3.id,
      type: 'typing_to_pinyin',
      content: '请写出"全"的拼音',
      options: JSON.stringify([]),
      answer: 'quan2',
      explanation: '"全"的拼音是quán，声母q和üan相拼时ü写成u。',
      sortOrder: 12,
      pinyinBase: 'quan',
      tone: 2,
    },

    // ---- pinyin_combination ----
    {
      quizId: quiz3.id,
      type: 'pinyin_combination',
      content: '组合三拼音节：声母 j + 介母 i + 韵母 a + 第一声',
      options: JSON.stringify([]),
      answer: 'jia1',
      explanation: 'j + i + a + 第一声 = jiā（家）。',
      sortOrder: 13,
      pinyinBase: 'jia',
      tone: 1,
    },
    {
      quizId: quiz3.id,
      type: 'pinyin_combination',
      content: '组合三拼音节：声母 g + 介母 u + 韵母 uang + 第一声',
      options: JSON.stringify([]),
      answer: 'guang1',
      explanation: 'g + u + ang + 第一声 = guāng（光）。',
      sortOrder: 14,
      pinyinBase: 'guang',
      tone: 1,
    },
    {
      quizId: quiz3.id,
      type: 'pinyin_combination',
      content: '组合：声母 sh + 韵母 uan + 第二声',
      options: JSON.stringify([]),
      answer: 'shuan2',
      explanation: 'sh + uan + 第二声 = shuán。',
      sortOrder: 15,
      pinyinBase: 'shuan',
      tone: 2,
    },

    // ---- pinyin_to_char ----
    {
      quizId: quiz3.id,
      type: 'pinyin_to_char',
      content: 'chuáng',
      options: JSON.stringify([
        { label: 'A', text: '床' },
        { label: 'B', text: '窗' },
        { label: 'C', text: '闯' },
        { label: 'D', text: '创' },
      ]),
      answer: 'A',
      explanation: '"chuáng"是"床"。',
      sortOrder: 16,
      pinyinBase: 'chuang',
      tone: 2,
    },
    {
      quizId: quiz3.id,
      type: 'pinyin_to_char',
      content: 'shuāng',
      options: JSON.stringify([
        { label: 'A', text: '双' },
        { label: 'B', text: '霜' },
        { label: 'C', text: '爽' },
        { label: 'D', text: '谁' },
      ]),
      answer: 'B',
      explanation: '"shuāng"是"霜"。',
      sortOrder: 17,
      pinyinBase: 'shuang',
      tone: 1,
    },
  ]

  for (const q of chapter3Questions) {
    await prisma.quizQuestion.create({ data: q })
  }

  // ============================================================
  // 第四章：拼音应用
  // ============================================================
  const chapter4 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第四章：拼音应用',
      videoUrl: '/videos/pinyin/chapter4.mp4',
      duration: 900,
      sortOrder: 4,
      freePreview: false,
    },
  })

  const quiz4 = await prisma.quiz.create({
    data: {
      chapterId: chapter4.id,
      title: '综合应用练习',
    },
  })

  const chapter4Questions = [
    // ---- 综合 char_to_pinyin ----
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '春',
      options: JSON.stringify([
        { label: 'A', text: 'chūn' },
        { label: 'B', text: 'cūn' },
        { label: 'C', text: 'shūn' },
        { label: 'D', text: 'chún' },
      ]),
      answer: 'A',
      explanation: '"春"的拼音是chūn，翘舌音声母ch。',
      sortOrder: 1,
      pinyinBase: 'chun',
      tone: 1,
    },
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '夏',
      options: JSON.stringify([
        { label: 'A', text: 'xià' },
        { label: 'B', text: 'jià' },
        { label: 'C', text: 'qià' },
        { label: 'D', text: 'xiá' },
      ]),
      answer: 'A',
      explanation: '"夏"的拼音是xià，第四声。',
      sortOrder: 2,
      pinyinBase: 'xia',
      tone: 4,
    },
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '秋',
      options: JSON.stringify([
        { label: 'A', text: 'qiū' },
        { label: 'B', text: 'jiū' },
        { label: 'C', text: 'xiū' },
        { label: 'D', text: 'qiú' },
      ]),
      answer: 'A',
      explanation: '"秋"的拼音是qiū，第一声。',
      sortOrder: 3,
      pinyinBase: 'qiu',
      tone: 1,
    },
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '冬',
      options: JSON.stringify([
        { label: 'A', text: 'dōng' },
        { label: 'B', text: 'tōng' },
        { label: 'C', text: 'dòng' },
        { label: 'D', text: 'nōng' },
      ]),
      answer: 'A',
      explanation: '"冬"的拼音是dōng，第一声。',
      sortOrder: 4,
      pinyinBase: 'dong',
      tone: 1,
    },

    // ---- 翘舌音和平舌音区分 ----
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '吃',
      options: JSON.stringify([
        { label: 'A', text: 'cī' },
        { label: 'B', text: 'chī' },
        { label: 'C', text: 'shī' },
        { label: 'D', text: 'sī' },
      ]),
      answer: 'B',
      explanation: '"吃"的拼音是chī，翘舌音声母ch，第一声。',
      sortOrder: 5,
      pinyinBase: 'chi',
      tone: 1,
    },
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '四',
      options: JSON.stringify([
        { label: 'A', text: 'shì' },
        { label: 'B', text: 'sì' },
        { label: 'C', text: 'shí' },
        { label: 'D', text: 'sī' },
      ]),
      answer: 'B',
      explanation: '"四"的拼音是sì，平舌音声母s，第四声。',
      sortOrder: 6,
      pinyinBase: 'si',
      tone: 4,
    },
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '十',
      options: JSON.stringify([
        { label: 'A', text: 'sì' },
        { label: 'B', text: 'shì' },
        { label: 'C', text: 'shí' },
        { label: 'D', text: 'sī' },
      ]),
      answer: 'C',
      explanation: '"十"的拼音是shí，翘舌音声母sh，第二声。',
      sortOrder: 7,
      pinyinBase: 'shi',
      tone: 2,
    },

    // ---- 鼻韵母练习 ----
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '山',
      options: JSON.stringify([
        { label: 'A', text: 'sān' },
        { label: 'B', text: 'shān' },
        { label: 'C', text: 'shāng' },
        { label: 'D', text: 'sāng' },
      ]),
      answer: 'B',
      explanation: '"山"的拼音是shān，翘舌音+前鼻韵母an。',
      sortOrder: 8,
      pinyinBase: 'shan',
      tone: 1,
    },
    {
      quizId: quiz4.id,
      type: 'char_to_pinyin',
      content: '上',
      options: JSON.stringify([
        { label: 'A', text: 'sàng' },
        { label: 'B', text: 'sāng' },
        { label: 'C', text: 'shàng' },
        { label: 'D', text: 'shāng' },
      ]),
      answer: 'C',
      explanation: '"上"的拼音是shàng，翘舌音+后鼻韵母ang，第四声。',
      sortOrder: 9,
      pinyinBase: 'shang',
      tone: 4,
    },

    // ---- 综合 typing_to_pinyin ----
    {
      quizId: quiz4.id,
      type: 'typing_to_pinyin',
      content: '请写出"中国"的拼音',
      options: JSON.stringify([]),
      answer: 'zhong1guo2',
      explanation: '"中国"的拼音是zhōngguó。',
      sortOrder: 10,
      pinyinBase: 'zhongguo',
      tone: 1,
    },
    {
      quizId: quiz4.id,
      type: 'typing_to_pinyin',
      content: '请写出"学习"的拼音',
      options: JSON.stringify([]),
      answer: 'xue2xi2',
      explanation: '"学习"的拼音是xuéxí。',
      sortOrder: 11,
      pinyinBase: 'xuexi',
      tone: 2,
    },
    {
      quizId: quiz4.id,
      type: 'typing_to_pinyin',
      content: '请写出"朋友"的拼音',
      options: JSON.stringify([]),
      answer: 'peng2you3',
      explanation: '"朋友"的拼音是péngyǒu。',
      sortOrder: 12,
      pinyinBase: 'pengyou',
      tone: 2,
    },
    {
      quizId: quiz4.id,
      type: 'typing_to_pinyin',
      content: '请写出"老师"的拼音',
      options: JSON.stringify([]),
      answer: 'lao3shi1',
      explanation: '"老师"的拼音是lǎoshī。',
      sortOrder: 13,
      pinyinBase: 'laoshi',
      tone: 3,
    },

    // ---- pinyin_combination: 复杂组合 ----
    {
      quizId: quiz4.id,
      type: 'pinyin_combination',
      content: '组合：声母 zh + 韵母 ong + 第一声',
      options: JSON.stringify([]),
      answer: 'zhong1',
      explanation: 'zh + ong + 第一声 = zhōng（中）。',
      sortOrder: 14,
      pinyinBase: 'zhong',
      tone: 1,
    },
    {
      quizId: quiz4.id,
      type: 'pinyin_combination',
      content: '组合：声母 ch + 韵母 un + 第一声',
      options: JSON.stringify([]),
      answer: 'chun1',
      explanation: 'ch + un + 第一声 = chūn（春）。',
      sortOrder: 15,
      pinyinBase: 'chun',
      tone: 1,
    },
    {
      quizId: quiz4.id,
      type: 'pinyin_combination',
      content: '组合：声母 q + 介母 i + 韵母 ang + 第二声',
      options: JSON.stringify([]),
      answer: 'qiang2',
      explanation: 'q + i + ang + 第二声 = qiáng（强）。',
      sortOrder: 16,
      pinyinBase: 'qiang',
      tone: 2,
    },

    // ---- pinyin_to_char: 常用词 ----
    {
      quizId: quiz4.id,
      type: 'pinyin_to_char',
      content: 'péngyǒu',
      options: JSON.stringify([
        { label: 'A', text: '朋友' },
        { label: 'B', text: '同学' },
        { label: 'C', text: '伙伴' },
        { label: 'D', text: '同事' },
      ]),
      answer: 'A',
      explanation: '"péngyǒu"是"朋友"。',
      sortOrder: 17,
      pinyinBase: 'pengyou',
      tone: 2,
    },
    {
      quizId: quiz4.id,
      type: 'pinyin_to_char',
      content: 'lǎoshī',
      options: JSON.stringify([
        { label: 'A', text: '老师' },
        { label: 'B', text: '老四' },
        { label: 'C', text: '老十' },
        { label: 'D', text: '老师傅' },
      ]),
      answer: 'A',
      explanation: '"lǎoshī"是"老师"。',
      sortOrder: 18,
      pinyinBase: 'laoshi',
      tone: 3,
    },
    {
      quizId: quiz4.id,
      type: 'pinyin_to_char',
      content: 'zhōngguó',
      options: JSON.stringify([
        { label: 'A', text: '中国' },
        { label: 'B', text: '重工' },
        { label: 'C', text: '中古' },
        { label: 'D', text: '钟国' },
      ]),
      answer: 'A',
      explanation: '"zhōngguó"是"中国"。',
      sortOrder: 19,
      pinyinBase: 'zhongguo',
      tone: 1,
    },

    // ---- audio_to_pinyin（占位） ----
    {
      quizId: quiz4.id,
      type: 'audio_to_pinyin',
      content: '请听录音，写出所读汉字的拼音',
      options: JSON.stringify([
        { label: 'A', text: 'zhōng' },
        { label: 'B', text: 'zhòng' },
        { label: 'C', text: 'chōng' },
        { label: 'D', text: 'chòng' },
      ]),
      answer: 'A',
      explanation: '录音中读的是"中"，zhōng，第一声。',
      sortOrder: 20,
      pinyinBase: 'zhong',
      tone: 1,
      audioUrl: '/audio/pinyin/zhong1.mp3',
    },
  ]

  for (const q of chapter4Questions) {
    await prisma.quizQuestion.create({ data: q })
  }

  console.log('拼音课程完整数据创建成功！')
  console.log(`课程ID: ${course.id}`)
  console.log(`章节数: 4`)
  console.log(`练习数: 4（每章1个）`)
  console.log(`总题数: ${chapter1Questions.length + chapter2Questions.length + chapter3Questions.length + chapter4Questions.length}`)
  console.log(`  第一章: ${chapter1Questions.length} 题`)
  console.log(`  第二章: ${chapter2Questions.length} 题`)
  console.log(`  第三章: ${chapter3Questions.length} 题`)
  console.log(`  第四章: ${chapter4Questions.length} 题`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
