import { z } from "zod";
import { useState, useCallback, useMemo } from "react";
import { useCreateOrder } from "./userOrder";
import type { CreateOrderResponse, OrderPayload } from "../../types/order";
import { orderSchema } from "../../schemas/order";
import { useCartStore } from "../../stores/cartStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Type for validation errors.
type OrderFormErrors = z.ZodError<z.infer<typeof orderSchema>> | null;

/**
 * Custom hook to manage the order form state, validation, and submission.
 * It integrates with the `useCreateOrder` mutation hook to handle API calls.
 */
export const useOrderForm = () => {
  const [formData, setFormData] = useState<OrderPayload>({
    customerId: "",
    items: [],
    paymentMethod: "invoice",
    discountAmount: 0,
    address: "",
  });

  const [orderResponse, setOrderResponse] =
    useState<CreateOrderResponse | null>(null);

  const { clearCart } = useCartStore();

  const navigate = useNavigate();

  const [errors, setErrors] = useState<OrderFormErrors>(null);
  const [success, setSuccess] = useState(false);

  const { mutate, isPending } = useCreateOrder({
    onSuccess: (data) => {
      setSuccess(true);
      setOrderResponse(data);
      setFormData({
        customerId: "",
        items: [],
        paymentMethod: "invoice",
        discountAmount: 0,
        address: "",
      });

      clearCart();

      toast.success("Order placed successfully! 🥳");
    },
    onError: (err) => {
      setSuccess(false);
      console.error("Form submission failed:", err);
    },
  });

  // Handle changes to form inputs.
  const handleChange = useCallback(
    <T extends keyof OrderPayload>(name: T, value: OrderPayload[T]) => {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  // Handle form submission with Zod validation.
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrors(null);
      setSuccess(false);

      try {
        const validatedData = orderSchema.parse(formData);
        mutate(validatedData);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setErrors(err as z.ZodError<z.infer<typeof orderSchema>>);
        } else {
          console.error("An unexpected error occurred:", err);
        }
      }
    },
    [formData, mutate]
  );

  /**
   * CanSubmit:
   * Runs a safe Zod validation and checks if form is valid before enabling submit.
   */
  const canSubmit = useMemo(() => {
    const result = orderSchema.safeParse(formData);
    return result.success; // true if valid, false if errors
  }, [formData]);

  return {
    formData,
    handleChange,
    handleSubmit,
    errors,
    isPending,
    success,
    canSubmit,
    orderResponse
  };
};
