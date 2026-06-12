// app/page.jsx - Home (product list)
"use client";
import { useEffect, useState, useTransition } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .get("/products")
      .then((r) => {
        if (mounted) setProducts(r.data);
      })
      .catch(console.error);
    return () => (mounted = false);
  }, []);

  function handleSearch(e) {
    const val = e.target.value;
    setQ(val);
    // useTransition for non-urgent updates (searching)
    startTransition(() => {
      api
        .get("/search?q=" + encodeURIComponent(val))
        .then((r) => setProducts(r.data))
        .catch(console.error);
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-1 gap-2">
        <input
          value={q}
          onChange={handleSearch}
          placeholder="Search products"
          className="border p-2 rounded flex-1"
        />
        <button className="px-3 py-2 bg-black text-white rounded">
          Search
        </button>
      </div>

      {isPending ? <div>Searching...</div> : null}

      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
