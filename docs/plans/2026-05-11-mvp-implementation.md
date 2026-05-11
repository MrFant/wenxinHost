# 文心课堂 MVP 实施计划

> **For implementer:** Use TDD throughout. Write failing test first. Watch it fail. Then implement.

**Goal:** Build a working online course platform MVP with course display, phone login, WeChat H5 payment, video learning, and admin panel.

**Architecture:** Next.js 14 App Router fullstack. SQLite + Prisma for data. shadcn/ui + Tailwind for UI. API routes for backend logic. Deploy to ziiy.fun behind Caddy.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, SQLite, Vitest

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/lib/db.ts`
- Create: `prisma/schema.prisma`
- Create: `vitest.config.ts`, `tests/setup.ts`
- Create: `.env.example`, `.env`
- Create: `.gitignore`

**Step 1: Initialize Next.js project**
```bash
cd /mnt/e/Github/wenxinHost
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

**Step 2: Install dependencies**
```bash
npm install prisma @prisma/client bcryptjs jsonwebtoken zod
npm install -D vitest @vitejs/plugin-react supertest
npx shadcn@latest init
```

**Step 3: Setup Prisma**
```bash
npx prisma init --datasource-provider sqlite
```
Write `prisma/schema.prisma` with all models (see Task 2).

**Step 4: Setup Vitest**
Write `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
  },
})
```

**Step 5: Verify project runs**
```bash
npm run dev  # Should start on localhost:3000
npm run test  # Should pass (no tests yet)
```

**Step 6: Commit**
```bash
git init && git add . && git commit -m "chore: project scaffolding with Next.js + Prisma + Vitest + shadcn/ui"
```

---

## Task 2: Database Schema & Prisma Models

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `tests/db/schema.test.ts`

**Step 1: Write failing test**
```ts
// tests/db/schema.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Database Schema', () => {
  afterAll(() => prisma.$disconnect())

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: { phone: '13800138000', nickname: 'TestUser' },
    })
    expect(user.id).toBeDefined()
    expect(user.phone).toBe('13800138000')
  })

  it('should create a course with chapters', async () => {
    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        description: 'A test course',
        price: 199,
        category: '编程开发',
        chapters: {
          create: [
            { title: 'Chapter 1', sortOrder: 1, videoUrl: 'test.mp4', duration: 600 },
          ],
        },
      },
      include: { chapters: true },
    })
    expect(course.chapters).toHaveLength(1)
  })
})
```

**Step 2: Run test — confirm it fails**
```bash
npm run test tests/db/schema.test.ts
```
Expected: FAIL — schema not migrated

**Step 3: Write Prisma schema**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  phone     String   @unique
  nickname  String   @default("")
  avatar    String   @default("")
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
  progress  Progress[]
}

model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  pwdHash   String
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Course {
  id          String    @id @default(cuid())
  title       String
  description String
  cover       String    @default("")
  price       Int
  category    String
  status      String    @default("draft")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  chapters    Chapter[]
  orders      Order[]
  reviews     Review[]
}

model Chapter {
  id          String   @id @default(cuid())
  courseId    String
  title       String
  videoUrl    String   @default("")
  duration    Int      @default(0)
  sortOrder   Int      @default(0)
  freePreview Boolean  @default(false)
  course      Course   @relation(fields: [courseId], references: [id])
  progress    Progress[]
}

model Order {
  id            String   @id @default(cuid())
  userId        String
  courseId      String
  amount        Int
  status        String   @default("pending")
  transactionId String?  @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id])
  course        Course   @relation(fields: [courseId], references: [id])
  payment       Payment?
}

model Payment {
  id         String    @id @default(cuid())
  orderId    String    @unique
  method     String    @default("wechat_h5")
  amount     Int
  paidAt     DateTime?
  wxPrepayId String?
  createdAt  DateTime  @default(now())
  order      Order     @relation(fields: [orderId], references: [id])
}

model Progress {
  id          String   @id @default(cuid())
  userId      String
  chapterId   String
  watchedSec  Int      @default(0)
  completed   Boolean  @default(false)
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
  chapter     Chapter  @relation(fields: [chapterId], references: [id])

  @@unique([userId, chapterId])
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  rating    Int
  content   String   @default("")
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  course    Course   @relation(fields: [courseId], references: [id])
}

