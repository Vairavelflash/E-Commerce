"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProduct, updateProduct } from "@/services/product.service";

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
import api from "@/lib/api";
import axios from "axios";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function ProductModal({ open, setOpen, mode, product }) {
  const queryClient = useQueryClient();
  const [imageKey, setImageKey] = useState("");
  const { data: categories } = useCategories();

  const { register, handleSubmit, setValue, watch, reset } = useForm();

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
    mutationFn: ({ id, data }) => updateProduct(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setOpen(false);
    },
  });

  const onSubmit = (data) => {
    data.price = parseFloat(data.price);
    data.stock = parseInt(data.stock);

    if (mode === "create") {
      createMutation.mutate(data);
    }

    if (mode === "edit") {
      delete data.created_at;
      delete data.isDeleted;
      delete data.updated_at;
      delete data.category_name;
      
      updateMutation.mutate({
        id: product.id,
        data,
      });
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    try {
      // Get presigned url
      const bodyObj = {
        fileName: file.name,
        contentType: file.type,
      };
      const response = await api.post("/uploads/presigned-url", bodyObj);
      if (response.status !== 200) {
        throw new Error("Failed to get presigned url");
      }

      const data = await response?.data;
      console.log(data);

      // Upload to S3
      const uploadResponse = await axios.put(data?.uploadUrl, file);
      if (uploadResponse.status !== 200) {
        throw new Error("Upload Failed");
      }

      setImageKey(data.key);

      // Set imageUrl in react-hook-form
      setValue("imageUrl", data.fileUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      alert("Upload successful");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleDeleteImage = async () => {
    if (!imageKey) return;

    try {
      await axios.delete("http://localhost:5000/api/v1/uploads", {
        data: {
          key: imageKey,
        },
      });

      setValue("imageUrl", "");
      setImageKey("");
    } catch (error) {
      console.error(error);
    }
  };

  const imageUrl = watch("imageUrl");

  const readOnly = mode === "view";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("imageUrl")} />

          <input type="file" accept="image/*" onChange={handleUpload} />

          {imageUrl && (
            <div className="relative w-fit">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover border"
              />

              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-1 right-1"
              >
                ❌
              </button>
            </div>
          )}

          <Input placeholder="Name" readOnly={readOnly} {...register("name")} />

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

          <Select
            className="w-full "
            disabled={readOnly}
            value={watch("categoryId")?.toString() || ""}
            onValueChange={(value) => setValue("categoryId", value)}
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>

            <SelectContent>
              {categories?.data?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {mode !== "view" && (
            <Button type="submit" className="w-full">
              {mode === "create" ? "Create Product" : "Update Product"}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
