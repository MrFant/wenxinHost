# 文心课堂 — 数据库设计

> 技术栈：Next.js + Prisma ORM + SQLite  
> 最后更新：2026-05-10

---

## 1. ER 关系图（ASCII）

```
┌───────────┐       ┌───────────────┐
│   admins   │       │    users      │
│───────────│       │───────────────│
│ id (PK)   │       │ id (PK)       │
│ username  │       │ phone (UQ)    │
│ pwd_hash  │       │ nickname      │
│ role      │       │ avatar        │
│ createdAt │       │ role          │
│ updatedAt │       │ createdAt     │
│ isDeleted │       │ updatedAt     │
└───────────┘       │ isDeleted     │
                    └───────┬───────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
          ▼                 ▼                  ▼
   ┌────────────┐   ┌────────────┐     ┌────────────┐
   │   orders   │   │  progress  │     │   reviews  │
   │────────────│   │────────────│     │────────────│
   │ id (PK)    │   │ id (PK)    │     │ id (PK)    │
   │ userId(FK) │   │ userId(FK) │     │ userId(FK) │
   │ courseId   │   │ chapterId  │     │ courseId   │
   │ amount     │   │ watchedSec │     │ rating     │
   │ status     │   │ completed  │     │ content    │
   └─────┬──────┘   └─────┬──────┘     └────────────┘
         │                │
         ▼                ▼
  ┌────────────┐   ┌────────────┐
  │  payments  │   │  chapters  │
  │────────────│   │────────────│
  │ id (PK)    │   │ id (PK)    │
  │ orderId(FK)│   │ courseId   │
  │ method     │   │ title      │
  │ amount     │   │ videoUrl   │
  │ paidAt     │   │ duration   │
  │ wxPrepayId │   │ sortOrder  │
  └────────────┘   │ freePreview│
                   └─────┬──────┘
                         │
                         ▼
                  ┌────────────┐         ┌────────────┐
                  │   courses  │────────▶│ categories │
                  │────────────│         │────────────│
                  │ id (PK)    │         │ id (PK)    │
                  │ categoryId │         │ name       │
                  │ title      │         │ parentId   │
                  │ price      │         │ sortOrder  │
                  │ status     │         └────────────┘
                  └────────────┘

  ┌────────────┐   ┌────────────┐
  │  settings  │   │   banners  │
  │────────────│   │────────────│
  │ id (PK)    │   │ id (PK)    │
  │ key (UQ)   │   │ imageUrl   │
  │ value      │   │ link       │
  │ label      │   │ sortOrder  │
  │ group      │   │ active     │
  └────────────┘   └────────────┘
```

### 关联关系汇总

| 关系 | 类型 | 说明 |
|------|------|------|
| user → orders | 1:N | 一个用户有多个订单 |
| user → progress | 1:N | 一个用户有多条学习进度 |
| user → reviews | 1:N | 一个用户有多条评价 |
| course → orders | 1:N | 一门课程有多个订单 |
| course → chapters | 1:N | 一门课程有多个章节 |
| course → reviews | 1:N | 一门课程有多条评价 |
| category → courses | 1:N | 一个分类下有多门课程 |
| category → category | 自引用 | 父子层级分类 |
| order → payments | 1:N | 一个订单可有多条支付记录 |
| chapter → progress | 1:N | 一个章节有多条进度记录 |

---

## 2. 完整 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ========================
// 枚举
// ========================

enum UserRole {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  REFUNDED
  CANCELLED
}

enum PaymentMethod {
  WECHAT_H5
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  OFFLINE
}

// ========================
// Models
// ========================

/// 用户（手机号验证码登录）
model User {
  id          String    @id @default(cuid())
  phone       String    @unique
  nickname    String?
  avatar      String?
  role        UserRole  @default(USER)
  metadata    String?   // JSON 扩展字段
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  isDeleted   Boolean   @default(false)

  orders      Order[]
  progress    Progress[]
  reviews     Review[]

  @@index([phone])
  @@index([isDeleted])
  @@map("users")
}

/// 管理员（用户名 + 密码登录）
model Admin {
  id           String   @id @default(cuid())
  username     String   @unique
  passwordHash String   @map("password_hash")
  nickname     String?
  role         UserRole @default(ADMIN)
  metadata     String?  // JSON 扩展字段
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  isDeleted    Boolean  @default(false)

  @@index([isDeleted])
  @@map("admins")
}

