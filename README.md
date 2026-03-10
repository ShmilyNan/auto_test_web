# 自动化测试平台前端

基于 Next.js 16 + TypeScript 的 API 自动化测试平台前端项目。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **UI 组件**: shadcn/ui + Tailwind CSS 4
- **状态管理**:
  - 服务端: TanStack Query (React Query)
  - 客户端: Zustand
- **表单处理**: React Hook Form + Zod
- **图表库**: Recharts
- **权限管理**: TypeScript-first RBAC

## 功能特性

### 1. 仪表盘
- 测试执行概览统计
- 执行趋势图表
- 项目通过率分析
- 最近执行记录

### 2. 项目管理
- 项目列表展示
- 项目创建和编辑
- 项目成员管理
- 项目归档功能

### 3. 测试用例管理
- 多种用例导入方式:
  - 手工添加（动态表单）
  - 文件上传（YAML/JSON）
  - Swagger/OpenAPI 解析
  - cURL 导入
- 用例编辑和删除
- 用例标签管理

### 4. 测试报告
- 执行结果概览
- 用例详细执行记录
- 执行趋势分析
- 报告导出功能

### 5. RBAC 权限系统
- 基于角色的访问控制
- 权限定义:
  - 项目管理权限（创建、读取、更新、删除）
  - 用例管理权限（创建、读取、更新、删除、执行、导入）
  - 测试报告权限（读取、导出）
  - 用户管理权限
  - 系统设置权限
- 权限控制组件（PermissionGuard）

## 项目结构

```
src/
├── app/                      # Next.js App Router 页面
│   ├── (dashboard)/          # 仪表盘路由组
│   │   ├── layout.tsx        # 布局组件
│   │   ├── page.tsx          # 仪表盘页面
│   │   ├── projects/         # 项目管理页面
│   │   ├── test-cases/       # 测试用例页面
│   │   └── reports/          # 测试报告页面
│   ├── layout.tsx            # 根布局
│   └── providers.tsx         # React Query Provider
├── components/               # 组件
│   ├── layout/               # 布局组件
│   │   ├── app-layout.tsx    # 应用主布局
│   │   └── sidebar.tsx       # 侧边栏导航
│   ├── auth/                 # 权限组件
│   │   └── permission-guard.tsx
│   └── ui/                   # shadcn/ui 组件
├── lib/                      # 工具库
│   └── rbac/                 # RBAC 权限系统
│       └── types.ts          # 权限类型定义
├── store/                    # Zustand 状态管理
│   └── user.ts               # 用户状态
└── types/                    # TypeScript 类型定义
    ├── project.ts            # 项目类型
    └── test-case.ts          # 测试用例类型
```

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5000

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 开发指南

### 权限控制

使用 `PermissionGuard` 组件控制 UI 元素显示：

```tsx
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Permission } from '@/lib/rbac/types';

<PermissionGuard permission={Permission.CASE_CREATE}>
  <Button>创建用例</Button>
</PermissionGuard>
```

### 表单验证

使用 React Hook Form + Zod 进行表单验证：

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### 数据获取

使用 TanStack Query 获取数据：

```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: () => fetchProjects(),
});
```

## 待完善功能

- [ ] 对接真实的后端 API
- [ ] 使用 OpenAPI 文档自动生成类型和 API 客户端
- [ ] 实现 WebSocket 实时推送执行进度
- [ ] 添加更多图表类型和数据分析
- [ ] 实现测试套件管理
- [ ] 添加用例批量操作功能
- [ ] 实现环境变量管理
- [ ] 添加测试数据管理

## License

MIT
