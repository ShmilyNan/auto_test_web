# 前后端对接联调说明书

## 文档版本

- **版本**: v1.0.0
- **更新日期**: 2024-03-07
- **适用项目**: ApiTestWeb 自动化测试平台

---

## 目录

1. [项目架构说明](#1-项目架构说明)
2. [环境配置](#2-环境配置)
3. [接口规范](#3-接口规范)
4. [数据格式约定](#4-数据格式约定)
5. [接口对接流程](#5-接口对接流程)
6. [认证与授权](#6-认证与授权)
7. [错误处理规范](#7-错误处理规范)
8. [调试工具使用](#8-调试工具使用)
9. [联调测试流程](#9-联调测试流程)
10. [常见问题解决](#10-常见问题解决)

---

## 1. 项目架构说明

### 1.1 技术栈

#### 前端

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **状态管理**: TanStack Query + Zustand
- **UI 组件**: shadcn/ui + Tailwind CSS

#### 后端

- **框架**: (待补充，根据实际后端技术栈填写)
- **语言**: (待补充)
- **数据库**: (待补充)

### 1.2 通信方式

- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

### 1.3 项目结构

```
┌─────────────────────────────────────────┐
│           前端 (Next.js)                │
│  - 仪表盘                               │
│  - 项目管理                             │
│  - 测试用例                             │
│  - 测试报告                             │
└────────────┬────────────────────────────┘
             │ HTTP/REST API
             ▼
┌─────────────────────────────────────────┐
│           后端 API Server               │
│  - 用户认证                             │
│  - 项目管理 API                         │
│  - 用例管理 API                         │
│  - 测试执行 API                         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│           数据库                         │
└─────────────────────────────────────────┘
```

---

## 2. 环境配置

### 2.1 前端环境变量

创建 `.env.local` 文件：

```env
# API 基础地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:8899/api

# WebSocket 地址（用于实时推送）
NEXT_PUBLIC_WS_URL=ws://localhost:8899/ws

# 应用环境
NODE_ENV=development
```

### 2.2 环境配置说明

| 变量名                     | 说明               | 示例值                       |
| -------------------------- | ------------------ | ---------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | 后端 API 基础地址  | `http://localhost:8899/api`  |
| `NEXT_PUBLIC_WS_URL`       | WebSocket 连接地址 | `ws://localhost:8899/ws`     |
| `NODE_ENV`                 | 运行环境           | `development` / `production` |

### 2.3 多环境配置

#### 开发环境 (.env.development)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8899/api
NEXT_PUBLIC_WS_URL=ws://localhost:8899/ws
```

#### 生产环境 (.env.production)

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api
NEXT_PUBLIC_WS_URL=wss://api.example.com/ws
```

---

## 3. 接口规范

### 3.1 RESTful API 设计原则

| HTTP 方法 | 用途     | 说明                   |
| --------- | -------- | ---------------------- |
| `GET`     | 查询     | 获取资源列表或单个资源 |
| `POST`    | 创建     | 创建新资源             |
| `PUT`     | 更新     | 完整更新资源           |
| `PATCH`   | 部分更新 | 部分更新资源           |
| `DELETE`  | 删除     | 删除资源               |

### 3.2 URL 命名规范

```
/{资源名}/{id}/{子资源}

示例:
GET    /api/projects              # 获取项目列表
GET    /api/projects/{id}         # 获取单个项目
POST   /api/projects              # 创建项目
PUT    /api/projects/{id}         # 更新项目
DELETE /api/projects/{id}         # 删除项目
GET    /api/projects/{id}/cases   # 获取项目的测试用例
```

### 3.3 分页参数

| 参数名     | 类型   | 必填 | 默认值    | 说明     |
| ---------- | ------ | ---- | --------- | -------- |
| `page`     | number | 否   | 1         | 当前页码 |
| `pageSize` | number | 否   | 20        | 每页数量 |
| `sort`     | string | 否   | createdAt | 排序字段 |
| `order`    | string | 否   | desc      | 排序方向 |

示例：

```
GET /api/projects?page=1&pageSize=20&sort=createdAt&order=desc
```

---

## 4. 数据格式约定

### 4.1 请求格式

#### 请求头 (Request Headers)

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

#### 请求体示例

```json
{
  "name": "用户服务 API",
  "description": "用户注册、登录相关接口",
  "baseUrl": "https://api.example.com"
}
```

### 4.2 响应格式

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "1",
    "name": "用户服务 API",
    "description": "用户注册、登录相关接口",
    "createdAt": "2024-03-07T10:00:00Z"
  },
  "timestamp": 1709798400000
}
```

#### 列表响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "1",
        "name": "用户服务 API"
      },
      {
        "id": "2",
        "name": "订单系统 API"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": 1709798400000
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "name",
      "message": "项目名称不能为空"
    }
  ],
  "timestamp": 1709798400000
}
```

### 4.3 状态码约定

| HTTP 状态码 | 业务状态码 | 说明             |
| ----------- | ---------- | ---------------- |
| 200         | 200        | 请求成功         |
| 201         | 201        | 创建成功         |
| 400         | 400        | 请求参数错误     |
| 401         | 401        | 未授权，需要登录 |
| 403         | 403        | 无权限访问       |
| 404         | 404        | 资源不存在       |
| 500         | 500        | 服务器内部错误   |

### 4.4 日期时间格式

- **格式**: ISO 8601
- **示例**: `2024-03-07T10:00:00Z`
- **时区**: 使用 UTC 时间

---

## 5. 接口对接流程

### 5.1 创建 API 客户端

创建 `src/lib/api/client.ts`：

```typescript
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// 响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 列表响应类型
export interface ListResponse<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 错误类型
export interface ApiError {
  code: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 从 localStorage 或 Zustand store 获取 token
        const token = localStorage.getItem("token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response.data;
      },
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const { status, data } = error.response;

          // 401 未授权，跳转登录
          if (status === 401) {
            // 清除 token
            localStorage.removeItem("token");
            // 跳转登录页
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }

          return Promise.reject({
            code: data?.code || status,
            message: data?.message || "请求失败",
            errors: data?.errors,
          });
        }

        // 网络错误
        return Promise.reject({
          code: 0,
          message: "网络连接失败，请检查网络设置",
        });
      },
    );
  }

  // GET 请求
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.client.get(url, { params });
  }

  // POST 请求
  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post(url, data);
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.put(url, data);
  }

  // DELETE 请求
  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.client.delete(url);
  }
}

export const apiClient = new ApiClient();
```

### 5.2 创建 API 服务模块

#### 项目管理 API

创建 `src/lib/api/projects.ts`：

```typescript
import { apiClient, ApiResponse, ListResponse } from "./client";
import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/types/project";

export const projectsApi = {
  // 获取项目列表
  getProjects: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
  }) => {
    return apiClient.get<ListResponse<Project>>("/projects", params);
  },

  // 获取单个项目
  getProject: (id: string) => {
    return apiClient.get<Project>(`/projects/${id}`);
  },

  // 创建项目
  createProject: (data: CreateProjectInput) => {
    return apiClient.post<Project>("/projects", data);
  },

  // 更新项目
  updateProject: (id: string, data: UpdateProjectInput) => {
    return apiClient.put<Project>(`/projects/${id}`, data);
  },

  // 删除项目
  deleteProject: (id: string) => {
    return apiClient.delete(`/projects/${id}`);
  },

  // 获取项目统计信息
  getProjectStats: (id: string) => {
    return apiClient.get(`/projects/${id}/stats`);
  },
};
```

#### 测试用例 API

创建 `src/lib/api/test-cases.ts`：

```typescript
import { apiClient, ApiResponse, ListResponse } from "./client";
import { TestCase, CreateTestCaseInput } from "@/types/test-case";

export const testCasesApi = {
  // 获取用例列表
  getTestCases: (params?: {
    projectId?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return apiClient.get<ListResponse<TestCase>>("/test-cases", params);
  },

  // 获取单个用例
  getTestCase: (id: string) => {
    return apiClient.get<TestCase>(`/test-cases/${id}`);
  },

  // 创建用例
  createTestCase: (data: CreateTestCaseInput) => {
    return apiClient.post<TestCase>("/test-cases", data);
  },

  // 更新用例
  updateTestCase: (id: string, data: Partial<CreateTestCaseInput>) => {
    return apiClient.put<TestCase>(`/test-cases/${id}`, data);
  },

  // 删除用例
  deleteTestCase: (id: string) => {
    return apiClient.delete(`/test-cases/${id}`);
  },

  // 执行用例
  executeTestCase: (id: string) => {
    return apiClient.post(`/test-cases/${id}/execute`);
  },

  // 批量执行用例
  executeTestCases: (ids: string[]) => {
    return apiClient.post("/test-cases/execute", { ids });
  },

  // 从 Swagger 导入
  importFromSwagger: (
    projectId: string,
    data: { url?: string; file?: File },
  ) => {
    const formData = new FormData();
    if (data.url) formData.append("url", data.url);
    if (data.file) formData.append("file", data.file);

    return apiClient.post(`/projects/${projectId}/import/swagger`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 从 cURL 导入
  importFromCurl: (projectId: string, curlCommand: string) => {
    return apiClient.post(`/projects/${projectId}/import/curl`, {
      curlCommand,
    });
  },
};
```

#### 测试报告 API

创建 `src/lib/api/reports.ts`：

```typescript
import { apiClient, ApiResponse, ListResponse } from "./client";

export interface ExecutionResult {
  id: string;
  projectId: string;
  totalCases: number;
  passed: number;
  failed: number;
  passRate: number;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface TestCaseResult {
  id: string;
  caseId: string;
  caseName: string;
  method: string;
  url: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  response?: any;
  error?: string;
}

export const reportsApi = {
  // 获取执行记录列表
  getExecutions: (params?: {
    projectId?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return apiClient.get<ListResponse<ExecutionResult>>("/executions", params);
  },

  // 获取执行详情
  getExecution: (id: string) => {
    return apiClient.get<ExecutionResult>(`/executions/${id}`);
  },

  // 获取执行结果（用例级别）
  getExecutionResults: (executionId: string) => {
    return apiClient.get<{ list: TestCaseResult[] }>(
      `/executions/${executionId}/results`,
    );
  },

  // 导出报告
  exportReport: (executionId: string, format: "pdf" | "html" | "json") => {
    return apiClient.get(`/executions/${executionId}/export`, { format });
  },
};
```

### 5.3 使用 TanStack Query 集成

创建 React Hook：

```typescript
// src/hooks/use-projects.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api/projects";

export function useProjects(params?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectsApi.getProjects(params),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      projectsApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
```

### 5.4 在组件中使用

```typescript
// src/app/(dashboard)/projects/page.tsx
import { useProjects, useCreateProject, useDeleteProject } from '@/hooks/use-projects';

export default function ProjectsPage() {
  const { data, isLoading, error } = useProjects({ page: 1, pageSize: 20 });
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <div>
      {/* 项目列表 */}
      {data?.data?.list.map((project) => (
        <div key={project.id}>
          {project.name}
          <button onClick={() => deleteProject.mutate(project.id)}>删除</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 6. 认证与授权

### 6.1 Token 管理

#### 登录获取 Token

```typescript
// src/lib/api/auth.ts
import { apiClient } from "./client";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  login: (data: LoginInput) => {
    return apiClient.post<LoginResponse>("/auth/login", data);
  },

  logout: () => {
    return apiClient.post("/auth/logout");
  },

  refreshToken: () => {
    return apiClient.post<{ token: string }>("/auth/refresh");
  },
};
```

#### Token 存储和使用

```typescript
// 登录成功后
const { token } = await authApi.login({ email, password });
localStorage.setItem("token", token);

// 在 Zustand store 中管理用户状态
// src/store/user.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  token: string | null;
  user: any;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "user-storage" },
  ),
);
```

### 6.2 RBAC 权限控制

后端返回用户权限，前端根据权限控制 UI 显示：

```typescript
// 用户信息包含权限
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

// 使用 PermissionGuard 组件控制
import { PermissionGuard } from '@/components/auth/permission-guard';

<PermissionGuard permission="project:create">
  <Button>创建项目</Button>
</PermissionGuard>
```

---

## 7. 错误处理规范

### 7.1 错误类型

```typescript
// src/lib/api/errors.ts
export enum ErrorCode {
  // 通用错误
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",

  // 业务错误
  INVALID_PARAMS = "INVALID_PARAMS",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export class ApiError extends Error {
  code: ErrorCode;
  details?: any;

  constructor(code: ErrorCode, message: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ApiError";
  }
}
```

### 7.2 错误提示组件

```typescript
// src/components/ui/error-alert.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function ErrorAlert({ error }: { error: any }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>错误</AlertTitle>
      <AlertDescription>{error.message || '操作失败，请稍后重试'}</AlertDescription>
    </Alert>
  );
}
```

---

## 8. 调试工具使用

### 8.1 浏览器 DevTools

#### Network 面板

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 面板
3. 查看 API 请求详情：
   - 请求 URL
   - 请求方法
   - 请求头
   - 请求体
   - 响应状态
   - 响应数据

#### Console 面板

```javascript
// 查看当前存储的 token
localStorage.getItem("token");

// 清除 token
localStorage.removeItem("token");

// 查看请求日志
console.log("API Request:", { url, method, data });
```

### 8.2 推荐的浏览器插件

- **REST Client**: 测试 API 请求
- **JSON Viewer**: 格式化查看 JSON 响应
- **React Developer Tools**: 调试 React 组件

### 8.3 API 测试工具

#### Postman

1. 创建 Collection
2. 配置环境变量（如 `baseUrl`, `token`）
3. 编写测试脚本

示例 Pre-request Script：

```javascript
// 设置 token
pm.request.headers.add({
  key: "Authorization",
  value: `Bearer ${pm.environment.get("token")}`,
});
```

---

## 9. 联调测试流程

### 9.1 准备阶段

#### 前端准备

- [ ] 配置环境变量（.env.local）
- [ ] 启动前端服务：`pnpm dev`
- [ ] 确认前端运行在 http://localhost:5000

#### 后端准备

- [ ] 启动后端服务
- [ ] 确认 API 地址（如 http://localhost:8899/api）
- [ ] 准备测试数据

#### 数据库准备

- [ ] 初始化数据库
- [ ] 创建测试用户
- [ ] 准备测试项目数据

### 9.2 联调步骤

#### 步骤 1: 基础连通性测试

**测试目标**: 验证前后端能否正常通信

```bash
# 使用 curl 测试
curl -X GET http://localhost:8899/api/health

# 或在浏览器访问
http://localhost:8899/api/health
```

**预期结果**: 返回 200 状态码和健康检查信息

#### 步骤 2: 认证测试

**测试目标**: 验证登录和 Token 功能

```typescript
// 1. 登录
POST /api/auth/login
Body: {
  "email": "test@example.com",
  "password": "123456"
}

// 预期响应
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "name": "Test User",
      "email": "test@example.com",
      "role": "admin"
    }
  }
}