model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String
}
```

**Step 4: Migrate & run test**
```bash
npx prisma migrate dev --name init
npm run test tests/db/schema.test.ts
```
Expected: PASS

**Step 5: Write seed data**
Create `prisma/seed.ts` with 1 admin user + sample courses from COURSE-OUTLINE.md.

**Step 6: Commit**
```bash
git add . && git commit -m "feat: database schema with 9 models + seed data"
```

---

## Task 3: Layout & Navigation (Header + Footer)

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/mobile-nav.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/app/page.tsx` (homepage placeholder)

**Step 1: Build Header component**
- Logo ("文心课堂") left
- Nav links: 首页, 课程中心, 关于我们
- Right: 登录/用户头像 dropdown
- Mobile: hamburger menu → slide-out nav
- Sticky top, bg-white, shadow-sm

**Step 2: Build Footer component**
- Logo + slogan
- Links: 课程分类, 关于我们, 联系方式, 隐私政策
- Bottom: copyright + 备案号
- Responsive: stack on mobile

**Step 3: Wire into layout.tsx**
```tsx
// src/app/layout.tsx
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

**Step 4: Verify**
```bash
npm run dev
# Visit localhost:3000 — should see header + footer + placeholder content
```

**Step 5: Commit**
```bash
git add . && git commit -m "feat: responsive header + footer layout"
```

---

## Task 4: Course List Page

**Files:**
- Create: `src/app/courses/page.tsx`
- Create: `src/components/course/course-card.tsx`
- Create: `src/components/course/course-filters.tsx`
- Create: `src/app/api/courses/route.ts`
- Create: `tests/api/courses.test.ts`

**Step 1: Write failing API test**
```ts
// tests/api/courses.test.ts
import { describe, it, expect } from 'vitest'

describe('GET /api/courses', () => {
  it('should return course list', async () => {
    const res = await fetch('http://localhost:3000/api/courses')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.courses).toBeDefined()
    expect(Array.isArray(data.courses)).toBe(true)
  })

  it('should filter by category', async () => {
    const res = await fetch('http://localhost:3000/api/courses?category=编程开发')
    const data = await res.json()
    data.courses.forEach(c => expect(c.category).toBe('编程开发'))
  })
})
```

**Step 2: Implement API route**
`src/app/api/courses/route.ts` — GET handler with optional category/search query params.

**Step 3: Build CourseCard component**
- Cover image (placeholder if empty)
- Title, category tag, price (¥199)
- Star rating, student count
- Hover shadow effect
- Link to `/courses/[id]`

**Step 4: Build course list page**
- Category filter tabs at top
- Search input
- Grid of CourseCards (3-col desktop, 2-col tablet, 1-col mobile)
- Pagination if needed

**Step 5: Run tests + verify visually**
```bash
npm run test
npm run dev  # Visit /courses
```

**Step 6: Commit**
```bash
git add . && git commit -m "feat: course list page with API, filters, and card component"
```

---

## Task 5: Course Detail Page

**Files:**
- Create: `src/app/courses/[id]/page.tsx`
- Create: `src/app/api/courses/[id]/route.ts`
- Create: `src/components/course/chapter-list.tsx`
- Create: `tests/api/course-detail.test.ts`

**Step 1: Write failing API test**
Test that `GET /api/courses/:id` returns course with chapters.

**Step 2: Implement API route**
Return course with chapters, ordered by sortOrder.

**Step 3: Build course detail page**
- Hero section: cover image + title + price + buy button
- Course info: description, category, chapter count, total duration
- Chapter list: sortable, shows duration, lock icon for paid chapters
- Free preview chapters marked
- Sticky buy bar on mobile (bottom fixed)

**Step 4: Run tests + verify**
```bash
npm run test
npm run dev  # Visit /courses/[id]
```

**Step 5: Commit**
```bash
git add . && git commit -m "feat: course detail page with chapter list"
```

---

## Task 6: Phone Login (SMS Verification)

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/api/auth/sms-code/route.ts`
- Create: `src/app/api/auth/sms-login/route.ts`
- Create: `src/lib/auth.ts`
- Create: `src/components/auth/login-form.tsx`
- Create: `tests/api/auth.test.ts`

