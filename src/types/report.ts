/**
 * 测试报告相关类型定义
 * 基于 OpenAPI 文档更新
 */

// 测试报告响应
export interface ReportResponse {
  id: number;
  execution_id: number;
  project_id: number;
  project_name: string;
  total_cases: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  pass_rate: number;
  status: 'generating' | 'completed' | 'archived';
  created_at: string;
  archived_at: string | null;
}

// 报告详情（包含用例结果）
export interface ReportDetailResponse {
  id: number;
  execution_id: number;
  project_id: number;
  project_name: string;
  total_cases: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  pass_rate: number;
  status: 'generating' | 'completed' | 'archived';
  created_at: string;
  archived_at: string | null;
  case_results: CaseReportResult[];
}

// 用例报告结果
export interface CaseReportResult {
  case_id: number;
  case_name: string;
  status: 'success' | 'failed' | 'skipped';
  duration: number;
  request_url: string;
  request_method: string;
  response_status: number | null;
  error_message: string | null;
}

// 项目统计响应
export interface ProjectStatsResponse {
  project_id: number;
  project_name: string;
  total_cases: number;
  total_suites: number;
  total_plans: number;
  total_executions: number;
  passed_executions: number;
  failed_executions: number;
  pass_rate: number;
  last_execution_at: string | null;
}

// 执行趋势数据
export interface ExecutionTrendItem {
  date: string;
  total: number;
  passed: number;
  failed: number;
}

// 通过率趋势数据
export interface PassRateTrendItem {
  date: string;
  pass_rate: number;
}

// 用例统计
export interface CaseStatsResponse {
  total: number;
  active: number;
  inactive: number;
  by_method: Record<string, number>;
  recent_created: number;
}

// 执行时长统计
export interface DurationStatsResponse {
  avg_duration: number;
  min_duration: number;
  max_duration: number;
  total_duration: number;
}