// 2. 使用 Token 访问受保护接口
GET /api/projects
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 步骤 3: CRUD 接口测试

**项目管理接口测试**：

```typescript
// 1. 获取项目列表
GET /api/projects?page=1&pageSize=20

// 2. 创建项目
POST /api/projects
Body: {
  "name": "测试项目",
  "description": "这是一个测试项目",
  "baseUrl": "https://api.example.com"
}

// 3. 获取单个项目
GET /api/projects/{id}

// 4. 更新项目
PUT /api/projects/{id}
Body: {
  "name": "更新后的项目名"
}

// 5. 删除项目
DELETE /api/projects/{id}
```

**测试用例接口测试**：

```typescript
// 1. 获取用例列表
GET /api/test-cases?projectId=1

// 2. 创建用例
POST /api/test-cases
Body: {
  "projectId": "1",
  "name": "测试用户登录",
  "method": "POST",
  "url": "https://api.example.com/login",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "username": "test",
    "password": "123456"
  },
  "expectedStatus": 200
}

// 3. 执行用例
POST /api/test-cases/{id}/execute

// 4. 删除用例
DELETE /api/test-cases/{id}
```

#### 步骤 4: 复杂业务场景测试

**测试目标**: 验证完整的业务流程

```typescript
// 场景：从导入到执行
1. 创建项目 → 获取 projectId
2. 从 Swagger 导入用例 → 获取 caseIds
3. 执行用例 → 获取 executionId
4. 查看执行结果 → 验证通过率
5. 导出报告 → 下载 PDF
```

