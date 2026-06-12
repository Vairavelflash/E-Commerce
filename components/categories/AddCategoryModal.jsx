"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddCategoryModal() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const createCategory = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/categories", data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      reset();
    },
  });

  const onSubmit = (data) => {
    createCategory.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            placeholder="Category Name"
            {...register("name", {
              required: true,
            })}
          />

          <Textarea
            placeholder="Description"
            {...register("description")}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={createCategory.isPending}
          >
            {createCategory.isPending
              ? "Creating..."
              : "Create Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}