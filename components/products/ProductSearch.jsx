"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductSearch({
  searchText,
  setSearchText,
  onSearch,
}) {
  return (
    <div className="flex flex-1 justify-end gap-2 mr-5">
      <Input
        placeholder="Search product..."
        value={searchText}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
        className="w-80"
      />

      <Button onClick={onSearch}>
        Search
      </Button>
    </div>
  );
}