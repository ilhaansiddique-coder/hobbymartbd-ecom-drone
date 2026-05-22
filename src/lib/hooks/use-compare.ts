"use client";

import { useEffect, useState, useCallback } from "react";

export function useCompare() {
  const [items, setItems] = useState<any[]>([]);

  const fetchCompare = useCallback(async () => {
    try {
      const res = await fetch("/api/compare");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    fetchCompare();
  }, [fetchCompare]);

  const toggleItem = async (productId: string) => {
    const exists = items.find((i: any) => i.id === productId);
    const res = await fetch("/api/compare", {
      method: exists ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) fetchCompare();
  };

  const isInCompare = (productId: string) => items.some((i: any) => i.id === productId);

  return { items, toggleItem, isInCompare };
}
