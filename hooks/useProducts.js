import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";

export const useProducts = (search) => {
  return useQuery({
    queryKey: ["products", search],
    queryFn: () => getProducts(search),
  });
};