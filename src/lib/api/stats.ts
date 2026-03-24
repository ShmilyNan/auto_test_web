/**
 * 统计数据 API
 * 基于 OpenAPI 文档更新
 */
import { apiClient } from './client';
import type {
  ProjectStatsResponse,
  ExecutionTrendItem,
  PassRateTrendItem,
  CaseStatsResponse,
  DurationStatsResponse,
} from '@/types/report';

// 仪表盘统计数据类型
export interface DashboardStats {
  projects_count: number;
  test_cases_count: number;
  plans_count: number;
  reports_count: number;
  pass_rate: number;
  recent_reports: Array<{
    id: number;
    plan_name: string;
    status: string;
    passed_cases: number;
    failed_cases: number;
    total_cases: number;
    created_at: string;
  }>;
}

// 获取仪表盘统计数据
export const getStats = async (): Promise<DashboardStats> => {
  return apiClient.get<DashboardStats>('/stats/dashboard');
};

// 获取项目统计概览
export const getProjectStats = async (
  projectId: number
): Promise<ProjectStatsResponse> => {
  return apiClient.get<ProjectStatsResponse>(`/stats/project/${projectId}`);
};

// 获取执行趋势数据
export const getExecutionTrend = async (
  projectId: number,
  days?: number
): Promise<ExecutionTrendItem[]> => {
  return apiClient.get<ExecutionTrendItem[]>(
    `/stats/project/${projectId}/execution-trend`,
    days ? { days } : undefined
  );
};

// 获取通过率趋势数据
export const getPassRateTrend = async (
  projectId: number,
  days?: number
): Promise<PassRateTrendItem[]> => {
  return apiClient.get<PassRateTrendItem[]>(
    `/stats/project/${projectId}/pass-rate-trend`,
    days ? { days } : undefined
  );
};

// 获取用例统计
export const getCaseStats = async (
  projectId: number
): Promise<CaseStatsResponse> => {
  return apiClient.get<CaseStatsResponse>(`/stats/project/${projectId}/cases`);
};

// 获取执行时长统计
export const getDurationStats = async (
  projectId: number
): Promise<DurationStatsResponse> => {
  return apiClient.get<DurationStatsResponse>(`/stats/project/${projectId}/duration`);
};
