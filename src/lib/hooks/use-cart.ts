"use client";

import { useEffect, useState, useCallback } from "react";
import type { CartItem } from "@/lib/types";

function generateSessionId() {
  if (typeof window !== "undefined") {
    let id = localStorage.getItem("cart_session_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("cart_session_id", id);
    }
    return id;
  }
  return "";
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = generateSessionId();

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, quantity, sessionId }),
    });
    if (res.ok) fetchCart();
    return res.json();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity, sessionId }),
    });
    if (res.ok) fetchCart();
  };

  const removeItem = async (id: string) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, sessionId }),
    });
    if (res.ok) fetchCart();
  };

  const clearCart = async () => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true, sessionId }),
    });
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  return { items, loading, addItem, updateQuantity, removeItem, clearCart, subtotal };
}
