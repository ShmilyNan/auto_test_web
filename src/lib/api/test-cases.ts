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
<<<<<<< HEAD
    '/api/testcases',
=======
    '/api/test-cases',
>>>>>>> 3091069845b1181b191b80d457249461996d3517
    { params }
  );
  return response;
};

// 获取测试用例详情
export const getTestCase = async (
  testCaseId: number
): Promise<TestCaseResponse> => {
  const response = await apiClient.get<TestCaseResponse>(
<<<<<<< HEAD
    `/api/testcases/${testCaseId}`
=======
    `/api/test-cases/${testCaseId}`
>>>>>>> 3091069845b1181b191b80d457249461996d3517
  );
  return response;
};

// 创建测试用例
export const createTestCase = async (
  data: TestCaseCreate
): Promise<TestCaseResponse> => {
  const response = await apiClient.post<TestCaseResponse>(
<<<<<<< HEAD
    '/api/testcases',
=======
    '/api/test-cases',
>>>>>>> 3091069845b1181b191b80d457249461996d3517
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
<<<<<<< HEAD
    `/api/testcases/${testCaseId}`,
=======
    `/api/test-cases/${testCaseId}`,
>>>>>>> 3091069845b1181b191b80d457249461996d3517
    data
  );
  return response;
};

// 删除测试用例
export const deleteTestCase = async (
  testCaseId: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
<<<<<<< HEAD
    `/api/testcases/${testCaseId}`
=======
    `/api/test-cases/${testCaseId}`
>>>>>>> 3091069845b1181b191b80d457249461996d3517
  );
  return response;
};

// 批量导入测试用例
export const batchImportTestCases = async (
  data: BatchImportRequest
): Promise<BatchImportResponse> => {
  const response = await apiClient.post<BatchImportResponse>(
<<<<<<< HEAD
    '/api/testcases/import',
=======
    '/api/test-cases/import',
>>>>>>> 3091069845b1181b191b80d457249461996d3517
    data
  );
  return response;
};
