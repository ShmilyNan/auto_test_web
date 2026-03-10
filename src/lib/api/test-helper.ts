/**
 * API 测试辅助工具
 * 用于开发和联调阶段快速测试接口
 */

import { apiClient } from './client';

export class ApiTestHelper {
  /**
   * 测试 API 连通性
   */
  static async testConnection() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/health`,
        {
          method: 'GET',
        }
      );

      console.log('✅ API 连接成功', response.status);
      return true;
    } catch (error) {
      console.error('❌ API 连接失败', error);
      return false;
    }
  }

  /**
   * 打印请求日志
   */
  static logRequest(method: string, url: string, data?: any) {
    console.group(`📤 ${method} ${url}`);
    console.log('Request:', data);
    console.groupEnd();
  }

  /**
   * 打印响应日志
   */
  static logResponse(data: any) {
    console.group('📥 Response');
    console.log('Data:', data);
    console.groupEnd();
  }

  /**
   * 检查 Token
   */
  static checkToken() {
    const token = localStorage.getItem('token');
    console.log(token ? '✅ Token 存在' : '❌ Token 不存在', token);
    return token;
  }

  /**
   * 打印当前环境配置
   */
  static printEnvConfig() {
    console.log('=== 环境配置 ===');
    console.log('API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log('WS_URL:', process.env.NEXT_PUBLIC_WS_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('================');
  }

  /**
   * 批量测试接口
   */
  static async batchTest(tests: Array<{ name: string; fn: () => Promise<any> }>) {
    console.log('🧪 开始批量测试...');
    const results: Array<{ name: string; success: boolean; error?: any }> = [];

    for (const test of tests) {
      try {
        console.log(`\n📍 测试: ${test.name}`);
        const result = await test.fn();
        console.log(`✅ ${test.name} 成功`);
        results.push({ name: test.name, success: true });
      } catch (error) {
        console.error(`❌ ${test.name} 失败`, error);
        results.push({ name: test.name, success: false, error });
      }
    }

    console.log('\n📊 测试结果:');
    results.forEach((r) => {
      console.log(`${r.success ? '✅' : '❌'} ${r.name}`);
    });

    return results;
  }
}

// 在浏览器控制台快速调用
if (typeof window !== 'undefined') {
  (window as any).ApiTestHelper = ApiTestHelper;
}
