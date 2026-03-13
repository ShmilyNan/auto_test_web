"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Play, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { TESTCASE } from "@/lib/constants/permissions";
import TestCaseForm from "@/components/test-cases/test-case-form";
import { HttpMethod } from "@/types/test-case";
import { getTestCases, deleteTestCase } from "@/lib/api/test-cases";
import { executeTest, generateReport } from "@/lib/api/reports";
import { getProjects } from "@/lib/api/projects";
import type { TestCaseListResponse } from "@/types/test-case";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export default function TestCasesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] =
    useState<TestCaseListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    projectId: "all",
    status: "all",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 获取测试用例列表
  const { data: testCasesData, isLoading } = useQuery({
    queryKey: ["test-cases", page, appliedFilters],
    queryFn: () =>
      getTestCases({
        page,
        page_size: 10,
        name: appliedFilters.name || undefined,
        project_id:
          appliedFilters.projectId === "all"
            ? undefined
            : Number(appliedFilters.projectId),
        is_active:
          appliedFilters.status === "all"
            ? undefined
            : appliedFilters.status === "active",
      }),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects", "filter-options"],
    queryFn: () => getProjects({ page: 1, page_size: 1000 }),
  });

  const testCases = testCasesData?.items || [];

  const executeMutation = useMutation({
    mutationFn: executeTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-cases"] });
      toast({
        title: "执行成功",
        description: "测试用例已触发执行",
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: "destructive",
        title: "执行失败",
        description:
          (error as { message?: string })?.message || "执行测试用例失败",
      });
    },
  });

  const generateReportMutation = useMutation({
    mutationFn: generateReport,
    onSuccess: () => {
      toast({
        title: "生成成功",
        description: "测试报告已生成，请前往测试报告页面查看",
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: "destructive",
        title: "生成失败",
        description:
          (error as { message?: string })?.message || "生成测试报告失败",
      });
    },
  });

  // 删除测试用例
  const deleteMutation = useMutation({
    mutationFn: deleteTestCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-cases"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "删除成功",
        description: "测试用例已删除",
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: "destructive",
        title: "删除失败",
        description:
          (error as { message?: string })?.message || "删除测试用例失败",
      });
    },
  });

  const handleEdit = (testCase: TestCaseListResponse) => {
    setSelectedTestCase(testCase);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (testCase: TestCaseListResponse) => {
    setSelectedTestCase(testCase);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTestCase) {
      deleteMutation.mutate(selectedTestCase.id);
    }
  };

  const handleRunTest = (testCase: TestCaseListResponse) => {
    executeMutation.mutate({
      project_id: testCase.project_id,
      test_case_ids: [testCase.id],
    });
  };

  const handleGenerateReport = (testCase: TestCaseListResponse) => {
    const canGenerate =
      testCase.can_generate_report ??
      (testCase.last_execution_status &&
        testCase.last_execution_status !== "not_run" &&
        testCase.last_execution_status !== "running");

    if (!canGenerate) {
      toast({
        variant: "destructive",
        title: "无法生成",
        description: "该用例尚未执行，无法生成测试报告",
      });
      return;
    }

    generateReportMutation.mutate({
      test_case_id: testCase.id,
    });
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleReset = () => {
    const defaultFilters = {
      name: "",
      projectId: "all",
      status: "all",
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
  };

  const getMethodBadgeColor = (method: HttpMethod) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
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
          <p className="mt-1 text-sm text-gray-500">管理和创建 API 测试用例</p>
        </div>
        <PermissionGuard permission={TESTCASE.CREATE}>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建用例
          </Button>
        </PermissionGuard>
      </div>

      {/* Query */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索测试用例..."
                value={filters.name}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, name: e.target.value }))
                }
                className="pl-9"
              />
            </div>
            <Select
              value={filters.projectId}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, projectId: value }))
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="所属项目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部项目</SelectItem>
                {projectsData?.items.map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>查询</Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>测试用例列表</CardTitle>
          <CardDescription>
            共 {testCasesData?.total || 0} 个测试用例
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : testCases.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {appliedFilters.name ||
              appliedFilters.status !== "all" ||
              appliedFilters.projectId !== "all"
                ? "未找到匹配的测试用例"
                : "暂无测试用例，点击上方按钮创建"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>用例名称</TableHead>
                  <TableHead>方法</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>项目</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testCases.map((testCase) => (
                  <TableRow key={testCase.id}>
                    <TableCell className="font-medium">{testCase.id}</TableCell>
                    <TableCell>{testCase.name}</TableCell>
                    <TableCell>
                      <Badge
                        className={getMethodBadgeColor(
                          testCase.method || "GET",
                        )}
                      >
                        {testCase.method || "GET"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {testCase.url}
                    </TableCell>
                    <TableCell>{testCase.project_name || "-"}</TableCell>
                    <TableCell>
                      {testCase.is_active ? (
                        <Badge variant="default">启用</Badge>
                      ) : (
                        <Badge variant="secondary">禁用</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRunTest(testCase)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateReport(testCase)}
                          disabled={
                            !(
                              testCase.can_generate_report ??
                              (testCase.last_execution_status &&
                                testCase.last_execution_status !== "not_run" &&
                                testCase.last_execution_status !== "running")
                            )
                          }
                          title="生成测试报告"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <PermissionGuard permission={TESTCASE.UPDATE}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(testCase)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission={TESTCASE.DELETE}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(testCase)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {testCasesData && testCasesData.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {testCasesData.total} 条记录，第 {testCasesData.page} /{" "}
            {testCasesData.pages} 页
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) => Math.min(testCasesData.pages, p + 1))
              }
              disabled={page === testCasesData.pages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="!max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>新建测试用例</DialogTitle>
            <DialogDescription>创建新的 API 测试用例</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 -mr-4 pr-4">
            <TestCaseForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="!max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>编辑测试用例</DialogTitle>
            <DialogDescription>修改测试用例信息</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 -mr-4 pr-4">
            {selectedTestCase && (
              <TestCaseForm
                testCaseId={selectedTestCase.id}
                onSuccess={() => setIsEditDialogOpen(false)}
              />
            )}
          </div>
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
              确定要删除测试用例「{selectedTestCase?.name}」吗？此操作不可恢复。
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
