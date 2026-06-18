import { checkoutCart } from "@/services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