### 9.3 测试检查清单

#### 功能测试

- [ ] 用户登录/登出
- [ ] 项目 CRUD 操作
- [ ] 用例 CRUD 操作
- [ ] 用例导入（文件、Swagger、cURL）
- [ ] 用例执行
- [ ] 报告生成和导出

#### 权限测试

- [ ] 不同角色的权限隔离
- [ ] 无权限操作返回 403
- [ ] Token 过期处理

#### 异常测试

- [ ] 参数验证失败
- [ ] 资源不存在（404）
- [ ] 网络错误处理
- [ ] 并发请求处理

#### 性能测试

- [ ] 大数据量列表加载
- [ ] 分页功能
- [ ] 请求超时处理

---

## 10. 常见问题解决

### 10.1 跨域问题 (CORS)

**问题**: 浏览器控制台报错 `Access to XMLHttpRequest blocked by CORS policy`

**原因**: 前端和后端域名/端口不同，导致跨域

**解决方案**:

#### 方案 1: 后端配置 CORS（推荐）

```typescript
// 后端配置示例
app.use(
  cors({
    origin: ["http://localhost:5000"], // 前端地址
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

#### 方案 2: 前端配置代理（开发环境）

```typescript
// next.config.ts
export default {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8899/api/:path*", // 后端地址
      },
    ];
  },
};
```

前端 API 调用改为：

```typescript
// 开发环境使用代理
const baseURL =
  process.env.NODE_ENV === "development"
    ? "/api" // 代理地址
    : process.env.NEXT_PUBLIC_API_BASE_URL;