**Step 1: Write failing tests**
Test SMS code sending and login flow.

**Step 2: Implement auth library**
`src/lib/auth.ts`:
- `generateToken(userId)` — JWT token
- `verifyToken(token)` — decode & validate
- `sendSmsCode(phone)` — integrate SMS API (or mock for MVP)
- `verifySmsCode(phone, code)` — check code

**Step 3: Implement API routes**
- `POST /api/auth/sms-code` — send verification code (rate limited)
- `POST /api/auth/sms-login` — verify code + return JWT + create/find user

**Step 4: Build login page**
- Phone input (11 digits, auto-format)
- "获取验证码" button (60s countdown)
- 6-digit code input
- Auto-login on submit
- Redirect to previous page after login

**Step 5: Implement auth middleware**
`src/middleware.ts` — protect user routes, attach user to request.

**Step 6: Run tests + verify**
```bash
npm run test
npm run dev  # Test login flow
```

**Step 7: Commit**
```bash
git add . && git commit -m "feat: phone SMS login with JWT auth"
```

---

## Task 7: WeChat H5 Payment

**Files:**
- Create: `src/lib/wechat-pay.ts`
- Create: `src/app/api/orders/route.ts`
- Create: `src/app/api/payments/wechat/route.ts`
- Create: `src/app/api/payments/notify/route.ts`
- Create: `src/app/checkout/[courseId]/page.tsx`
- Create: `src/components/payment/payment-status.tsx`
- Create: `tests/api/payment.test.ts`

**Step 1: Write failing tests**
Test order creation and payment initiation.

**Step 2: Implement WeChat Pay SDK**
`src/lib/wechat-pay.ts`:
- `createH5Payment(orderId, amount, description)` — call WeChat v3 API
- `verifyNotification(headers, body)` — verify callback signature
- Use merchant cert + API key from env vars

**Step 3: Implement API routes**
- `POST /api/orders` — create order (requires auth)
- `POST /api/payments/wechat` — initiate H5 payment, return h5_url
- `POST /api/payments/notify` — handle WeChat callback, update order status, grant access

**Step 4: Build checkout page**
- Order summary (course name, price)
- "立即支付" button → redirect to WeChat H5 pay
- Payment status polling (pending → success → redirect to learn page)
- Error handling for failed/expired payments

**Step 5: Payment callback logic**
On successful payment:
1. Update order status → "paid"
2. Create payment record
3. User gains access to course

**Step 6: Run tests + verify**
```bash
npm run test
# Manual: test with WeChat sandbox
```

**Step 7: Commit**
```bash
git add . && git commit -m "feat: WeChat H5 payment with order system"
```

---

## Task 8: Video Learning Page

**Files:**
- Create: `src/app/learn/[courseId]/page.tsx`
- Create: `src/app/api/progress/[chapterId]/route.ts`
- Create: `src/components/video/video-player.tsx`
- Create: `src/components/course/learn-sidebar.tsx`
- Create: `tests/api/progress.test.ts`

**Step 1: Write failing tests**
Test progress save/load.

**Step 2: Implement progress API**
- `GET /api/progress/:chapterId` — get watch progress
- `POST /api/progress/:chapterId` — save progress (watchedSec, completed)

**Step 3: Build video player component**
- Integrate xgplayer (or DPlayer)
- HLS support for OSS videos
- Progress memory (auto-resume from last position)
- Playback speed control
- Auto-advance to next chapter on complete

**Step 4: Build learning page layout**
- Left: video player (main area)
- Right sidebar: chapter list with progress indicators
- Current chapter highlighted
- Completed chapters marked with ✓
- Mobile: video on top, chapters below (collapsible)

**Step 5: Access control**
- Check if user has purchased the course
- Free preview chapters accessible without purchase
- Redirect to checkout if not purchased

