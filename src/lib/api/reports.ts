/**
 * 测试报告 API
 */
import { apiClient } from './client';
import type {
  ReportResponse,
  ReportListResponse,
  ExecuteTestRequest,
} from '@/types/report';
import type { PaginatedResponse, PaginationParams } from '@/types/common';

// 获取测试报告列表（分页）
export const getReports = async (
  params?: PaginationParams & {
    project_id?: number;
    status?: string;
  }
): Promise<PaginatedResponse<ReportListResponse>> => {
  const response = await apiClient.get<PaginatedResponse<ReportListResponse>>(
    '/api/reports',
    { params }
  );
  return response;
};

// 获取测试报告详情
export const getReport = async (reportId: number): Promise<ReportResponse> => {
  const response = await apiClient.get<ReportResponse>(
    `/api/reports/${reportId}`
  );
  return response;
};

// 执行测试
export const executeTest = async (
  data: ExecuteTestRequest
): Promise<ReportResponse> => {
  const response = await apiClient.post<ReportResponse>(
    '/api/reports/execute',
    data
  );
  return response;
};
