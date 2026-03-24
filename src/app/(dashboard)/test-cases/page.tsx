"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Play, FileCode } from "lucide-react";
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
import { getTestCases, deleteTestCase } from "@/lib/api/test-cases";
import type { TestCaseResponse } from "@/types/test-case";
import TestCaseForm from "@/components/test-cases/test-case-form";

export default function TestCasesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] =
    useState<TestCaseResponse | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 获取测试用例列表
  const { data: testCases, isLoading } = useQuery({
    queryKey: ["test-cases"],
    queryFn: () => getTestCases(),
  });

  // 删除测试用例
  const deleteMutation = useMutation({
    mutationFn: deleteTestCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-cases"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "成功",
        description: "测试用例已删除",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: error.response?.data?.detail || "删除测试用例失败",
      });
    },
  });

  const handleEdit = (testCase: TestCaseResponse) => {
    setSelectedTestCase(testCase);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (testCase: TestCaseResponse) => {
    setSelectedTestCase(testCase);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTestCase) {
      deleteMutation.mutate(selectedTestCase.id);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800";
      case "POST":
        return "bg-blue-100 text-blue-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "PATCH":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">测试用例</h1>
          <p className="mt-1 text-sm text-gray-500">管理和执行API测试用例</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建用例
        </Button>
      </div>

      {/* Test Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>用例列表</CardTitle>
          <CardDescription>
            共 {testCases?.length || 0} 个测试用例
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : !testCases || testCases.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无测试用例数据
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>用例名称</TableHead>
                  <TableHead>项目ID</TableHead>
                  <TableHead>请求方法</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>预期状态码</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testCases.map((testCase) => (
                  <TableRow key={testCase.id}>
                    <TableCell className="font-medium">{testCase.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-gray-400" />
                        {testCase.name}
                      </div>
                    </TableCell>
                    <TableCell>{testCase.project_id}</TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(testCase.method)}>
                        {testCase.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {testCase.url}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {testCase.expected_status || 200}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(testCase.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(testCase)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(testCase)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新建测试用例</DialogTitle>
            <DialogDescription>创建新的API测试用例</DialogDescription>
          </DialogHeader>
          <TestCaseForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑测试用例</DialogTitle>
            <DialogDescription>修改测试用例配置</DialogDescription>
          </DialogHeader>
          {selectedTestCase && (
            <TestCaseForm
              testCaseId={selectedTestCase.id}
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
              确定要删除测试用例 "{selectedTestCase?.name}" 吗？此操作不可恢复。
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
