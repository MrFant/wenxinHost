# 文心课堂 — 剩余功能实施计划

> 创建日期：2026-05-22
> 执行者：Claude Code

---

## 工作原则

1. **TDD 优先** — API 路由先写测试再实现；UI 组件以 `npm run build` 通过为验证
2. **代码风格** — 朴实自然，像人手写的。不 over-engineer，变量名简单，中文注释，console.log 调试
3. **每完成一个功能就 commit**
4. **不要改动已有功能**，只新增

---

## Task 1: Auth 中间件 + .env.example

**文件：**
- 创建: `src/middleware.ts`
- 创建: `.env.example`

**要求：**
- middleware.ts 拦截 `/learn/*` 和 `/user/*` 路径，检查 cookie 中的 JWT token
- 无 token 或 token 无效 → 重定向到 `/login`
- `/admin/*` 路径检查 admin 角色
- `.env.example` 列出所有需要的环境变量（DATABASE_URL, JWT_SECRET, WX_MCH_ID, WX_API_KEY, WX_APP_ID, WX_PRIVATE_KEY, WX_CERT_SERIAL, WX_NOTIFY_URL, WX_PLATFORM_CERT）

---

## Task 2: 用户中心 — 个人中心页

**文件：**
- 创建: `src/app/user/page.tsx`
- 创建: `src/app/api/user/profile/route.ts`

**要求：**
- GET /api/user/profile 返回当前用户信息（从 JWT 解析 userId）
- 个人中心页显示：昵称、手机号、头像
- 支持修改昵称
- 页面顶部显示"我的课程"和"我的订单"快捷入口

---

## Task 3: 用户中心 — 我的课程

**文件：**
- 创建: `src/app/user/courses/page.tsx`
- 创建: `src/app/api/user/courses/route.ts`

**要求：**
- GET /api/user/courses 返回用户已购买的课程列表（通过 Order 表关联）
- 页面以卡片形式展示已购课程，点击进入学习页
- 显示学习进度（已完成章节数 / 总章节数）

---

## Task 4: 用户中心 — 我的订单

**文件：**
- 创建: `src/app/user/orders/page.tsx`
- 创建: `src/app/api/user/orders/route.ts`

**要求：**
- GET /api/user/orders 返回当前用户的订单列表
- 订单卡片显示：课程名、金额、状态（待支付/已完成/已退款）、下单时间
- 待支付订单显示"去支付"按钮

---

## Task 5: 后台 — 管理员登录页

**文件：**
- 创建: `src/app/admin/login/page.tsx`
- 创建: `src/app/api/admin/auth/login/route.ts`
- 创建: `src/app/api/admin/auth/me/route.ts`

**要求：**
- POST /api/admin/auth/login 接收 username + password，验证 Admin 表，返回 JWT
- GET /api/admin/auth/me 检查当前管理员登录状态
- 登录页：简洁的表单，用户名 + 密码 + 登录按钮
- 登录成功后跳转到 /admin
- Admin layout 增加登录状态检查，未登录跳转 /admin/login

---

## Task 6: 后台 — 用户管理

**文件：**
- 创建: `src/app/admin/users/page.tsx`
- 创建: `src/app/api/admin/users/route.ts`
- 创建: `src/app/api/admin/users/[id]/route.ts`

**要求：**
- GET /api/admin/users 返回用户列表（分页、搜索）
- PUT /api/admin/users/[id] 更新用户状态（启用/禁用）
- 页面：用户表格（手机号、昵称、注册时间、订单数、状态）
- 支持按手机号搜索
- 支持禁用/启用操作

---

## Task 7: 后台 — 系统设置

**文件：**
- 创建: `src/app/admin/settings/page.tsx`
- 创建: `src/app/api/admin/settings/route.ts`

**要求：**
- GET /api/admin/settings 读取所有 Setting
- PUT /api/admin/settings 更新设置
- 页面：表单形式，可编辑：网站名称、联系方式、备案号
- 保存后即时生效

---

## Task 8: 后台 — 文件上传 API

**文件：**
- 创建: `src/app/api/admin/upload/route.ts`

**要求：**
- POST /api/admin/upload 接收 multipart/form-data
- 图片保存到 `public/uploads/` 目录
- 返回文件访问路径 `/uploads/filename`
- 限制：只接受图片类型（jpg/png/webp），最大 5MB

---

## Task 9: 课程搜索

**文件：**
- 修改: `src/app/courses/courses-content.tsx`（或相关文件）

**要求：**
- 在课程列表页顶部添加搜索框
- 搜索框输入关键词后，调用 /api/courses?search=xxx 筛选
- 后端 API 支持 search 参数，模糊匹配课程标题

---

## Task 10: 评价系统前端

**文件：**
- 创建: `src/components/course/review-list.tsx`
- 创建: `src/components/course/review-form.tsx`
- 创建: `src/app/api/courses/[id]/reviews/route.ts`
- 修改: `src/app/courses/[id]/course-detail-client.tsx`（嵌入评价组件）

**要求：**
- GET /api/courses/:id/reviews 返回课程评价列表
- POST /api/courses/:id/reviews 提交评价（需登录、已购买）
- 评价组件：星级评分 + 文字内容
- 在课程详情页底部展示评价列表

---

## Task 11: 首页轮播图

**文件：**
- 修改: `src/app/page.tsx`

**要求：**
- Hero 区域改为轮播组件（纯 CSS + JS 实现，不引新库）
- 3-5 张轮播，自动切换（5秒间隔）
- 支持手动切换（左右箭头 + 底部指示点）
- 移动端适配

---

## Task 12: 联系方式页

**文件：**
- 创建: `src/app/contact/page.tsx`

**要求：**
- 简洁的联系方式展示页
- 包含：邮箱、微信（占位）、工作时间
- 复用 About 页面的布局风格

---

## 执行顺序

```
Task 1 (Auth 中间件) → Task 2-4 (用户中心) —— 可并行
Task 5 (管理员登录) → Task 6-8 (后台管理) —— 可并行
Task 9-12 (前端优化) —— 独立，可并行
```

建议分 3 批执行：
1. **第一批**：Task 1 + Task 5（基础认证）
2. **第二批**：Task 2/3/4 + Task 6/7/8（用户中心 + 后台管理）
3. **第三批**：Task 9/10/11/12（前端优化）
