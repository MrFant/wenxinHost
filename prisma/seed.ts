import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.progress.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.setting.deleteMany()

  // Create admin user (password: admin123)
  const pwdHash = await bcrypt.hash('admin123', 10)
  await prisma.admin.create({
    data: {
      username: 'admin',
      pwdHash,
      role: 'admin',
    },
  })

  // Create sample courses
  const courses = [
    {
      title: '前端开发 — 从零搭建你的第一个网站',
      description:
        '零基础也能学会的前端开发课。从HTML/CSS起步，到React实战项目，手把手带你做出能上线的网站。不讲废话，每节课都有代码产出，学完就能接单做页面。',
      cover: '/images/courses/frontend.jpg',
      price: 199,
      category: '编程开发',
      status: 'published',
      chapters: {
        create: [
          { title: '1.1 前端是什么？能做什么？', sortOrder: 1, duration: 600, freePreview: true },
          { title: '1.2 安装 VS Code 和浏览器开发者工具', sortOrder: 2, duration: 600, freePreview: true },
          { title: '1.3 写出你的第一个 HTML 页面', sortOrder: 3, duration: 900, freePreview: true },
          { title: '1.4 让页面变好看：CSS 初体验', sortOrder: 4, duration: 900, freePreview: true },
          { title: '2.1 常用 HTML 标签大全', sortOrder: 5, duration: 1200, freePreview: true },
          { title: '2.2 CSS 选择器和盒模型', sortOrder: 6, duration: 1500, freePreview: true },
          { title: '2.3 Flexbox 弹性布局', sortOrder: 7, duration: 1200, freePreview: false },
          { title: '2.4 Grid 网格布局', sortOrder: 8, duration: 1200, freePreview: false },
          { title: '2.5 实战：做一个个人简历页面', sortOrder: 9, duration: 1800, freePreview: false },
          { title: '3.1 变量、数据类型和运算符', sortOrder: 10, duration: 1200, freePreview: false },
          { title: '3.2 条件判断和循环', sortOrder: 11, duration: 1200, freePreview: false },
          { title: '3.3 函数和数组操作', sortOrder: 12, duration: 1500, freePreview: false },
          { title: '3.4 DOM 操作', sortOrder: 13, duration: 1500, freePreview: false },
          { title: '3.5 实战：待办事项清单', sortOrder: 14, duration: 1800, freePreview: false },
        ],
      },
    },
    {
      title: '后端开发 — Node.js 全栈后端实战',
      description:
        '用 JavaScript 一门语言搞定后端开发。从 Express 到 NestJS，从数据库到缓存，从单体到微服务，带你掌握企业级后端开发技能。',
      cover: '/images/courses/backend.jpg',
      price: 199,
      category: '编程开发',
      status: 'published',
      chapters: {
        create: [
          { title: '1.1 Node.js 是什么？为什么学它？', sortOrder: 1, duration: 900, freePreview: true },
          { title: '1.2 环境搭建和 npm 包管理', sortOrder: 2, duration: 1200, freePreview: true },
          { title: '1.3 第一个 HTTP 服务器', sortOrder: 3, duration: 1200, freePreview: true },
          { title: '1.4 模块系统和文件操作', sortOrder: 4, duration: 1200, freePreview: true },
          { title: '2.1 Express 安装和路由', sortOrder: 5, duration: 1200, freePreview: true },
          { title: '2.2 中间件机制', sortOrder: 6, duration: 1500, freePreview: true },
          { title: '2.3 请求处理和响应', sortOrder: 7, duration: 1200, freePreview: false },
          { title: '2.4 实战：RESTful API', sortOrder: 8, duration: 1500, freePreview: false },
          { title: '3.1 MySQL 基础和 SQL 语法', sortOrder: 9, duration: 1500, freePreview: false },
          { title: '3.2 Prisma ORM 实战', sortOrder: 10, duration: 1500, freePreview: false },
        ],
      },
    },
    {
      title: 'AI 不神秘：从零开始学机器学习',
      description:
        '不需要博士学历，不需要高数满分。用最通俗的语言和最直观的案例，带你理解 AI 的核心原理，动手做出自己的 AI 模型。',
      cover: '/images/courses/ai.jpg',
      price: 249,
      category: '人工智能',
      status: 'published',
      chapters: {
        create: [
          { title: '1.1 AI、机器学习、深度学习的关系', sortOrder: 1, duration: 900, freePreview: true },
          { title: '1.2 AI 能做什么？不能做什么？', sortOrder: 2, duration: 900, freePreview: true },
          { title: '1.3 学习路线图和环境搭建', sortOrder: 3, duration: 1200, freePreview: true },
          { title: '2.1 Python 基础语法速览', sortOrder: 4, duration: 1200, freePreview: true },
          { title: '2.2 NumPy 数值计算', sortOrder: 5, duration: 1500, freePreview: true },
          { title: '2.3 Pandas 数据处理', sortOrder: 6, duration: 1500, freePreview: true },
          { title: '3.1 监督学习 vs 无监督学习', sortOrder: 7, duration: 900, freePreview: false },
          { title: '3.2 线性回归：预测房价', sortOrder: 8, duration: 1500, freePreview: false },
        ],
      },
    },
    {
      title: '设计师速成：从审美到落地',
      description:
        '不是教你用工具，而是教你"设计思维"。从色彩构图到用户体验，从 Figma 实战到设计系统搭建。',
      cover: '/images/courses/design.jpg',
      price: 169,
      category: '设计创意',
      status: 'published',
      chapters: {
        create: [
          { title: '1.1 设计的本质是解决问题', sortOrder: 1, duration: 900, freePreview: true },
          { title: '1.2 好设计的10个原则', sortOrder: 2, duration: 1200, freePreview: true },
          { title: '2.1 色彩理论和配色方法', sortOrder: 3, duration: 1500, freePreview: true },
          { title: '2.2 字体选择和排版规则', sortOrder: 4, duration: 1500, freePreview: true },
          { title: '3.1 Figma 界面和基础操作', sortOrder: 5, duration: 1200, freePreview: false },
          { title: '3.2 组件和自动布局', sortOrder: 6, duration: 1500, freePreview: false },
        ],
      },
    },
    {
      title: '从小白到项目经理',
      description:
        '项目做不完、需求总变、团队撕逼？这门课教你用专业方法管项目。不讲虚的理论，只教你实战中真正好用的工具和方法。',
      cover: '/images/courses/pm.jpg',
      price: 129,
      category: '职场技能',
      status: 'published',
      chapters: {
        create: [
          { title: '1.1 什么是项目？什么是项目管理？', sortOrder: 1, duration: 900, freePreview: true },
          { title: '1.2 项目经理的角色和能力模型', sortOrder: 2, duration: 900, freePreview: true },
          { title: '2.1 需求收集和分析', sortOrder: 3, duration: 1200, freePreview: true },
          { title: '2.2 项目章程编写', sortOrder: 4, duration: 1200, freePreview: true },
          { title: '3.1 WBS 工作分解', sortOrder: 5, duration: 1500, freePreview: false },
          { title: '3.2 进度计划：甘特图和关键路径', sortOrder: 6, duration: 1500, freePreview: false },
        ],
      },
    },
  ]

  for (const courseData of courses) {
    await prisma.course.create({ data: courseData })
  }

  // Create site settings
  const settings = [
    { key: 'site_name', value: '文心课堂' },
    { key: 'site_slogan', value: '让学习更简单' },
    { key: 'contact_email', value: 'admin@wenxin.host' },
    { key: 'wechat_mp_qrcode', value: '' },
  ]

  for (const setting of settings) {
    await prisma.setting.create({ data: setting })
  }

  console.log('✅ Seed data created successfully!')
  console.log(`  - 1 admin user (username: admin, password: admin123)`)
  console.log(`  - 5 courses with chapters`)
  console.log(`  - ${settings.length} site settings`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
