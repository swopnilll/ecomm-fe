import { toast } from "react-hot-toast";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { createOrder } from "../../services/api/order";
import type { CreateOrderResponse, OrderPayload } from "../../types/order";

export const useCreateOrder = (
  options?: UseMutationOptions<CreateOrderResponse, Error, OrderPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(data.message);
      options?.onSuccess?.(data, variables, context); 
    },
    onError: (error) => {
      toast.error("Failed to create order.");
      console.error("Order creation error:", error);
    },
    ...options,
  });
};
