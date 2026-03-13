/**
 * 测试报告 / 执行 / 仪表盘 API
 */
import { apiClient } from './client';
import type {
  ReportResponse,
  ReportListResponse,
  ExecuteTestRequest,
  GenerateReportRequest,
  DashboardResponse,
} from '@/types/report';
import type { PaginatedResponse, PaginationParams } from '@/types/common';

// 获取仪表盘数据
export const getDashboardData = async (): Promise<DashboardResponse> => {
  const response = await apiClient.get<DashboardResponse>('/api/dashboard');
  return response;
};

// 获取测试报告列表（分页）
export const getReports = async (
  params?: PaginationParams & {
    project_id?: number;
    status?: string;
  }
): Promise<PaginatedResponse<ReportListResponse>> => {
  const response = await apiClient.get<PaginatedResponse<ReportListResponse>>(
    '/api/reports',
    params
  );
  return response;
};

// 获取测试报告详情
export const getReport = async (reportId: number): Promise<ReportResponse> => {
  const response = await apiClient.get<ReportResponse>(`/api/reports/${reportId}`);
  return response;
};

// 执行测试
export const executeTest = async (data: ExecuteTestRequest): Promise<ReportResponse> => {
  const response = await apiClient.post<ReportResponse>('/api/executions/run', data);
  return response;
};

// 由单个已执行用例生成报告
export const generateReport = async (
  data: GenerateReportRequest
): Promise<ReportResponse> => {
  const response = await apiClient.post<ReportResponse>('/api/reports/generate', data);
  return response;
};