```

### 10.2 Token 过期

**问题**: 请求返回 401 Unauthorized

**解决方案**:

```typescript
// 在响应拦截器中处理
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 错误且未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 刷新 token
        const { token } = await authApi.refreshToken();
        localStorage.setItem("token", token);

        // 重试原请求
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 刷新失败，跳转登录
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
```

### 10.3 请求超时

**问题**: 请求超时或响应慢

**解决方案**:

```typescript
// 增加超时时间
const apiClient = axios.create({
  timeout: 60000, // 60秒
});

// 或在特定请求中设置
await apiClient.get("/test-cases/execute", {
  timeout: 120000, // 120秒
});
```

### 10.4 数据格式不一致

**问题**: 前后端数据类型不匹配

**解决方案**:

1. 使用 TypeScript 严格模式
2. 定义统一的接口类型
3. 后端提供 OpenAPI/Swagger 文档
4. 使用工具自动生成类型（如 `openapi-typescript-codegen`）

```bash
# 安装工具
pnpm add -D openapi-typescript-codegen

# 生成类型
npx openapi-typescript-codegen -i http://localhost:8080/api-docs -o src/lib/api/generated
```

### 10.5 环境变量未生效

**问题**: `process.env.NEXT_PUBLIC_XXX` 返回 undefined

**解决方案**:

1. 检查文件名是否正确（`.env.local`）
2. 确保变量名以 `NEXT_PUBLIC_` 开头
3. 重启开发服务器
4. 检查 `.gitignore` 是否忽略环境变量文件

### 10.6 WebSocket 连接失败

**问题**: WebSocket 连接不上或断开

**解决方案**:

```typescript
// 检查 WebSocket URL
const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

