"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createTestPlan, updateTestPlan } from "@/lib/api/plans";
import type { TestPlanCreate, TestPlanUpdate } from "@/types/plan";

// Form schema
const planSchema = z.object({
  name: z.string().min(1, "计划名称不能为空").max(100, "计划名称最多100个字符"),
  project_id: z.number().int("项目ID必须为整数").positive("项目ID必须为正数"),
  description: z.string().optional(),
  suite_ids: z.string().optional(),
  is_active: z.boolean(),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PlanFormProps {
  planId?: number;
  onSuccess: () => void;
}

export default function PlanForm({ planId, onSuccess }: PlanFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      project_id: undefined as unknown as number,
      description: "",
      suite_ids: "",
      is_active: true,
    },
  });

  // 创建测试计划
  const createMutation = useMutation({
    mutationFn: (data: TestPlanCreate) => createTestPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: "成功",
        description: "测试计划已创建",
      });
      onSuccess();
      reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "创建失败",
        description: error.response?.data?.detail || "创建测试计划失败",
      });
    },
  });

  // 更新测试计划
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TestPlanUpdate }) =>
      updateTestPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: "成功",
        description: "测试计划已更新",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "更新失败",
        description: error.response?.data?.detail || "更新测试计划失败",
      });
    },
  });

  const onSubmit = (data: PlanFormData) => {
    // 解析 suite_ids 字符串为数组
    const suiteIds = data.suite_ids
      ? data.suite_ids
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id))
      : [];

    if (planId) {
      const updateData: TestPlanUpdate = {
        name: data.name,
        description: data.description || null,
        suite_ids: suiteIds,
        is_active: data.is_active,
      };
      updateMutation.mutate({ id: planId, data: updateData });
    } else {
      const createData: TestPlanCreate = {
        project_id: data.project_id,
        name: data.name,
        description: data.description || null,
        suite_ids: suiteIds,
        is_active: data.is_active,
      };
      createMutation.mutate(createData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">计划名称 *</Label>
          <Input id="name" {...register("name")} placeholder="请输入计划名称" />
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
            disabled={!!planId}
          />
          {errors.project_id && (
            <p className="text-sm text-red-600">{errors.project_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">计划描述</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="请输入计划描述"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suite_ids">测试套件ID (逗号分隔)</Label>
        <Input
          id="suite_ids"
          {...register("suite_ids")}
          placeholder="1, 2, 3"
        />
        <p className="text-sm text-gray-500">
          多个套件ID用逗号分隔，例如: 1, 2, 3
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "保存中..."
            : planId
              ? "保存"
              : "创建"}
        </Button>
      </div>
    </form>
  );
}
