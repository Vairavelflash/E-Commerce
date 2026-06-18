import { addToCart, getCart, removeCartItem, updateCartQuantity } from "@/services/cart.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useCart = () =>{
    return useQuery({
        queryKey:["cart"],
        queryFn:getCart
    })
}

export const useAddToCart = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:addToCart,
        onSettled:() =>{
            queryClient.invalidateQueries({
                queryKey:["cart"]
            })
        }
    })
}

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};