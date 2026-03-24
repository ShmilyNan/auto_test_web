/**
 * 测试报告 API
 * 基于 OpenAPI 文档更新
 */
import { apiClient } from './client';
import type {
  ReportResponse,
  ReportDetailResponse,
} from '@/types/report';
import type { PaginationParams } from '@/types/common';

// 获取测试报告列表
export const getReports = async (
  params?: PaginationParams & {
    project_id?: number;
  }
): Promise<ReportResponse[]> => {
  return apiClient.get<ReportResponse[]>('/reports/', params);
};

// 生成测试报告
export const generateReport = async (
  executionId: number
): Promise<ReportResponse> => {
  return apiClient.post<ReportResponse>(`/reports/generate/${executionId}`);
};

// 获取测试报告详情
export const getReport = async (
  executionId: number
): Promise<ReportDetailResponse> => {
  return apiClient.get<ReportDetailResponse>(`/reports/${executionId}`);
};

// 归档测试报告
export const archiveReport = async (
  executionId: number
): Promise<ReportResponse> => {
  return apiClient.post<ReportResponse>(`/reports/archive/${executionId}`);
};
