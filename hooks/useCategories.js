import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getCategories, getCategoriesList } from "@/services/category.service";



export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};