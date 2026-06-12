"use client";

import AddCategoryModal from "@/components/categories/AddCategoryModal";
import CategoryTable from "@/components/categories/CategoryTable";

import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { data, isLoading } =
    useCategories();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Categories
        </h1>

        <AddCategoryModal />
      </div>

      <CategoryTable
        categories={data?.data || []}
      />
    </div>
  );
}