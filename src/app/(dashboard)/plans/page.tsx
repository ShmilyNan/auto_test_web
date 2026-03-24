"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Play, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { getPlans, deletePlan } from "@/lib/api/plans";
import type { TestPlanResponse } from "@/types/plan";
import PlanForm from "@/components/plans/plan-form";

export default function PlansPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TestPlanResponse | null>(
    null,
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 获取测试计划列表
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => getPlans(),
  });

  // 删除测试计划
  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "成功",
        description: "测试计划已删除",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: error.response?.data?.detail || "删除测试计划失败",
      });
    },
  });

  const handleEdit = (plan: TestPlanResponse) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (plan: TestPlanResponse) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPlan) {
      deleteMutation.mutate(selectedPlan.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">测试计划</h1>
          <p className="mt-1 text-sm text-gray-500">管理和执行测试计划</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建计划
        </Button>
      </div>

      {/* Plans List */}
      <Card>
        <CardHeader>
          <CardTitle>计划列表</CardTitle>
          <CardDescription>共 {plans?.length || 0} 个测试计划</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : !plans || plans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无测试计划数据
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>计划名称</TableHead>
                  <TableHead>项目ID</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {plan.name}
                      </div>
                    </TableCell>
                    <TableCell>{plan.project_id}</TableCell>
                    <TableCell>
                      {plan.is_active ? (
                        <Badge className="bg-green-500">启用</Badge>
                      ) : (
                        <Badge variant="secondary">禁用</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(plan.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(plan)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新建测试计划</DialogTitle>
            <DialogDescription>创建新的测试计划</DialogDescription>
          </DialogHeader>
          <PlanForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑测试计划</DialogTitle>
            <DialogDescription>修改测试计划信息</DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <PlanForm
              planId={selectedPlan.id}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除测试计划 "{selectedPlan?.name}" 吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
