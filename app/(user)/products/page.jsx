// app/page.jsx - Home (product list)
"use client";
import { useEffect, useState, useTransition } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import ProductsSearch from "@/components/products/ProductsSearch";

export default function UserProductsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useProducts(search);

  return (
    <div>
      <div className="mb-4 flex flex-1 gap-2">

        <ProductsSearch onSearch={setSearch} />
      </div>

      {isLoading ? <div>Searching...</div> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.products.length > 0 &&
          data?.products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
