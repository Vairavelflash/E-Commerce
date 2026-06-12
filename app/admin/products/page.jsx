"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import ProductSearch from "@/components/products/ProductSearch";
import ProductTable from "@/components/products/ProductTable";
import ProductModal from "@/components/products/ProductModal";
import DeleteProductModal from "@/components/products/DeleteProductModal";

import { Button } from "@/components/ui/button";

import { useProducts } from "@/hooks/useProducts";

import { deleteProduct } from "@/services/product.service";

export default function ProductsPage() {
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");

  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading } = useProducts(search);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setDeleteOpen(false);
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <ProductSearch
          searchText={searchText}
          setSearchText={setSearchText}
          onSearch={() => setSearch(searchText)}
        />

        <Button onClick={() => setCreateOpen(true)}>Add Product</Button>
      </div>

      <ProductTable
        products={data || []}
        onView={(product) => {
          setSelectedProduct(product);
          setViewOpen(true);
        }}
        onEdit={(product) => {
          setSelectedProduct(product);
          setEditOpen(true);
        }}
        onDelete={(product) => {
          setSelectedProduct(product);
          setDeleteOpen(true);
        }}
      />

      <ProductModal open={createOpen} setOpen={setCreateOpen} mode="create" />

      <ProductModal
        open={editOpen}
        setOpen={setEditOpen}
        mode="edit"
        product={selectedProduct}
      />

      <ProductModal
        open={viewOpen}
        setOpen={setViewOpen}
        mode="view"
        product={selectedProduct}
      />

      <DeleteProductModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onDelete={() => deleteMutation.mutate(selectedProduct.id)}
      />
    </div>
  );
}
