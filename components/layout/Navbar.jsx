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

export default function Navbar() {
  const logoutMutation = useLogout();

  // Later replace with user api response
  const user = {
    name: "John Doe",
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold"
        >
          Ecommerce
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="categories"
            className="text-sm font-medium"
          >
            Categories
          </Link>
          <Link
            href="products"
            className="text-sm font-medium"
          >
            Products
          </Link>
          <Link
            href="cart"
            className="text-sm font-medium"
          >
            Cart
          </Link>

          <Link
            href="orders"
            className="text-sm font-medium"
          >
            Orders
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {user.name}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              

              <DropdownMenuItem
                onClick={() =>
                  logoutMutation.mutate()
                }
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}