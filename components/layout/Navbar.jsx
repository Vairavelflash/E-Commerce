"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import useLogout from "@/hooks/useLogout";
import { useEffect, useState } from "react";

export default function Navbar() {
  const logoutMutation = useLogout();
  const [user, setUser] = useState("Guest User");

  useEffect(() => {
    let username =
      (typeof window !== "undefined" && localStorage.getItem("username")) ||
      "Guest User";
    setUser(username);
  }, []);
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Ecommerce
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="categories" className="text-sm font-medium">
            Categories
          </Link>
          <Link href="products" className="text-sm font-medium">
            Products
          </Link>
          <Link href="/admin/cart" className="text-sm font-medium">
            Cart
          </Link>

          <Link href="/admin/orders" className="text-sm font-medium">
            Orders
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{user}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
