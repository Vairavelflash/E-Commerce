"use client";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APICall } from "@/lib/api";

export default function Header() {
  const { user, logout } = useStore();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

useEffect(() => {
  const fetchCartAndItems = async () => {
    try {
      // Step 1: Get cart
      const cartResponse = await APICall.get("/cart/db");
      const cartId = cartResponse?.data?.cart?.id;

      if (!cartId) throw new Error("Cart ID not found");

      // Step 2: Get cart items count
      const itemsResponse = await APICall.get(`/cart-items?cart_id=${cartId}`);
      setCartCount(itemsResponse.data);
    } catch (error) {
      console.error("Cart loading failed:", error);
      // Optional: setCartCount(0) or show error state
    }
  };

  fetchCartAndItems();
}, []);
  return (
    <header className="p-4 border-b flex items-center justify-around">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          Ecom
        </Link>
        <Link
          href="/admin/products"
          className="text-sm text-gray-600 capitalize"
        >
          {user?.role}
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/admin/categories" className="font-bold text-lg">
          Categories
        </Link>
        <Link href="/admin/orders" className="font-bold text-lg">
          Orders
        </Link>
        <Link href="/admin/products" className="font-bold text-lg">
          Products
        </Link>
        <Link href="/admin/users" className="font-bold text-lg">
          Users
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/cart">Cart ({cartCount?.count})</Link>
        {user ? (
          <span className="text-sm">{user.name}</span>
        ) : (
          <Link href="/login">Login</Link>
        )}

        <Button
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </Button>
        <Button
          onClick={() => {
            logout();
            router.push("/signup");
          }}
        >
          Signup
        </Button>
      </div>
    </header>
  );
}
