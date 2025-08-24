import { z } from "zod";

export const CartItemSchema = z.object({
  _id: z.string(),
  name: z.string(),
  images: z.array(z.string()).optional(),
  basePrice: z.number().min(0),
  taxRate: z.number().min(0),
  quantity: z.number().int().min(1),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  itemCount: z.number().int().min(0),
  subtotal: z.number().min(0),
  taxAmount: z.number().min(0),
  totalAmount: z.number().min(0),
});