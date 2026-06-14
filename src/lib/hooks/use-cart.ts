"use client";

import { useEffect, useState, useCallback } from "react";
import type { CartItem } from "@/lib/types";
import { readList, writeList, subscribe } from "@/lib/local-store";

const KEY = "hobbymart_cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setItems(readList<CartItem>(KEY));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe(KEY, refresh);
  }, [refresh]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const current = readList<CartItem>(KEY);
    const existing = current.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      current.push({ ...item, quantity });
    }
    writeList(KEY, current);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    const current = readList<CartItem>(KEY);
    const item = current.find((i) => i.id === id);
    if (item) item.quantity = quantity;
    writeList(KEY, current);
  };

  const removeItem = (id: string) => {
    writeList(KEY, readList<CartItem>(KEY).filter((i) => i.id !== id));
  };

  const clearCart = () => writeList(KEY, []);

  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  return { items, loading, addItem, updateQuantity, removeItem, clearCart, subtotal };
}