/// 课程分类（支持层级）
model Category {
  id        String   @id @default(cuid())
  name      String
  parentId  String?  @map("parent_id")
  icon      String?
  sortOrder Int      @default(0) @map("sort_order")
  metadata  String?  // JSON 扩展字段
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
  courses  Course[]

  @@index([parentId])
  @@index([sortOrder])
  @@index([isDeleted])
  @@map("categories")
}

/// 课程
model Course {
  id          String       @id @default(cuid())
  title       String
  description String?
  cover       String?      // 封面图 URL
  price       Int          @default(0) // 单位：分
  status      CourseStatus @default(DRAFT)
  categoryId  String?      @map("category_id")
  metadata    String?      // JSON 扩展字段（标签、难度等）
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  isDeleted   Boolean      @default(false)

  category Category? @relation(fields: [categoryId], references: [id])
  chapters Chapter[]
  orders   Order[]
  reviews  Review[]

  @@index([categoryId])
  @@index([status])
  @@index([price])
  @@index([isDeleted])
  @@map("courses")
}

/// 课程章节
model Chapter {
  id           String   @id @default(cuid())
  courseId     String   @map("course_id")
  title        String
  videoUrl     String?  @map("video_url") // 阿里云OSS视频地址
  duration     Int?     // 视频时长（秒）
  sortOrder    Int      @default(0) @map("sort_order")
  freePreview  Boolean  @default(false) @map("free_preview") // 是否免费试看
  metadata     String?  // JSON 扩展字段
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  isDeleted    Boolean  @default(false)

  course   Course     @relation(fields: [courseId], references: [id])
  progress Progress[]

  @@index([courseId])
  @@index([sortOrder])
  @@index([isDeleted])
  @@map("chapters")
}

/// 订单
model Order {
  id           String      @id @default(cuid())
  orderNo      String      @unique @map("order_no") // 业务订单号
  userId       String      @map("user_id")
  courseId     String      @map("course_id")
  amount       Int         // 单位：分
  status       OrderStatus @default(PENDING)
  transactionId String?    @map("transaction_id") // 微信支付交易号
  metadata     String?     // JSON 扩展字段
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  isDeleted    Boolean     @default(false)

  user     User      @relation(fields: [userId], references: [id])
  course   Course    @relation(fields: [courseId], references: [id])
  payments Payment[]

  @@index([userId])
  @@index([courseId])
  @@index([orderNo])
  @@index([status])
  @@index([isDeleted])
  @@map("orders")
}

/// 支付记录
model Payment {
  id          String        @id @default(cuid())
  orderId     String        @map("order_id")
  method      PaymentMethod @default(WECHAT_H5)
  amount      Int           // 单位：分
  wxPrepayId  String?       @map("wx_prepay_id") // 微信预支付交易会话标识
  paidAt      DateTime?     @map("paid_at")
  metadata    String?       // JSON 扩展字段（回调原始数据等）
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  order Order @relation(fields: [orderId], references: [id])

  @@index([orderId])
  @@map("payments")
}

/// 学习进度
model Progress {
  id              String   @id @default(cuid())
  userId          String   @map("user_id")
  chapterId       String   @map("chapter_id")
  watchedDuration Int      @default(0) @map("watched_duration") // 已观看秒数
  completed       Boolean  @default(false)
  lastPosition    Int?     @default(0) @map("last_position") // 上次播放位置（秒）
  metadata        String?  // JSON 扩展字段
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user    User    @relation(fields: [userId], references: [id])
  chapter Chapter @relation(fields: [chapterId], references: [id])

  @@unique([userId, chapterId])
  @@index([userId])
  @@index([chapterId])
  @@map("progress")
}

/// 课程评价
model Review {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  courseId   String   @map("course_id")
  rating    Int      // 1-5 星
  content   String?
  metadata  String?  // JSON 扩展字段
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  user   User   @relation(fields: [userId], references: [id])
  course Course @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId]) // 一个用户对一门课程只能评价一次
  @@index([userId])
  @@index([courseId])
  @@index([rating])
  @@index([isDeleted])
  @@map("reviews")
}

/// 系统配置（key-value）
model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  label     String?  // 配置项说明
  group     String?  // 分组（如 site / payment / sms）
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([group])
  @@map("settings")
}

