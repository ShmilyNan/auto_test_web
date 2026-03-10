# 前后端联调快速开始指南

## 第一步：配置环境

### 1.1 复制环境变量文件

```bash
cp .env.local.example .env.local
```

### 1.2 修改后端地址

编辑 `.env.local`，修改为实际的后端地址：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8899/api
NEXT_PUBLIC_WS_URL=ws://localhost:8899/ws
```

---

## 第二步：启动服务

### 2.1 启动后端服务

根据后端实际技术栈启动，例如：

```bash
# 如果是 Node.js
cd backend
npm run dev

# 如果是 Java
cd backend
mvn spring-boot:run

# 如果是 Python
cd backend
python app.py
```

### 2.2 启动前端服务

```bash
pnpm install  # 首次运行需要安装依赖
pnpm dev
```

访问：http://localhost:5000

---

## 第三步：验证连接

### 3.1 测试后端服务

打开浏览器或使用 Postman 访问：

```
http://localhost:8899/api/health
```

预期返回：

```json
{
  "status": "ok",
  "timestamp": 1234567890
}
```

### 3.2 测试前端连接

打开浏览器控制台（F12），输入：

```javascript
// 测试 API 连通性
await fetch("http://localhost:8899/api/health").then((r) => r.json());
```

或使用测试工具：

```javascript
await ApiTestHelper.testConnection();
```

---

## 第四步：生成 API 类型（可选）

如果后端提供了 Swagger/OpenAPI 文档，可以自动生成类型：

```bash
# 安装类型生成工具
pnpm add -D openapi-typescript-codegen

# 生成类型
pnpm generate-api-types
```

生成后的类型文件位于 `src/lib/api/generated/`。

---

## 第五步：联调测试流程

### 5.1 认证测试

```javascript
// 1. 登录
POST http://localhost:8899/api/auth/login
Body: {
  "email": "admin@example.com",
  "password": "123456"
}

// 2. 保存 Token（复制返回的 token）
localStorage.setItem('token', 'your-token-here')

// 3. 验证 Token
GET http://localhost:8899/api/auth/me
Headers: Authorization: Bearer your-token-here
```

### 5.2 项目管理测试

```javascript
// 1. 获取项目列表
GET http://localhost:8899/api/projects

// 2. 创建项目
POST http://localhost:8899/api/projects
Body: {
  "name": "测试项目",
  "description": "这是联调测试项目",
  "baseUrl": "https://api.example.com"
}

// 3. 获取项目详情
GET http://localhost:8080/api/projects/{id}
```

### 5.3 用例管理测试

```javascript
// 1. 创建用例
POST http://localhost:8080/api/test-cases
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

// 2. 执行用例
POST http://localhost:8080/api/test-cases/{id}/execute
```

---

## 第六步：检查点

使用联调检查清单逐项测试：

```bash
# 打开检查清单
docs/INTEGRATION_CHECKLIST.md
```

---

## 常见问题快速解决

### 问题 1: CORS 跨域错误

**现象**: 控制台报错 `Access to XMLHttpRequest blocked by CORS policy`

**解决方案**:

**方案 A: 配置前端代理（开发环境）**

编辑 `next.config.ts`：

```typescript
export default {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};
```

修改 `.env.local`：

```env
NEXT_PUBLIC_API_BASE_URL=/api  # 使用代理
```

**方案 B: 后端配置 CORS**

后端添加 CORS 配置（具体方法根据后端框架）。

---

### 问题 2: 401 Unauthorized

**现象**: 请求返回 401

**检查步骤**:

1. 检查 Token 是否存在：

   ```javascript
   localStorage.getItem("token");
   ```

2. 检查 Token 是否正确：

   ```javascript
   // 查看请求头
   // Headers: Authorization: Bearer your-token-here
   ```

3. 检查 Token 是否过期，重新登录获取新 Token。

---

### 问题 3: 404 Not Found

**现象**: 请求返回 404

**检查步骤**:

1. 检查 URL 是否正确
2. 检查 ID 是否存在
3. 检查后端路由是否已实现

---

### 问题 4: 请求超时

**现象**: 请求长时间无响应

**解决方案**:

检查后端服务是否正常运行：

```bash
# Linux/Mac
curl -I http://localhost:8080

# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:8080 -Method Head
```

---

## 调试技巧

### 1. 使用浏览器 DevTools

打开 Network 面板，查看：

- 请求 URL
- 请求方法
- 请求头
- 请求体
- 响应状态
- 响应数据

### 2. 使用浏览器控制台

```javascript
// 查看当前环境配置
ApiTestHelper.printEnvConfig();

// 检查 Token
ApiTestHelper.checkToken();

// 手动发起请求
fetch("/api/projects", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((r) => r.json())
  .then(console.log);
```

### 3. 使用 Postman

导入 API 文档，快速测试接口。

---

## 下一步

1. 按照 `docs/INTEGRATION_CHECKLIST.md` 进行完整测试
2. 使用 `docs/API_INTEGRATION_GUIDE.md` 查阅详细文档
3. 记录联调过程中遇到的问题和解决方案

---

## 联系支持

如有问题，请联系：

- 前端负责人：[姓名] - [邮箱]
- 后端负责人：[姓名] - [邮箱]
