"use client";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "./ui/button";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APICall } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Header({ role }) {
  const { user, logout, trigger } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  const fetchCartAndItems = async () => {
    try {
      // Step 1: Get cart
      const cartResponse = await APICall.get("/cart/db");
      const cartId = cartResponse?.data?.cart?.id;

      if (!cartId) {
        console.log("Cart ID not found");
        return setCartCount({ count: 0 });
      }
      // Step 2: Get cart items count
      const itemsResponse = await APICall.get(`/cart-items?cart_id=${cartId}`);
      setCartCount(itemsResponse.data);
    } catch (error) {
      console.error("Cart loading failed:", error);
      setCartCount({ count: 0 }); // Optional: setCartCount(0) or show error state
    }
  };

  useEffect(() => {
    if (role == "user") {
      fetchCartAndItems();
    }
  }, [trigger]);
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
        {role == "admin" && (
          <Link
            href="/admin/categories"
            className={cn(
              "font-normal text-lg",
              pathname.includes("categories") &&
                "bg-black p-2 text-white rounded-md"
            )}
          >
            Categories
          </Link>
        )}
        <Link
          href={role == "admin" ? "/admin/orders" : "/order"}
          className={cn(
            "font-normal text-lg",
            pathname.includes("orders") && "bg-black p-2 text-white rounded-md"
          )}
        >
          Orders
        </Link>
        <Link
          href={role == "admin" ? "/admin/products" : "/product"}
          className={cn(
            "font-normal text-lg",
            pathname.includes("products") &&
              "bg-black p-2 text-white rounded-md"
          )}
        >
          Products
        </Link>
        {role == "admin" && (
          <Link
            href="/admin/users"
            className={cn(
              "font-normal text-lg",
              pathname.includes("users") && "bg-black p-2 text-white rounded-md"
            )}
          >
            Users
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {role == "user" && <Link href="/cart">Cart ({cartCount?.count})</Link>}
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
