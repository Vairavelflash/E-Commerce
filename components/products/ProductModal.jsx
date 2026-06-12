"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProduct,
  updateProduct,
} from "@/services/product.service";

import { useCategories } from "@/hooks/useCategories";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductModal({
  open,
  setOpen,
  mode,
  product,
}) {
  const queryClient = useQueryClient();

  const { data: categories } =
    useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    if (product) {
      reset(product);
    } else {
      reset({
        name: "",
        description: "",
        imageUrl: "",
        stock: "",
        price: "",
        categoryId: "",
      });
    }
  }, [product, reset]);

  const createMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateProduct(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setOpen(false);
    },
  });

  const onSubmit = (data) => {
    data.price = parseFloat(data.price)
    data.stock = parseInt(data.stock)

    if (mode === "create") {
      createMutation.mutate(data);
    }

    if (mode === "edit") {
      updateMutation.mutate({
        id: product.id,
        data,
      });
    }
  };

  const readOnly = mode === "view";

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Product"
              : mode === "edit"
              ? "Edit Product"
              : "View Product"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            placeholder="Image URL"
            readOnly={readOnly}
            {...register("imageUrl")}
          />

          <Input
            placeholder="Name"
            readOnly={readOnly}
            {...register("name")}
          />

          <Input
            placeholder="Description"
            readOnly={readOnly}
            {...register("description")}
          />

          <Input
            type="number"
            placeholder="Price"
            readOnly={readOnly}
            {...register("price")}
          />

          <Input
            type="number"
            placeholder="Stock"
            readOnly={readOnly}
            {...register("stock")}
          />

          <Select className="w-full"
            disabled={readOnly}
            value={
              watch("categoryId")?.toString() ||
              ""
            }
            onValueChange={(value) =>
              setValue(
                "categoryId",
                value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>

            <SelectContent>
              {categories?.data?.map(
                (category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          {mode !== "view" && (
            <Button
              type="submit"
              className="w-full"
            >
              {mode === "create"
                ? "Create Product"
                : "Update Product"}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}