'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getRole, updateRole, createRole } from '@/lib/api/roles';
import type { RoleResponse } from '@/types/auth';
import { getPermissions } from '@/lib/api/permissions';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const roleSchema = z.object({
  name: z.string().min(1, '角色名称不能为空'),
  description: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormProps {
  roleId?: number;
  onSuccess: () => void;
}

export default function RoleForm({ roleId, onSuccess }: RoleFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // 获取角色详情（编辑模式）
  const { data: roleData, isLoading: isLoadingRole } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId!),
    enabled: !!roleId,
  });

  // 获取权限列表
  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // 初始化表单数据和权限选择（编辑模式）
  useEffect(() => {
    if (roleData) {
      setSelectedPermissions(roleData.permissions.map((p) => p.id));
      form.reset({
        name: roleData.name,
        description: roleData.description || '',
      });
    }
  }, [roleData, form]);

  // 创建角色
  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: '成功',
        description: '角色已创建',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: error.response?.data?.detail || '创建角色失败',
      });
    },
  });

  // 更新角色
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: '成功',
        description: '角色已更新',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: error.response?.data?.detail || '更新角色失败',
      });
    },
  });

  const onSubmit = (data: RoleFormData) => {
    const submitData = {
      ...data,
      permission_ids: selectedPermissions.length > 0 ? selectedPermissions : undefined,
    };

    if (roleId) {
      updateMutation.mutate({ id: roleId, data: submitData });
    } else {
      createMutation.mutate(submitData as any);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // 按资源分组权限
  const groupedPermissions = permissions?.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>) || {};

  if (isLoadingRole) {
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
              <FormLabel>角色名称</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请输入角色名称" />
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
                <Textarea {...field} placeholder="请输入角色描述（可选）" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>权限</FormLabel>
          <div className="max-h-64 overflow-y-auto border rounded-md p-3 space-y-4">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <div key={resource} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{resource}</Badge>
                </div>
                <div className="grid grid-cols-1 gap-2 pl-4">
                  {perms?.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`perm-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                      />
                      <label
                        htmlFor={`perm-${permission.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.name}
                      </label>
                      {permission.description && (
                        <span className="text-sm text-muted-foreground">
                          - {permission.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending
              ? '保存中...'
              : roleId
              ? '保存'
              : '创建'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
