"use client";

import {
  useAddToCart,
  useCart,
  useRemoveCartItem,
  useUpdateCartQuantity,
} from "@/hooks/useCart";
import { useGetProduct } from "@/hooks/useProducts";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();

  const { data: product, isLoading } = useGetProduct(id);

  const { data: cart } = useCart();

  const addMutation = useAddToCart();
  const updateMutation = useUpdateCartQuantity();
  const removeMutation = useRemoveCartItem();

  const cartItem = cart?.items?.find((item) => item.productId === product.id);

  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addMutation.mutate(product.id);
  };
  const handleIncrease = () => {
    if (quantity >= product.stock) return;

    updateMutation.mutate({
      cartItemId: cartItem.id,
      quantity: quantity + 1,
    });
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      removeMutation.mutate(cartItem.id);
      return;
    }
    updateMutation.mutate({
      cartItemId: cartItem.id,
      quantity: quantity - 1,
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <img
        src={product?.imageUrl || "https://placehold.co/200x200?text=No_Image"}
        alt={product?.name || "alt_name"}
        className="w-full h-1/2 rounded-xl"
      />

      <div>
        <p className="text-sm text-gray-500">{product.category.name}</p>

        <h1 className="text-4xl font-bold mt-2">{product.name}</h1>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <div className="mt-6 text-3xl font-bold">${product.price}</div>

        <div className="mt-2 text-green-600">{product.stock} Available</div>

        {/* <div className="mt-8">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-black text-white px-8 py-3 rounded-lg"
            >
              Add To Cart
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecrease}
                className="w-10 h-10 border rounded"
              >
                -
              </button>

              <span className="text-xl font-semibold">{quantity}</span>

              <button
                disabled={quantity >= product.stock}
                onClick={handleIncrease}
                className="w-10 h-10 border rounded"
              >
                +
              </button>
            </div>
          )}
        </div> */}

        <div className="mt-8">
          <button
            onClick={handleAdd}
            className="bg-black text-white px-8 py-3 rounded-lg"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
