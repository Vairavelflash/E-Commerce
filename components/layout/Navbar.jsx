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
  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "",
  });

  useEffect(() => {
    let username =
      (typeof window !== "undefined" && localStorage.getItem("username")) ||
      "Guest User";
    let userRole =
      (typeof window !== "undefined" && localStorage.getItem("role")) || "USER";
    setUserInfo({
      name: username,
      role: userRole,
    });
  }, []);
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Ecommerce
        </Link>

        <nav className="flex items-center gap-6">
          {userInfo?.role === "ADMIN" && (
            <Link href="categories" className="text-sm font-medium">
              Categories
            </Link>
          )}
          <Link href="products" className="text-sm font-medium">
            Products
          </Link>
          <Link href="cart" className="text-sm font-medium">
            Cart
          </Link>

          <Link href="orders" className="text-sm font-medium">
            Orders
          </Link>
          {userInfo?.role === "ADMIN" && (
            <Link href="aichat" className="text-sm font-medium">
              AI
            </Link>
          )}
          {userInfo?.role === "ADMIN" && (
            <Link href="aiagent" className="text-sm font-medium">
              AI Agent
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{userInfo?.name}</Button>
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
