"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm();

  const selectedRole = watch("role");

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });

  const onSubmit = (data) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="mb-6 text-2xl font-bold">Signup</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Name"
              {...register("name", {
                required: "First name is required",
              })}
            />

            <Input
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
            />

            <Input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: 2,
              })}
            />

            <Select
              className="w-full "
              value={selectedRole || ""}
  onValueChange={(value) => setValue("role", value, { shouldValidate: true })}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent>
                {["ADMIN", "USER"]?.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
