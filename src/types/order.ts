import { z } from "zod";
import { orderSchema } from "../schemas/order";

// Type for a single line item in the order.
export type OrderLineItem = z.infer<typeof orderSchema>["items"][number];

// Type for the full order payload.
export type OrderPayload = z.infer<typeof orderSchema>;

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  subtotal: number;
}

export interface OrderData {
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  _id: string;
  orderNumber: string;
  registeredAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: OrderData;
}
