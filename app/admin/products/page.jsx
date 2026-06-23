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
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function ProductsPage() {
  const queryClient = useQueryClient();

 const [page,setPage] = useState(1);
 const [search,setSearch] = useState("");
 const [limit,setLimit] = useState(10)
 
   const { data, isLoading } = useProducts(page,limit,search);



  const [selectedProduct, setSelectedProduct] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);


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
        {/* <ProductSearch
          searchText={searchText}
          setSearchText={setSearchText}
          onSearch={() => setSearch(searchText)}
        /> */}

        <Button onClick={() => setCreateOpen(true)}>Add Product</Button>
      </div>

      <ProductTable
        products={data?.products || []}
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

        <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page > 1) {
                  setPage(page - 1);
                }
              }}
            />
          </PaginationItem>

          <PaginationItem>
            Page {data?.pagination.page} of {data?.pagination.totalPages}
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page < data?.pagination.totalPages) {
                  setPage(page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

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
