"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Upload,
  FileCode,
  Terminal,
  Play,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTestCase,
  createTestCase,
  updateTestCase,
} from "@/lib/api/test-cases";
import { getProjects } from "@/lib/api/projects";

// Form schema
const testCaseSchema = z.object({
  name: z.string().min(1, "用例名称不能为空"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]),
  url: z.string().url("请输入有效的 URL"),
  headers: z.string().optional(),
  body: z.string().optional(),
  expected_status: z.string().optional(),
  project_id: z.number().optional(),
});

type TestCaseForm = z.infer<typeof testCaseSchema>;

interface TestCaseFormProps {
  testCaseId?: number;
  onSuccess?: () => void;
}

export default function TestCaseForm({
  testCaseId,
  onSuccess,
}: TestCaseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [curlCommand, setCurlCommand] = useState("");

  // 获取测试用例详情（编辑模式）
  const { data: testCaseData, isLoading: isLoadingTestCase } = useQuery({
    queryKey: ["test-case", testCaseId],
    queryFn: () => getTestCase(testCaseId!),
    enabled: !!testCaseId,
  });

  // 获取项目列表
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  const projects = projectsData?.items || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TestCaseForm>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      method: "GET",
      url: "",
    },
  });

  // 监听表单值变化
  const watchedMethod = watch("method");
  const watchedExpectedStatus = watch("expected_status");
  const watchedProjectId = watch("project_id");

  // 初始化表单数据（编辑模式）
  useEffect(() => {
    if (testCaseData) {
      reset({
        name: testCaseData.name,
        project_id: testCaseData.project_id,
      });

      // 从 steps 中提取第一个步骤的数据（如果是单步骤用例）
      if (testCaseData.steps && testCaseData.steps.length > 0) {
        const firstStep = testCaseData.steps[0];
        setValue("method", firstStep.method);
        setValue("url", firstStep.url);

        // 解析 headers
        if (firstStep.headers) {
          try {
            const headersObj =
              typeof firstStep.headers === "string"
                ? JSON.parse(firstStep.headers)
                : firstStep.headers;
            setHeaders(headersObj);
          } catch (e) {
            console.error("Failed to parse headers:", e);
          }
        }

        // 解析 body
        if (firstStep.body) {
          try {
            const bodyStr =
              typeof firstStep.body === "string"
                ? firstStep.body
                : JSON.stringify(firstStep.body);
            setValue("body", bodyStr);
          } catch (e) {
            console.error("Failed to parse body:", e);
          }
        }

        // 解析断言获取期望状态码
        if (firstStep.assertions && firstStep.assertions.length > 0) {
          const statusAssertion = firstStep.assertions.find(
            (a: any) => a.type === "status_code",
          );
          if (statusAssertion) {
            setValue("expected_status", statusAssertion.expected.toString());
          }
        }
      }
    }
  }, [testCaseData, reset, setValue]);

  const handleAddHeader = () => {
    if (headerKey && headerValue) {
      setHeaders({ ...headers, [headerKey]: headerValue });
      setHeaderKey("");
      setHeaderValue("");
    }
  };

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...headers };
    delete newHeaders[key];
    setHeaders(newHeaders);
  };

  const handleParseCurl = () => {
    try {
      // TODO: 解析 cURL 命令并填充表单
      console.log("cURL command:", curlCommand);
      toast({
        title: "功能待实现",
        description: "cURL 解析功能待实现",
      });
    } catch (error) {
      console.error("Failed to parse cURL:", error);
      toast({
        variant: "destructive",
        title: "解析失败",
        description: "cURL 命令解析失败",
      });
    }
  };

  // 创建测试用例
  const createMutation = useMutation({
    mutationFn: createTestCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-cases"] });
      toast({
        title: "成功",
        description: "测试用例已创建",
      });
      if (onSuccess) {
        onSuccess();
      }
      reset();
      setHeaders({});
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "创建失败",
        description: error.response?.data?.detail || "创建测试用例失败",
      });
    },
  });

  // 更新测试用例
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateTestCase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-cases"] });
      toast({
        title: "成功",
        description: "测试用例已更新",
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "更新失败",
        description: error.response?.data?.detail || "更新测试用例失败",
      });
    },
  });

  const onSubmit = (data: TestCaseForm) => {
    // 构建断言数组
    const assertions: any[] = [];
    if (data.expected_status) {
      assertions.push({
        type: "status_code",
        expected: parseInt(data.expected_status),
      });
    }

    // 构建步骤数据
    const step: any = {
      name: data.name,
      method: data.method,
      url: data.url,
    };

    // 添加 headers（如果有）
    if (Object.keys(headers).length > 0) {
      step.headers = headers;
    }

    // 添加 body（如果有）
    if (data.body) {
      try {
        step.body = JSON.parse(data.body);
      } catch (e) {
        step.body = data.body;
      }
    }

    // 添加断言（如果有）
    if (assertions.length > 0) {
      step.assertions = assertions;
    }

    // 构建提交数据
    const submitData: any = {
      name: data.name,
      steps: [step],
      is_active: true,
    };

    if (data.project_id) {
      submitData.project_id = data.project_id;
    }

    if (testCaseId) {
      updateMutation.mutate({ id: testCaseId, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleRunTest = () => {
    toast({
      title: "功能待实现",
      description: "测试运行功能待实现",
    });
  };

  return (
    <Tabs defaultValue="manual" className="w-full">
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
            <CardTitle>
              {testCaseId ? "编辑测试用例" : "新建测试用例"}
            </CardTitle>
            <CardDescription>
              {testCaseId ? "修改测试用例信息" : "手动输入接口信息创建测试用例"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTestCase ? (
              <div className="text-center py-12">加载中...</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">用例名称 *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="输入用例名称"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_id">所属项目</Label>
                    <Select
                      value={watchedProjectId?.toString()}
                      onValueChange={(value) =>
                        setValue(
                          "project_id",
                          value ? parseInt(value) : undefined,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择项目" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem
                            key={project.id}
                            value={project.id.toString()}
                          >
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="method">请求方法 *</Label>
                    <Select
                      value={watchedMethod || "GET"}
                      onValueChange={(value) =>
                        setValue("method", value as any)
                      }
                    >
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

                  <div className="space-y-2">
                    <Label htmlFor="expected_status">期望状态码</Label>
                    <Select
                      value={watchedExpectedStatus || ""}
                      onValueChange={(value) =>
                        setValue("expected_status", value)
                      }
                    >
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
                        <SelectItem value="500">
                          500 Internal Server Error
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">请求 URL *</Label>
                  <Input
                    id="url"
                    {...register("url")}
                    placeholder="https://api.example.com/users"
                  />
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
                      <Plus className="h-4 w-4" />
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
                    {...register("body")}
                    placeholder='{"name": "test", "value": 123}'
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createMutation.isPending || updateMutation.isPending
                      ? "保存中..."
                      : testCaseId
                        ? "更新用例"
                        : "保存用例"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRunTest}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    测试运行
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* File Upload */}
      <TabsContent value="file">
        <Card>
          <CardHeader>
            <CardTitle>文件上传</CardTitle>
            <CardDescription>
              上传 YAML 或 JSON 格式的测试用例文件
            </CardDescription>
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
                <p className="text-xs text-gray-500 mt-1">
                  支持 .yaml, .yml, .json 格式
                </p>
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
                <p className="text-sm text-gray-600 mt-2">
                  点击上传 Swagger 文件
                </p>
              </div>
            </div>
            <Button className="w-full">解析并导入</Button>
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
  );
}
