/**
 * 测试用例相关类型定义
 */

// HTTP 方法
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

// 请求头
export interface Header {
  key: string;
  value: string;
}

// 请求参数
export interface Parameter {
  key: string;
  value: string;
  type: 'query' | 'path' | 'header' | 'cookie';
  description?: string;
}

// 断言
export interface Assertion {
  type: 'status_code' | 'response_time' | 'contains' | 'json_path' | 'regex';
  expected: string | number;
  actual?: string | number;
  operator?: 'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le' | 'contains';
  description?: string;
}

// 测试步骤
export interface TestStep {
  id?: number;
  name: string;
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Parameter[];
  body?: unknown;
  assertions?: Assertion[];
  pre_script?: string;
  post_script?: string;
}

// 测试用例响应
export interface TestCaseResponse {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  steps: TestStep[];
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// 测试用例创建/更新
export interface TestCaseCreate {
  project_id: number;
  name: string;
  description?: string;
  steps: TestStep[];
  is_active?: boolean;
  tags?: string[];
}

export interface TestCaseUpdate {
  name?: string;
  description?: string;
  steps?: TestStep[];
  is_active?: boolean;
  tags?: string[];
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
  project_name?: string;
}
