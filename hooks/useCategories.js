import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getCategories, getCategoriesList } from "@/services/category.service";



export const useCategories = (page,limit,search) => {
  return useQuery({
    queryKey: ["categories",page,limit,search],
    queryFn: () =>getCategories({page,limit,search}),

    placeholderData:(previousData) => previousData,
  });
};