// 创建 WebSocket 连接
const ws = new WebSocket(wsUrl);

ws.onopen = () => console.log("WebSocket 连接成功");
ws.onerror = (error) => console.error("WebSocket 错误:", error);
ws.onclose = () => console.log("WebSocket 连接关闭");

// 自动重连
function connect() {
  const ws = new WebSocket(wsUrl);

  ws.onclose = () => {
    setTimeout(() => connect(), 3000); // 3秒后重连
  };
}
```

---

## 11. 联调记录模板

### 联调记录表

| 接口名称     | HTTP 方法 | URL             | 测试结果 | 问题记录     | 负责人 | 日期       |
| ------------ | --------- | --------------- | -------- | ------------ | ------ | ---------- |
| 用户登录     | POST      | /api/auth/login | ✅ 通过  | -            | 张三   | 2024-03-07 |
| 获取项目列表 | GET       | /api/projects   | ✅ 通过  | -            | 张三   | 2024-03-07 |
| 创建项目     | POST      | /api/projects   | ❌ 失败  | 参数验证错误 | 李四   | 2024-03-07 |
| ...          | ...       | ...             | ...      | ...          | ...    | ...        |

---

## 12. 联系方式

- **前端负责人**: [姓名] - [邮箱]
- **后端负责人**: [姓名] - [邮箱]
- **测试负责人**: [姓名] - [邮箱]
- **技术支持**: [邮箱]

---

## 附录

### A. 常用命令

```bash
# 前端启动
pnpm dev

# 类型检查
pnpm ts-check

# 构建
pnpm build

# 启动生产环境
pnpm start
```

### B. 参考文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [TanStack Query 文档](https://tanstack.com/query/latest)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [RESTful API 设计规范](https://restfulapi.net/)

### C. 更新日志

| 版本   | 日期       | 更新内容 | 作者 |
| ------ | ---------- | -------- | ---- |
| v1.0.0 | 2024-03-07 | 初始版本 | -    |
