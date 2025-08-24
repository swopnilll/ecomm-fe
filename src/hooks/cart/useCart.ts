import { useState, useMemo, useEffect } from "react";
import type { Product } from "../../types/product";
import type { Cart, CartItem } from "../../types/cart";

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => {
    try {
      const storedCart = localStorage.getItem("ecomm-cart");
      return storedCart
        ? JSON.parse(storedCart)
        : {
            items: [],
            itemCount: 0,
            subtotal: 0,
            taxAmount: 0,
            totalAmount: 0,
          };
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return {
        items: [],
        itemCount: 0,
        subtotal: 0,
        taxAmount: 0,
        totalAmount: 0,
      };
    }
  });

  // Use useEffect to sync state to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem("ecomm-cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) => item._id === product._id
      );
      let updatedItems: CartItem[];

      if (existingItem) {
        updatedItems = prevCart.items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = { ...product, quantity: 1 };
        updatedItems = [...prevCart.items, newItem];
      }

      // Recalculate totals directly within the state update
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

      return {
        items: updatedItems,
        itemCount: newItemCount,
        subtotal: parseFloat(newSubtotal.toFixed(2)),
        taxAmount: parseFloat(newTaxAmount.toFixed(2)),
        totalAmount: parseFloat(newTotalAmount.toFixed(2)),
      };
    });
  };

  const removeItem = (productId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter(
        (item) => item._id !== productId
      );

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

      return {
        items: updatedItems,
        itemCount: newItemCount,
        subtotal: parseFloat(newSubtotal.toFixed(2)),
        taxAmount: parseFloat(newTaxAmount.toFixed(2)),
        totalAmount: parseFloat(newTotalAmount.toFixed(2)),
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      itemCount: 0,
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
    });
  };

  return useMemo(
    () => ({
      cart,
      addItem,
      removeItem,
      clearCart,
    }),
    [cart, addItem, removeItem, clearCart]
  );
};
