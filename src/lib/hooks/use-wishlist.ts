"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useWishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchWishlist();
    else setLoading(false);
  }, [session, fetchWishlist]);

  const toggleItem = async (productId: string) => {
    if (!session) {
      window.location.href = "/login";
      return;
    }
    const exists = items.find((i) => i.id === productId);
    const res = await fetch("/api/wishlist", {
      method: exists ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) fetchWishlist();
  };

  const isInWishlist = (productId: string) => items.some((i) => i.id === productId);

  return { items, loading, toggleItem, isInWishlist };
}
