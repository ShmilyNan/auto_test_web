'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getUser, updateUser, createUser } from '@/lib/api/users';
import type { UserResponse, RoleResponse } from '@/types/auth';
import { getRoles } from '@/lib/api/roles';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const userSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少 3 个字符')
    .max(50, '用户名最多 50 个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少 6 个字符').optional().or(z.literal('')),
  full_name: z.string().max(100, '全名最多 100 个字符').optional(),
  is_active: z.boolean().optional(),
  role_ids: z.array(z.number()).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  userId?: number;
  onSuccess: () => void;
}

export default function UserForm({ userId, onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // 获取用户详情（编辑模式）
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });

  // 获取角色列表
  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(),
  });

  const roles = rolesData?.items || [];

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      full_name: '',
      is_active: true,
      role_ids: [],
    },
  });

  // 初始化表单数据和角色选择（编辑模式）
  useEffect(() => {
    if (userData) {
      setSelectedRoles(userData.roles.map((r) => r.id));
      form.reset({
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name || '',
        is_active: userData.is_active,
        role_ids: userData.roles.map((r) => r.id),
      });
    }
  }, [userData, form]);

  // 创建用户
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: '成功',
        description: '用户已创建',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: error.response?.data?.detail || '创建用户失败',
      });
    },
  });

  // 更新用户
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: '成功',
        description: '用户已更新',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: error.response?.data?.detail || '更新用户失败',
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    const submitData = {
      ...data,
      role_ids: selectedRoles.length > 0 ? selectedRoles : undefined,
    };

    if (userId) {
      // 编辑模式
      const updateData: any = { ...submitData };
      if (!data.password) {
        delete updateData.password;
      }
      updateMutation.mutate({ id: userId, data: updateData });
    } else {
      // 创建模式
      createMutation.mutate(submitData as any);
    }
  };

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  if (isLoadingUser) {
    return <div>加载中...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!!userId}
                  placeholder="请输入用户名"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请输入邮箱" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!userId && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="请输入密码"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>全名</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请输入全名（可选）" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {userId && (
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">激活状态</FormLabel>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="space-y-2">
          <FormLabel>角色</FormLabel>
          <div className="space-y-2">
            {roles?.map((role: RoleResponse) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={() => handleRoleToggle(role.id)}
                />
                <label
                  htmlFor={`role-${role.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role.name}
                </label>
                {role.description && (
                  <span className="text-sm text-muted-foreground">
                    - {role.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending
              ? '保存中...'
              : userId
              ? '保存'
              : '创建'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
