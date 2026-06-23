"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useCategories } from "@/hooks/useCategories";

export default function CategoryTable() {
const [page,setPage] = useState(1);
const [search,setSearch] = useState("");
const [limit,setLimit] = useState(10)

  const { data, isLoading } = useCategories(page,limit,search);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Fragment>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.categories?.length > 0 &&
              data?.categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>

                  <TableCell>{category.name}</TableCell>

                  <TableCell>{category.description}</TableCell>

                  <TableCell>
                    {new Date(category.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page > 1) {
                  setPage(page - 1);
                }
              }}
            />
          </PaginationItem>

          <PaginationItem>
            Page {data?.pagination.page} of {data?.pagination.totalPages}
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page < data?.pagination.totalPages) {
                  setPage(page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Fragment>
  );
}
