'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getProject, updateProject, createProject } from '@/lib/api/projects';
import type { ProjectResponse } from '@/types/project';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

const projectSchema = z.object({
  name: z.string().min(1, '项目名称不能为空'),
  description: z.string().optional(),
  base_url: z.string().url('请输入有效的 URL').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  projectId?: number;
  onSuccess: () => void;
}

export default function ProjectForm({ projectId, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 获取项目详情（编辑模式）
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      base_url: '',
      is_active: true,
    },
  });

  // 初始化表单数据（编辑模式）
  useState(() => {
    if (projectData) {
      form.reset({
        name: projectData.name,
        description: projectData.description || '',
        base_url: projectData.base_url || '',
        is_active: projectData.is_active,
      });
    }
  });

  // 创建项目
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: '成功',
        description: '项目已创建',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: error.response?.data?.detail || '创建项目失败',
      });
    },
  });

  // 更新项目
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: '成功',
        description: '项目已更新',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: error.response?.data?.detail || '更新项目失败',
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    const submitData = {
      ...data,
      base_url: data.base_url || undefined,
    };

    if (projectId) {
      updateMutation.mutate({ id: projectId, data: submitData });
    } else {
      createMutation.mutate(submitData as any);
    }
  };

  if (isLoadingProject) {
    return <div>加载中...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>项目名称</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请输入项目名称" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="请输入项目描述（可选）" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="base_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://api.example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {projectId && (
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">激活状态</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending
              ? '保存中...'
              : projectId
              ? '保存'
              : '创建'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
