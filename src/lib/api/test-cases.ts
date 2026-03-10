/**
 * 测试用例管理 API
 */
import { apiClient } from './client';
import type {
  TestCaseResponse,
  TestCaseCreate,
  TestCaseUpdate,
  BatchImportRequest,
  BatchImportResponse,
  TestCaseListResponse,
} from '@/types/test-case';
import type { PaginatedResponse, PaginationParams } from '@/types/common';

// 获取测试用例列表（分页）
export const getTestCases = async (
  params?: PaginationParams & {
    project_id?: number;
    name?: string;
    is_active?: boolean;
  }
): Promise<PaginatedResponse<TestCaseListResponse>> => {
  const response = await apiClient.get<PaginatedResponse<TestCaseListResponse>>(
    '/api/testcases',
    { params }
  );
  return response;
};

// 获取测试用例详情
export const getTestCase = async (
  testCaseId: number
): Promise<TestCaseResponse> => {
  const response = await apiClient.get<TestCaseResponse>(
    `/api/testcases/${testCaseId}`
  );
  return response;
};

// 创建测试用例
export const createTestCase = async (
  data: TestCaseCreate
): Promise<TestCaseResponse> => {
  const response = await apiClient.post<TestCaseResponse>(
    '/api/testcases',
    data
  );
  return response;
};

// 更新测试用例
export const updateTestCase = async (
  testCaseId: number,
  data: TestCaseUpdate
): Promise<TestCaseResponse> => {
  const response = await apiClient.put<TestCaseResponse>(
    `/api/testcases/${testCaseId}`,
    data
  );
  return response;
};

// 删除测试用例
export const deleteTestCase = async (
  testCaseId: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/testcases/${testCaseId}`
  );
  return response;
};

// 批量导入测试用例
export const batchImportTestCases = async (
  data: BatchImportRequest
): Promise<BatchImportResponse> => {
  const response = await apiClient.post<BatchImportResponse>(
    '/api/testcases/import',
    data
  );
  return response;
};
