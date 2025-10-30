"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, APICall } from "@/lib/api";
import { useStore } from "@/store/useStore";
import useOptimistic from "@/hooks/useOptimistic";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optState, setOptState, applyOptimistic] = useOptimistic(null);
  const store = useStore();

  useState(() => {
    APICall.get("/products/" + id)
      .then((r) => setProduct(r.data))
      .catch(console.error);
  });

  async function addToCart() {
    // optimistic UI: immediately add to local store
    const rollback = applyOptimistic((prev) => prev); // no complex state here; we rely on store
    const item = {
      product_id: id,
      quantity: 1,
      // name: product.name,
      // price: product.price,
      // stock: product.stock,
    };
    // store.addToCart(item);

    try {
      // add to session cart via API (or DB cart if user)
      const resCart = await APICall.post("/cart/db");
      console.log("cartID", resCart?.data?.cart?.id);
      store.setCartId(resCart?.data?.cart?.id);
      await APICall.post("/cart/db/items", {
        ...item,
        cart_id: resCart?.data?.cart?.id,
      });
    } catch (err) {
      console.error(err);
      // store.updateCartItem(id, 0);
    }
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <img
        src={product.image_url || "/placeholder.png"}
        className="h-72 w-full object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600">₹{product.price}</p>
      <p className="mt-4">{product.description}</p>
      <div className="mt-6 flex gap-2">
        <button
          onClick={addToCart}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
