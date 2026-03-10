/**
 * API 统一导出
 */
export { default as apiClient } from './client';

// 认证相关
export * as authApi from './auth';

// 用户管理
export * as usersApi from './users';

// 角色管理
export * as rolesApi from './roles';

// 权限管理
export * as permissionsApi from './permissions';

// 项目管理
export * as projectsApi from './projects';

// 测试用例管理
export * as testCasesApi from './test-cases';

// 测试报告
export * as reportsApi from './reports';
