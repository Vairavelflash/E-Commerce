"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/auth/login", data);
      const userInfo = response.data.user;
      localStorage.setItem("username",userInfo.name)
      localStorage.setItem("userId",userInfo.id)
      localStorage.setItem("role",userInfo.role)
      // return response.data;
    },
    onSuccess: async () => {
      const authMe = await api.get("/auth/me");
      if (authMe.data?.data.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
      // router.refresh();
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="mb-6 text-2xl font-bold">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
          <Button
              className="w-full mt-3"
onClick={() => router.push("/signup")}
            >
             Signup
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
