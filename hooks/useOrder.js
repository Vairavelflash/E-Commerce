import { checkoutCart, getOrders } from "@/services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useOrders =() =>{
  return useQuery({
    queryKey:["orders"],
    queryFn: getOrders
  })
}

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};
