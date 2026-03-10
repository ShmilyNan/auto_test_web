# 前后端对接联调文档中心

## 文档列表

### 📖 主要文档

| 文档                                                   | 说明                       | 适用场景               |
| ------------------------------------------------------ | -------------------------- | ---------------------- |
| [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) | 详细的前后端对接联调说明书 | 完整了解对接流程和规范 |
| [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md) | 联调测试检查清单           | 跟踪联调进度和测试项   |
| [QUICK_START.md](./QUICK_START.md)                     | 快速开始指南               | 快速上手联调           |

### 🛠️ 配置文件

| 文件                            | 说明                 |
| ------------------------------- | -------------------- |
| `../.env.local.example`         | 环境变量示例文件     |
| `../openapi.config.ts`          | OpenAPI 类型生成配置 |
| `../src/lib/api/client.ts`      | API 客户端封装       |
| `../src/lib/api/test-helper.ts` | API 测试辅助工具     |

---

## 快速导航

### 🚀 快速开始

1. **第一次对接？** → 阅读 [QUICK_START.md](./QUICK_START.md)
2. **需要详细规范？** → 阅读 [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
3. **开始测试？** → 使用 [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)

### 📋 按模块查找

- **认证模块** → [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md#6-认证与授权)
- **项目管理** → [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md#52-创建-api-服务模块)
- **测试用例** → [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md#52-创建-api-服务模块)
- **测试报告** → [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md#52-创建-api-服务模块)

### 🔍 问题排查

- **CORS 问题** → [QUICK_START.md](./QUICK_START.md#常见问题快速解决)
- **认证问题** → [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md#102-token-过期)
- **其他问题** → [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md#10-常见问题解决)

---

## 文档使用建议

### 新手路线

```
QUICK_START.md (快速上手)
    ↓
API_INTEGRATION_GUIDE.md (了解规范)
    ↓
INTEGRATION_CHECKLIST.md (按清单测试)
```

### 熟练路线

```
INTEGRATION_CHECKLIST.md (直接测试)
    ↓
API_INTEGRATION_GUIDE.md (查阅规范)
```

---

## 版本记录

| 版本   | 日期       | 更新内容                     |
| ------ | ---------- | ---------------------------- |
| v1.0.0 | 2024-03-07 | 初始版本，包含完整的对接文档 |

---

## 贡献

如有文档改进建议或发现错误，请联系项目维护者。

---

## 联系方式

- **项目维护**: [邮箱]
- **技术支持**: [邮箱]
