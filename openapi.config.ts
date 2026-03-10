/**
 * OpenAPI/Swagger 类型生成配置
 *
 * 使用方法：
 * 1. 安装依赖: pnpm add -D openapi-typescript-codegen
 * 2. 生成类型: pnpm generate-api-types
 */

module.exports = {
  input: process.env.OPENAPI_URL || 'http://localhost:8899/docs', // 后端 Swagger 文档地址
  output: './src/lib/api/generated', // 输出目录
  clientName: 'ApiClient',
  useOptions: true,
  useUnionTypes: true,
  exportSchemas: true,
  indent: 2,
  postProcessServices: (serviceName: string, operationName: string, service: any) => {
    return {
      ...service,
      operationName: operationName.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),
    };
  },
};
