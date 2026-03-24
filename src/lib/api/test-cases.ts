/**
 * 测试用例管理 API
 * 基于 OpenAPI 文档更新
 */
import { apiClient } from './client';
import type {
  TestCaseResponse,
  TestCaseCreate,
  TestCaseUpdate,
  TestSuiteResponse,
  TestSuiteCreate,
  TestSuiteUpdate,
  BatchImportRequest,
  BatchImportResponse,
} from '@/types/test-case';
import type { PaginationParams } from '@/types/common';

// ==================== 测试用例 ====================

// 获取测试用例列表
export const getTestCases = async (
  params?: PaginationParams & {
    project_id?: number;
    name?: string;
    is_active?: boolean;
  }
): Promise<TestCaseResponse[]> => {
  return apiClient.get<TestCaseResponse[]>('/testcases/cases', params);
};

// 获取测试用例详情
export const getTestCase = async (caseId: number): Promise<TestCaseResponse> => {
  return apiClient.get<TestCaseResponse>(`/testcases/cases/${caseId}`);
};

// 创建测试用例
export const createTestCase = async (data: TestCaseCreate): Promise<TestCaseResponse> => {
  return apiClient.post<TestCaseResponse>('/testcases/cases', data);
};

// 更新测试用例
export const updateTestCase = async (
  caseId: number,
  data: TestCaseUpdate
): Promise<TestCaseResponse> => {
  return apiClient.put<TestCaseResponse>(`/testcases/cases/${caseId}`, data);
};

// 删除测试用例
export const deleteTestCase = async (caseId: number): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>(`/testcases/cases/${caseId}`);
};

// 批量创建测试用例
export const batchCreateTestCases = async (
  cases: TestCaseCreate[]
): Promise<TestCaseResponse[]> => {
  return apiClient.post<TestCaseResponse[]>('/testcases/cases/batch', { cases });
};

// 批量导入测试用例
export const importTestCases = async (
  data: BatchImportRequest
): Promise<BatchImportResponse> => {
  return apiClient.post<BatchImportResponse>('/testcases/cases/import', data);
};

// 导出测试用例
export const exportTestCases = async (
  project_id: number,
  format: 'json' | 'yaml' = 'json'
): Promise<Blob> => {
  const response = await apiClient.get('/testcases/cases/export', {
    project_id,
    format,
  }, { responseType: 'blob' });
  return response as unknown as Blob;
};

// ==================== 测试套件 ====================

// 获取测试套件列表
export const getTestSuites = async (
  params?: PaginationParams & {
    project_id?: number;
  }
): Promise<TestSuiteResponse[]> => {
  return apiClient.get<TestSuiteResponse[]>('/testcases/suites', params);
};

// 获取测试套件详情
export const getTestSuite = async (suiteId: number): Promise<TestSuiteResponse> => {
  return apiClient.get<TestSuiteResponse>(`/testcases/suites/${suiteId}`);
};

// 创建测试套件
export const createTestSuite = async (data: TestSuiteCreate): Promise<TestSuiteResponse> => {
  return apiClient.post<TestSuiteResponse>('/testcases/suites', data);
};

// 更新测试套件
export const updateTestSuite = async (
  suiteId: number,
  data: TestSuiteUpdate
): Promise<TestSuiteResponse> => {
  return apiClient.put<TestSuiteResponse>(`/testcases/suites/${suiteId}`, data);
};

// 删除测试套件
export const deleteTestSuite = async (suiteId: number): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>(`/testcases/suites/${suiteId}`);
};
