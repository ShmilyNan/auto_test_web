"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createTestCase, updateTestCase } from "@/lib/api/test-cases";

// Form schema
const testCaseSchema = z.object({
  name: z.string().min(1, "用例名称不能为空").max(100, "用例名称最多100个字符"),
  project_id: z.number().int("项目ID必须为整数").positive("项目ID必须为正数"),
  description: z.string().optional(),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  url: z.string().url("请输入有效的URL"),
  headers: z.string().optional(),
  body: z.string().optional(),
  expected_status: z.number().int().min(100).max(599),
});

type TestCaseFormData = z.infer<typeof testCaseSchema>;

interface TestCaseFormProps {
  testCaseId?: number;
  onSuccess: () => void;
}

export default function TestCaseForm({
  testCaseId,
  onSuccess,
}: TestCaseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TestCaseFormData>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      name: "",
      project_id: undefined as unknown as number,
      description: "",
      method: "GET",
      url: "",
      headers: "",
      body: "",
      expected_status: 200,
    },
  });

  const method = watch("method");

  // 创建测试用例
  const createMutation = useMutation({
    mutationFn: createTestCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-cases"] });
      toast({
        title: "成功",
        description: "测试用例已创建",
      });
      onSuccess();
      reset();
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
    mutationFn: ({ id, data }: { id: number; data: TestCaseFormData }) =>
      updateTestCase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-cases"] });
      toast({
        title: "成功",
        description: "测试用例已更新",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "更新失败",
        description: error.response?.data?.detail || "更新测试用例失败",
      });
    },
  });

  const onSubmit = (data: TestCaseFormData) => {
    if (testCaseId) {
      updateMutation.mutate({ id: testCaseId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">用例名称 *</Label>
          <Input id="name" {...register("name")} placeholder="请输入用例名称" />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="project_id">项目ID *</Label>
          <Input
            id="project_id"
            type="number"
            {...register("project_id", { valueAsNumber: true })}
            placeholder="请输入项目ID"
          />
          {errors.project_id && (
            <p className="text-sm text-red-600">{errors.project_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">用例描述</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="请输入用例描述"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="method">请求方法 *</Label>
          <Select
            value={method}
            onValueChange={(value) => setValue("method", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择方法" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
          {errors.method && (
            <p className="text-sm text-red-600">{errors.method.message}</p>
          )}
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="url">请求URL *</Label>
          <Input
            id="url"
            {...register("url")}
            placeholder="https://api.example.com/endpoint"
          />
          {errors.url && (
            <p className="text-sm text-red-600">{errors.url.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headers">请求头 (JSON格式)</Label>
        <Textarea
          id="headers"
          {...register("headers")}
          placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
          rows={3}
        />
        {errors.headers && (
          <p className="text-sm text-red-600">{errors.headers.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">请求体 (JSON格式)</Label>
        <Textarea
          id="body"
          {...register("body")}
          placeholder='{"key": "value"}'
          rows={4}
        />
        {errors.body && (
          <p className="text-sm text-red-600">{errors.body.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expected_status">预期状态码 *</Label>
        <Input
          id="expected_status"
          type="number"
          {...register("expected_status", { valueAsNumber: true })}
          placeholder="200"
        />
        {errors.expected_status && (
          <p className="text-sm text-red-600">
            {errors.expected_status.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "保存中..."
            : testCaseId
              ? "保存"
              : "创建"}
        </Button>
      </div>
    </form>
  );
}
