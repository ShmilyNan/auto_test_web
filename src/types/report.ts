/**
 * 测试报告相关类型定义
 */

// 步骤执行结果
export interface StepExecution {
  step_name: string;
  status: 'success' | 'failed' | 'skipped';
  duration: number;
  request_url: string;
  request_method: string;
  response_status: number;
  response_body: string | null;
  error_message?: string;
  assertions_passed: number;
  assertions_total: number;
}

// 测试报告响应
export interface ReportResponse {
  id: number;
  project_id: number;
  project_name: string;
  total_test_cases: number;
  passed: number;
  failed: number;
  skipped: number;
  total_steps: number;
  total_duration: number;
  status: 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  test_case_results: TestCaseResult[];
}

// 测试用例执行结果
export interface TestCaseResult {
  test_case_id: number;
  test_case_name: string;
  status: 'success' | 'failed' | 'skipped';
  duration: number;
  steps: StepExecution[];
}

// 执行测试请求
export interface ExecuteTestRequest {
  project_id: number;
  test_case_ids?: number[];
}

// 报告列表响应（简化版）
export interface ReportListResponse {
  id: number;
  project_id: number;
  project_name: string;
  total_test_cases: number;
  passed: number;
  failed: number;
  status: string;
  created_at: string;
}
