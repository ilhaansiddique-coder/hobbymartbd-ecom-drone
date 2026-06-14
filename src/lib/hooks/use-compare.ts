"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { readList, writeList, subscribe } from "@/lib/local-store";

export type CompareItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  specs: Record<string, string> | null;
};

const KEY = "hobbymart_compare";
const MAX = 4;

export function useCompare() {
  const [items, setItems] = useState<CompareItem[]>([]);

  const refresh = useCallback(() => setItems(readList<CompareItem>(KEY)), []);

  useEffect(() => {
    refresh();
    return subscribe(KEY, refresh);
  }, [refresh]);

  // Accepts a full product (to add) or an id string (to remove existing).
  const toggleItem = (arg: string | CompareItem) => {
    const id = typeof arg === "string" ? arg : arg.id;
    const current = readList<CompareItem>(KEY);
    if (current.some((i) => i.id === id)) {
      writeList(KEY, current.filter((i) => i.id !== id));
    } else if (typeof arg !== "string") {
      if (current.length >= MAX) {
        toast.error(`You can compare up to ${MAX} products`);
        return;
      }
      writeList(KEY, [...current, arg]);
    }
  };

  const isInCompare = (id: string) => items.some((i) => i.id === id);

  return { items, toggleItem, isInCompare };
}
