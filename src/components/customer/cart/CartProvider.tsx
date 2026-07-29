"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';

export interface CartItem {
  cartItemId: string; // Unique local ID for the cart row
  menuItemId: string;
  name: string;
  basePrice: number;
  variantId?: string;
  variantName?: string;
  variantPrice?: number;
  quantity: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'cartItemId'>) => {
    // Determine if exact same configuration exists to merge quantities
    const existingIndex = items.findIndex(i =>
      i.menuItemId === item.menuItemId &&
      i.variantId === item.variantId &&
      i.notes === item.notes
    );

    if (existingIndex > -1) {
      setItems(prev => {
        const newItems = [...prev];
        newItems[existingIndex].quantity += item.quantity;
        return newItems;
      });
    } else {
      const newItem: CartItem = {
        ...item,
        cartItemId: Math.random().toString(36).substr(2, 9)
      };
      setItems(prev => [...prev, newItem]);
    }
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const subtotal = useMemo(() => items.reduce((acc, item) => {
    const itemCost = item.basePrice + (item.variantPrice || 0);
    return acc + (itemCost * item.quantity);
  }, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
