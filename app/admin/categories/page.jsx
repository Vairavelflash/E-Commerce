"use client";

import AddCategoryModal from "@/components/categories/AddCategoryModal";
import CategoryTable from "@/components/categories/CategoryTable";



export default function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>

        <AddCategoryModal />
      </div>

      <CategoryTable />
    </div>
  );
}
