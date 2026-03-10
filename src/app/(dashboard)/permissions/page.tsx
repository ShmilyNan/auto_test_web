'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPermissions, createPermission } from '@/lib/api/permissions';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import PermissionForm from '@/components/permissions/permission-form';

export default function PermissionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // 获取权限列表
  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">权限管理</h1>
          <p className="text-muted-foreground mt-2">
            查看和创建系统权限
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建权限
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>权限名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>资源</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>创建时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : permissions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              permissions?.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.id}</TableCell>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{permission.resource}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{permission.action}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(permission.created_at).toLocaleDateString('zh-CN')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新建权限</DialogTitle>
            <DialogDescription>创建新的系统权限</DialogDescription>
          </DialogHeader>
          <PermissionForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
