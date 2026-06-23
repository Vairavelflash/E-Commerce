import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/services/product.service";

export const useProducts = (page,limit,search) => {
  return useQuery({
    queryKey: ["products", page,limit,search],
    queryFn: () => getProducts({page,limit,search}),
  });
};

export const useGetProduct = (id) =>{
  return useQuery({
    queryKey:["productsById"],
    queryFn:() =>getProduct(id),
    enabled: !!id
  })
}