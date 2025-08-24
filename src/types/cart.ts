import type { Product } from "./product";

// A single item in the cart
export interface CartItem extends Product {
  quantity: number;
}

// The entire cart object
export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}
