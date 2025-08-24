import { z } from "zod";

// Define the schema for a single order line item.
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID cannot be empty."),
  productName: z.string().min(1, "Product name cannot be empty."),
  quantity: z.number().int().min(1, "Quantity must be at least 1."),
  unitPrice: z.number().min(0, "Unit price cannot be negative."),
  taxRate: z.number().min(0).max(1, "Tax rate must be between 0 and 1."),
});

// Main Zod schema for the entire order payload
export const orderSchema = z.object({
  customerId: z.string().min(1, "Customer ID cannot be empty."),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item."),
  paymentMethod: z.enum(["invoice"]),
  discountAmount: z.number().min(0, "Discount amount cannot be negative."),
  address: z.string().min(1, "Address cannot be empty."),
});