/// 轮播图
model Banner {
  id        String   @id @default(cuid())
  title     String?
  imageUrl  String   @map("image_url")
  link      String?  // 点击跳转链接
  sortOrder Int      @default(0) @map("sort_order")
  active    Boolean  @default(true)
  metadata  String?  // JSON 扩展字段
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@index([sortOrder])
  @@index([active])
  @@index([isDeleted])
  @@map("banners")
}
```

### 设计原则说明

| 原则 | 实现 |
|------|------|
| 主键 | `cuid()` 全局唯一、URL友好、不可猜测 |
| 时间戳 | `createdAt` 自动 `now()`，`updatedAt` 自动 `@updatedAt` |
| 软删除 | `isDeleted Boolean @default(false)`，查询时过滤 |
| 金额 | `Int` 类型，单位为**分**（避免浮点精度问题） |
| 扩展字段 | `metadata String?`（JSON字符串），便于后续灵活扩展 |
| 索引 | 外键、高频查询字段、状态字段均建索引 |
| 表名映射 | `@@map()` 明确指定表名为小写复数 |

---

## 3. 种子数据设计

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // ======== 1. 默认管理员 ========
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: await hash('wenxin@2026', 12),
      nickname: '超级管理员',
      role: 'ADMIN',
    },
  })
  console.log('✅ 管理员创建完成:', admin.username)

  // ======== 2. 课程分类（5个） ========
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: '编程开发', icon: '💻', sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: '人工智能', icon: '🤖', sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: '产品设计', icon: '🎨', sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: '商业管理', icon: '📊', sortOrder: 4 },
    }),
    prisma.category.create({
      data: { name: '个人成长', icon: '🚀', sortOrder: 5 },
    }),
  ])

  // 在"编程开发"下添加子分类
  await Promise.all([
    prisma.category.create({
      data: { name: '前端开发', parentId: categories[0].id, sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: '后端开发', parentId: categories[0].id, sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: '移动开发', parentId: categories[0].id, sortOrder: 3 },
    }),
  ])

  console.log('✅ 分类创建完成:', categories.length, '个顶级分类')

  // ======== 3. 系统配置项 ========
  const settings = [
    // 站点基础
    { key: 'site.name',         value: '文心课堂',              label: '站点名称',     group: 'site' },
    { key: 'site.logo',         value: '/images/logo.png',      label: '站点Logo',     group: 'site' },
    { key: 'site.favicon',      value: '/favicon.ico',          label: 'Favicon',      group: 'site' },
    { key: 'site.description',  value: '优质在线教育平台',       label: '站点描述',     group: 'site' },
    { key: 'site.keywords',     value: '在线教育,课程,学习',     label: 'SEO关键词',   group: 'site' },
    { key: 'site.copyright',    value: '© 2026 文心课堂',       label: '版权信息',     group: 'site' },

    // 微信支付
    { key: 'payment.wx_appid',       value: '', label: '微信支付AppID',      group: 'payment' },
    { key: 'payment.wx_mchid',       value: '', label: '微信商户号',          group: 'payment' },
    { key: 'payment.wx_api_key',     value: '', label: '微信支付API密钥',     group: 'payment' },
    { key: 'payment.wx_notify_url',  value: '', label: '支付回调地址',        group: 'payment' },

    // 短信验证码
    { key: 'sms.provider',     value: 'aliyun',      label: '短信服务商',     group: 'sms' },
    { key: 'sms.sign_name',    value: '文心课堂',     label: '短信签名',       group: 'sms' },
    { key: 'sms.template_id',  value: '',             label: '验证码模板ID',   group: 'sms' },
    { key: 'sms.code_ttl',     value: '300',          label: '验证码有效期(秒)', group: 'sms' },

    // 阿里云OSS
    { key: 'oss.endpoint',        value: '',          label: 'OSS Endpoint',     group: 'oss' },
    { key: 'oss.bucket',          value: '',          label: 'OSS Bucket',       group: 'oss' },
    { key: 'oss.cdn_domain',      value: '',          label: 'CDN域名',          group: 'oss' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('✅ 系统配置创建完成:', settings.length, '项')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 种子数据汇总

| 数据 | 数量 | 说明 |
|------|------|------|
| 管理员 | 1 | 用户名 `admin`，默认密码 `wenxin@2026` |
| 顶级分类 | 5 | 编程开发、人工智能、产品设计、商业管理、个人成长 |
| 子分类 | 3 | 前端开发、后端开发、移动开发（隶属编程开发） |
| 系统配置 | 18 | 站点6项 + 微信支付4项 + 短信4项 + OSS3项 + 验证码TTL1项 |

---

## 附录：初始化命令

```bash
# 安装依赖
npm install prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs

# 初始化数据库
npx prisma migrate dev --name init

# 执行种子数据
npx prisma db seed

# 打开 Prisma Studio（可视化查看数据）
npx prisma studio
```

`package.json` 中需要添加：

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```
