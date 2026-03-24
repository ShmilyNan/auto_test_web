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
import { createProject, updateProject } from "@/lib/api/projects";

// Form schema
const projectSchema = z.object({
  name: z.string().min(1, "项目名称不能为空").max(100, "项目名称最多100个字符"),
  description: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  projectId?: number;
  onSuccess: () => void;
}

export default function ProjectForm({
  projectId,
  onSuccess,
}: ProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // 创建项目
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "成功",
        description: "项目已创建",
      });
      onSuccess();
      reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "创建失败",
        description: error.response?.data?.detail || "创建项目失败",
      });
    },
  });

  // 更新项目
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectFormData }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "成功",
        description: "项目已更新",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "更新失败",
        description: error.response?.data?.detail || "更新项目失败",
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    if (projectId) {
      updateMutation.mutate({ id: projectId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">项目名称 *</Label>
        <Input id="name" {...register("name")} placeholder="请输入项目名称" />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">项目描述</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="请输入项目描述"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "保存中..."
            : projectId
              ? "保存"
              : "创建"}
        </Button>
      </div>
    </form>
  );
}
