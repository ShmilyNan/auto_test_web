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

// 生成测试报告请求（由已执行测试用例生成）
export interface GenerateReportRequest {
  test_case_id: number;
}

// 报告列表响应（简化版）
export interface ReportListResponse {
  id: number;
  project_id: number;
  project_name: string;
  total_test_cases: number;
  passed: number;
  failed: number;
  status: 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

// 仪表盘统计
export interface DashboardStatsResponse {
  total_cases: number;
  passed_cases: number;
  failed_cases: number;
  running_cases: number;
  total_change?: string;
  passed_change?: string;
  failed_change?: string;
  running_change?: string;
}

export interface DashboardExecutionTrendItem {
  name: string;
  executed: number;
  passed: number;
  failed: number;
}

export interface DashboardPassRateItem {
  name: string;
  value: number;
}

export interface DashboardRecentExecutionItem {
  id: number;
  title: string;
  project_name: string;
  case_count: number;
  status: 'success' | 'failed' | 'running';
  created_at: string;
}

export interface DashboardResponse {
  stats: DashboardStatsResponse;
  execution_trend: DashboardExecutionTrendItem[];
  pass_rate_by_project: DashboardPassRateItem[];
  recent_executions: DashboardRecentExecutionItem[];
}