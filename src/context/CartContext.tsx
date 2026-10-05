"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, Topping } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, selectedOption?: string, selectedToppings?: Topping[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rincondulce_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("rincondulce_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (
    product: Product,
    selectedOption?: string,
    selectedToppings: Topping[] = []
  ) => {
    // Generate unique ID based on product + option + toppings sorted
    const toppingsKey = selectedToppings
      .map((t) => t.id)
      .sort()
      .join(",");
    const itemId = `${product.id}__${selectedOption || "def"}__${toppingsKey}`;

    const toppingsCost = selectedToppings.reduce(
      (sum, t) => sum + Number(t.price),
      0
    );
    const unitPrice = Number(product.price) + toppingsCost;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                quantity: i.quantity + 1,
                subtotal: (i.quantity + 1) * unitPrice,
              }
            : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity: 1,
          selectedOption,
          selectedToppings,
          subtotal: unitPrice,
        },
      ];
    });

    // Provide visual feedback by briefly opening cart or showing badge
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const unitPrice = item.subtotal / item.quantity;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
