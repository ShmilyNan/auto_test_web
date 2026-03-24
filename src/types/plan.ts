/**
 * 测试计划和执行相关类型定义
 * 基于 OpenAPI 文档更新
 */

// 测试计划响应
export interface TestPlanResponse {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  suite_ids: number[];
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string | null;
}

// 测试计划创建
export interface TestPlanCreate {
  project_id: number;
  name: string;
  description?: string | null;
  suite_ids?: number[];
  is_active?: boolean;
}

// 测试计划更新
export interface TestPlanUpdate {
  name?: string;
  description?: string | null;
  suite_ids?: number[];
  is_active?: boolean;
}

// 执行记录响应
export interface ExecutionRecordResponse {
  id: number;
  plan_id: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  total_cases: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_by: number;
  created_at: string;
}

// 执行详情响应
export interface ExecutionDetailResponse {
  id: number;
  plan_id: number;
  plan_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  total_cases: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_by: number;
  created_at: string;
  case_results: CaseExecutionResult[];
}

// 用例执行结果
export interface CaseExecutionResult {
  case_id: number;
  case_name: string;
  status: 'success' | 'failed' | 'skipped';
  duration: number;
  request_url: string;
  request_method: string;
  response_status: number | null;
  response_body: string | null;
  error_message: string | null;
  executed_at: string;
}

// 执行结果响应（用于运行计划）
export interface ExecutionResultResponse {
  execution_id: number;
  status: string;
  message: string;
}
