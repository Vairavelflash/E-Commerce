"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";



export default function ProductsSearch({
  onSearch,
}) {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex gap-2 w-full mb-6">
      <Input
        type="text"
        placeholder="Search products..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="flex-1 border rounded-md px-4 py-2"
      />

      <Button
        onClick={() => onSearch(searchText)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Search
      </Button>
    </div>
  );
}