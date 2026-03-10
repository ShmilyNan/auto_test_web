'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPermission } from '@/lib/api/permissions';
import { useMutation } from '@tanstack/react-query';
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

const permissionSchema = z.object({
  name: z.string().min(1, '权限名称不能为空'),
  description: z.string().optional(),
  resource: z.string().min(1, '资源不能为空'),
  action: z.string().min(1, '操作不能为空'),
});

type PermissionFormData = z.infer<typeof permissionSchema>;

interface PermissionFormProps {
  onSuccess: () => void;
}

const resources = [
  'user',
  'role',
  'permission',
  'project',
  'test_case',
  'report',
];

const actions = [
  'create',
  'read',
  'update',
  'delete',
  'list',
  'execute',
];

export default function PermissionForm({ onSuccess }: PermissionFormProps) {
  const { toast } = useToast();

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      description: '',
      resource: '',
      action: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      toast({
        title: '成功',
        description: '权限已创建',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: error.response?.data?.detail || '创建权限失败',
      });
    },
  });

  const onSubmit = (data: PermissionFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>权限名称</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请输入权限名称" />
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
                <Input {...field} placeholder="请输入权限描述（可选）" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>资源</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择资源" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {resources.map((resource) => (
                    <SelectItem key={resource} value={resource}>
                      {resource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>操作</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择操作" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? '创建中...' : '创建'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
