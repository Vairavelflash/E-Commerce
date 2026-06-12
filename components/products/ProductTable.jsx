"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export default function ProductTable({ products, onView, onEdit, onDelete }) {

  return (
    <div className="border rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="border-b text-center">
              <td>{product.id}</td>

              <td>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-12 w-12 object-cover mx-auto"
                />
              </td>

              <td>{product.name}</td>

              <td>₹{product.price}</td>

              <td>{product.stock}</td>
              <td>{product.category_name}</td>
              <td>{new Date(product.created_at).toLocaleDateString()}</td>

              <td>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Actions</Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onView(product)}>
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onDelete(product)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
