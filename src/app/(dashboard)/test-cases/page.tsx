'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  Upload,
  FileCode,
  Terminal,
  Play,
  Save,
  Trash2,
  Plus as PlusIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { TESTCASE } from '@/lib/constants/permissions';
import { HttpMethod } from '@/types/test-case';

// Form schema
const testCaseSchema = z.object({
  name: z.string().min(1, '用例名称不能为空'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
  url: z.string().url('请输入有效的 URL'),
  headers: z.string().optional(),
  body: z.string().optional(),
  expectedStatus: z.string().optional(),
});

type TestCaseForm = z.infer<typeof testCaseSchema>;

export default function TestCasesPage() {
  const [importMethod, setImportMethod] = useState<'manual' | 'file' | 'swagger' | 'curl'>('manual');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [headerKey, setHeaderKey] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [curlCommand, setCurlCommand] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestCaseForm>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      method: 'GET',
      url: '',
    },
  });

  const handleAddHeader = () => {
    if (headerKey && headerValue) {
      setHeaders({ ...headers, [headerKey]: headerValue });
      setHeaderKey('');
      setHeaderValue('');
    }
  };

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...headers };
    delete newHeaders[key];
    setHeaders(newHeaders);
  };

  const handleParseCurl = () => {
    try {
      const curlToJson = require('curl-to-json');
      const parsed = curlToJson(curlCommand);
      console.log('Parsed cURL:', parsed);
      // TODO: 填充表单
    } catch (error) {
      console.error('Failed to parse cURL:', error);
    }
  };

  const onSubmit = (data: TestCaseForm) => {
    console.log('Form data:', data);
    console.log('Headers:', headers);
    // TODO: 调用 API 创建用例
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">测试用例</h1>
          <p className="mt-1 text-sm text-gray-500">管理和创建 API 测试用例</p>
        </div>
        <PermissionGuard permission={TESTCASE.CREATE}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建用例
          </Button>
        </PermissionGuard>
      </div>

      {/* Import Tabs */}
      <Tabs value={importMethod} onValueChange={(v) => setImportMethod(v as any)}>
        <TabsList>
          <TabsTrigger value="manual">手工添加</TabsTrigger>
          <TabsTrigger value="file">文件上传</TabsTrigger>
          <TabsTrigger value="swagger">Swagger 解析</TabsTrigger>
          <TabsTrigger value="curl">cURL 导入</TabsTrigger>
        </TabsList>

        {/* Manual Input */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>手工添加用例</CardTitle>
              <CardDescription>手动输入接口信息创建测试用例</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">用例名称 *</Label>
                    <Input id="name" {...register('name')} placeholder="输入用例名称" />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">请求方法 *</Label>
                    <Select onValueChange={(value) => register('method').onChange({ target: { value } as any })}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择请求方法" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="HEAD">HEAD</SelectItem>
                        <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">请求 URL *</Label>
                  <Input id="url" {...register('url')} placeholder="https://api.example.com/users" />
                  {errors.url && (
                    <p className="text-sm text-red-600">{errors.url.message}</p>
                  )}
                </div>

                {/* Headers */}
                <div className="space-y-2">
                  <Label>请求头</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Header Key"
                      value={headerKey}
                      onChange={(e) => setHeaderKey(e.target.value)}
                    />
                    <Input
                      placeholder="Header Value"
                      value={headerValue}
                      onChange={(e) => setHeaderValue(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddHeader}>
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {Object.entries(headers).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(headers).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="gap-1">
                          {key}: {value}
                          <button
                            type="button"
                            onClick={() => handleRemoveHeader(key)}
                            className="ml-1 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="body">请求体 (JSON)</Label>
                  <Textarea
                    id="body"
                    {...register('body')}
                    placeholder='{"name": "test", "value": 123}'
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>

                {/* Expected Status */}
                <div className="space-y-2">
                  <Label htmlFor="expectedStatus">期望状态码</Label>
                  <Select onValueChange={(value) => register('expectedStatus').onChange({ target: { value } as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择期望状态码" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="200">200 OK</SelectItem>
                      <SelectItem value="201">201 Created</SelectItem>
                      <SelectItem value="204">204 No Content</SelectItem>
                      <SelectItem value="400">400 Bad Request</SelectItem>
                      <SelectItem value="401">401 Unauthorized</SelectItem>
                      <SelectItem value="404">404 Not Found</SelectItem>
                      <SelectItem value="500">500 Internal Server Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <PermissionGuard permission={TESTCASE.CREATE}>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      保存用例
                    </Button>
                  </PermissionGuard>
                  <Button type="button" variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    测试运行
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Upload */}
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>文件上传</CardTitle>
              <CardDescription>上传 YAML 或 JSON 格式的测试用例文件</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    拖拽文件到此处，或
                    <Button variant="link" className="p-0 h-auto">
                      点击上传
                    </Button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">支持 .yaml, .yml, .json 格式</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Swagger Import */}
        <TabsContent value="swagger">
          <Card>
            <CardHeader>
              <CardTitle>Swagger/OpenAPI 解析</CardTitle>
              <CardDescription>从 Swagger 文档导入接口定义</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Swagger JSON URL</Label>
                <Input placeholder="https://api.example.com/swagger.json" />
              </div>
              <div className="text-center text-sm text-gray-500">或</div>
              <div className="space-y-2">
                <Label>上传 Swagger 文件</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileCode className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600 mt-2">点击上传 Swagger 文件</p>
                </div>
              </div>
              <Button className="w-full">
                解析并导入
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* cURL Import */}
        <TabsContent value="curl">
          <Card>
            <CardHeader>
              <CardTitle>cURL 导入</CardTitle>
              <CardDescription>粘贴 cURL 命令自动解析为测试用例</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="curl">cURL 命令</Label>
                <Textarea
                  id="curl"
                  value={curlCommand}
                  onChange={(e) => setCurlCommand(e.target.value)}
                  placeholder='curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d "{\"name\":\"test\"}"'
                  className="min-h-[150px] font-mono text-sm"
                />
              </div>
              <Button onClick={handleParseCurl} className="w-full">
                <Terminal className="mr-2 h-4 w-4" />
                解析 cURL
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
