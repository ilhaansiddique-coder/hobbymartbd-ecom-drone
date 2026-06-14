"use client";

import { useEffect, useState, useCallback } from "react";
import { readList, writeList, subscribe } from "@/lib/local-store";

export type WishlistItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
};

const KEY = "hobbymart_wishlist";

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setItems(readList<WishlistItem>(KEY));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe(KEY, refresh);
  }, [refresh]);

  // Accepts a full product (to add) or an id string (to remove existing).
  const toggleItem = (arg: string | WishlistItem) => {
    const id = typeof arg === "string" ? arg : arg.id;
    const current = readList<WishlistItem>(KEY);
    if (current.some((i) => i.id === id)) {
      writeList(KEY, current.filter((i) => i.id !== id));
    } else if (typeof arg !== "string") {
      writeList(KEY, [...current, arg]);
    }
  };

  const isInWishlist = (id: string) => items.some((i) => i.id === id);

  return { items, loading, toggleItem, isInWishlist };
}
