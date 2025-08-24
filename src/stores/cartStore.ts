import { create } from "zustand";
import type { Product } from "../types/product";
import type { Cart, CartItem } from "../types/cart";

// Define the shape of our store's state and functions
interface CartState {
  cart: Cart;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

// Define the initial state for an empty cart
const initialCart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  taxAmount: 0,
  totalAmount: 0,
};

// Create the Zustand store. 'set' is used to update the state,
// and 'get' is used to read the current state.
export const useCartStore = create<CartState>((set, get) => ({
  // Initialize the cart state from localStorage or use the initialCart if no data exists.
  cart: JSON.parse(
    localStorage.getItem("ecomm-cart") || JSON.stringify(initialCart)
  ),

  // Action to add an item to the cart
  addItem: (product) => {
    set((state) => {
      // Find if the item already exists in the cart
      const existingItem = state.cart.items.find(
        (item) => item._id === product._id
      );
      let updatedItems: CartItem[];

      // If the item exists, increment its quantity; otherwise, add the new item
      if (existingItem) {
        updatedItems = state.cart.items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = { ...product, quantity: 1 };
        updatedItems = [...state.cart.items, newItem];
      }

      // Recalculate all cart totals based on the updated items array
      const newSubtotal = updatedItems.reduce(
        (sum, item) => sum + item.basePrice * item.quantity,
        0
      );
      const newTaxAmount = updatedItems.reduce(
        (sum, item) =>
          sum + ((item.basePrice * item.taxRate) / 100) * item.quantity,
        0
      );
      const newTotalAmount = newSubtotal + newTaxAmount;
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // Create the new cart object
      const newCart = {
        items: updatedItems,
        itemCount: newItemCount,
        subtotal: parseFloat(newSubtotal.toFixed(2)),
        taxAmount: parseFloat(newTaxAmount.toFixed(2)),
        totalAmount: parseFloat(newTotalAmount.toFixed(2)),
      };

      // Persist the new state to localStorage
      localStorage.setItem("ecomm-cart", JSON.stringify(newCart));

      // Return the new state object to Zustand
      return { cart: newCart };
    });
  },

  // Action to remove a specific item from the cart
  removeItem: (productId) => {
    set((state) => {
      // Filter out the item with the matching productId
      const updatedItems = state.cart.items.filter(
        (item) => item._id !== productId
      );

      // Recalculate all cart totals based on the new item list
      const newSubtotal = updatedItems.reduce(
        (sum, item) => sum + item.basePrice * item.quantity,
        0
      );
      const newTaxAmount = updatedItems.reduce(
        (sum, item) =>
          sum + ((item.basePrice * item.taxRate) / 100) * item.quantity,
        0
      );
      const newTotalAmount = newSubtotal + newTaxAmount;
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // Create the new cart object
      const newCart = {
        items: updatedItems,
        itemCount: newItemCount,
        subtotal: parseFloat(newSubtotal.toFixed(2)),
        taxAmount: parseFloat(newTaxAmount.toFixed(2)),
        totalAmount: parseFloat(newTotalAmount.toFixed(2)),
      };

      // Persist the new state to localStorage
      localStorage.setItem("ecomm-cart", JSON.stringify(newCart));

      // Return the new state object to Zustand
      return { cart: newCart };
    });
  },

  // Action to clear the entire cart
  clearCart: () => {
    set(() => {
      // Clear the item in localStorage
      localStorage.setItem("ecomm-cart", JSON.stringify(initialCart));
      return { cart: initialCart };
    });
  },
}));
