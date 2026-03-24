"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { register as registerUser, updateUser } from "@/lib/api/auth";
import type { UserResponse } from "@/types/auth";

// Form schema
const userSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符")
    .max(50, "用户名最多50个字符"),
  email: z.string().email("请输入有效的邮箱"),
  full_name: z.string().optional(),
  password: z.string().min(6, "密码至少6个字符").optional().or(z.literal("")),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  userId?: number;
  onSuccess: () => void;
}

export default function UserForm({ userId, onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      password: "",
    },
  });

  // 创建用户
  const createMutation = useMutation({
    mutationFn: (data: UserFormData) =>
      registerUser({
        username: data.username,
        email: data.email,
        full_name: data.full_name || null,
        password: data.password || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "成功",
        description: "用户已创建",
      });
      onSuccess();
      reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "创建失败",
        description: error.response?.data?.detail || "创建用户失败",
      });
    },
  });

  // 更新用户
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserFormData }) =>
      updateUser(id, {
        email: data.email,
        full_name: data.full_name || null,
        password: data.password || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "成功",
        description: "用户已更新",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "更新失败",
        description: error.response?.data?.detail || "更新用户失败",
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (userId) {
      updateMutation.mutate({ id: userId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">用户名 *</Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="请输入用户名"
          disabled={!!userId}
        />
        {errors.username && (
          <p className="text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">邮箱 *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="请输入邮箱"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">姓名</Label>
        <Input
          id="full_name"
          {...register("full_name")}
          placeholder="请输入姓名"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">密码 {userId ? "(留空则不修改)" : "*"}</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder={userId ? "留空则不修改密码" : "请输入密码"}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "保存中..."
            : userId
              ? "保存"
              : "创建"}
        </Button>
      </div>
    </form>
  );
}
