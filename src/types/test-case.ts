/**
 * 测试用例相关类型定义
 * 基于 OpenAPI 文档更新
 */

// HTTP 方法
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

// 测试用例响应
export interface TestCaseResponse {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  method: HttpMethod;
  url: string;
  headers: string | null;  // JSON 字符串
  body: string | null;
  expected_status: number | null;
  is_active: boolean;
  tags: string[];
  created_by: number;
  created_at: string;
  updated_at: string | null;
}

// 测试用例创建
export interface TestCaseCreate {
  project_id: number;
  name: string;
  description?: string | null;
  method: HttpMethod;
  url: string;
  headers?: string | null;
  body?: string | null;
  expected_status?: number | null;
  is_active?: boolean;
  tags?: string[];
}

// 测试用例更新
export interface TestCaseUpdate {
  name?: string;
  description?: string | null;
  method?: HttpMethod;
  url?: string;
  headers?: string | null;
  body?: string | null;
  expected_status?: number | null;
  is_active?: boolean;
  tags?: string[];
}

// 测试套件响应
export interface TestSuiteResponse {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  created_by: number;
  created_at: string;
  updated_at: string | null;
}

// 测试套件创建
export interface TestSuiteCreate {
  project_id: number;
  name: string;
  description?: string | null;
  case_ids?: number[];
}

// 测试套件更新
export interface TestSuiteUpdate {
  name?: string;
  description?: string | null;
  case_ids?: number[];
}

// 批量导入请求
export interface BatchImportRequest {
  project_id: number;
  format: 'openapi' | 'postman' | 'curl';
  content: string;
}

// 批量导入响应
export interface BatchImportResponse {
  success: number;
  failed: number;
  test_cases: TestCaseResponse[];
  errors?: string[];
}

// 测试用例列表响应（简化版）
export interface TestCaseListResponse {
  id: number;
  project_id: number;
  name: string;
  is_active: boolean;
  tags: string[];
  created_at: string;
  method?: HttpMethod;
  url?: string;
}