**Step 6: Run tests + verify**
```bash
npm run test
npm run dev  # Test learning flow
```

**Step 7: Commit**
```bash
git add . && git commit -m "feat: video learning page with progress tracking"
```

---

## Task 9: Admin Panel — Course Management

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx` (dashboard)
- Create: `src/app/admin/courses/page.tsx`
- Create: `src/app/admin/courses/[id]/page.tsx`
- Create: `src/app/api/admin/courses/route.ts`
- Create: `src/app/api/admin/courses/[id]/route.ts`
- Create: `src/app/api/admin/upload/route.ts`
- Create: `src/components/admin/sidebar.tsx`
- Create: `src/components/admin/course-form.tsx`

**Step 1: Build admin layout**
- Sidebar navigation: Dashboard, 课程管理, 订单管理, 系统设置
- Admin auth guard (check admin role)
- Responsive: collapsible sidebar on mobile

**Step 2: Build admin dashboard**
- Stats cards: total courses, total orders, total revenue, total users
- Recent orders table
- Simple charts (optional for MVP)

**Step 3: Build course CRUD**
- Course list table (title, price, status, actions)
- Create/edit form: title, description, cover upload, price, category
- Chapter management: add/edit/delete/reorder chapters
- Video upload to OSS (or local for MVP)
- Publish/draft toggle

**Step 4: Implement admin API routes**
- Full CRUD for courses and chapters
- File upload endpoint (images + videos)
- Admin auth middleware

**Step 5: Verify**
```bash
npm run dev  # Login as admin, test CRUD
```

**Step 6: Commit**
```bash
git add . && git commit -m "feat: admin panel with course management CRUD"
```

---

## Task 10: Admin Panel — Order Management

**Files:**
- Create: `src/app/admin/orders/page.tsx`
- Create: `src/app/api/admin/orders/route.ts`

**Step 1: Build order list page**
- Table: order ID, user, course, amount, status, created date
- Filter by status (pending/paid/refunded)
- Search by order ID or user phone
- Order detail modal/drawer

**Step 2: Implement order API**
- List with pagination + filters
- Update order status (e.g., manual refund)

**Step 3: Verify**
```bash
npm run dev  # Check admin order management
```

**Step 4: Commit**
```bash
git add . && git commit -m "feat: admin order management with filters"
```

---

## Task 11: Seed Data & Polish

**Files:**
- Modify: `prisma/seed.ts`
- Various UI polish files

**Step 1: Run seed with real course data**
Insert 5 courses from COURSE-OUTLINE.md with chapters, plus admin user.

**Step 2: SEO basics**
- Meta tags on all pages
- OG tags for social sharing
- robots.txt + sitemap.xml

**Step 3: Performance**
- Image optimization (next/image)
- Loading states
- Error boundaries

**Step 4: Responsive QA**
- Test all pages on mobile/tablet/desktop
- Fix any layout issues

**Step 5: Commit**
```bash
git add . && git commit -m "feat: seed data, SEO, and responsive polish"
```

---

## Task 12: Deploy to ziiy.fun

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `Caddyfile` (or update existing)

**Step 1: Build Docker image**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Step 2: Deploy to server**
- Upload to 120.24.149.246
- Stop old wenxin-wx service
- Start wenxinHost with docker-compose
- Configure Caddy reverse proxy

**Step 3: Verify production**
- Test all flows on ziiy.fun
- WeChat payment in production mode

**Step 4: Commit**
```bash
git add . && git commit -m "chore: Docker deployment config"
```

---

## Execution Order

```
Task 1  → Task 2  → Task 3  → Task 4  → Task 5
                                          ↓
Task 6 (Login) → Task 7 (Payment) → Task 8 (Video)
                                          ↓
Task 9 (Admin Courses) → Task 10 (Admin Orders) → Task 11 (Polish) → Task 12 (Deploy)
```

**Critical path:** Tasks 1-5 are sequential foundation. Tasks 6-8 are the purchase flow (sequential). Tasks 9-10 can partially parallel with 8. Task 12 is last.

**Estimated total:** 12 tasks × ~15-20 min per task = ~3-4 hours with subagents.
