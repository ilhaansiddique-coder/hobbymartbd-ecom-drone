// Tiny localStorage-backed list store with same-tab + cross-tab sync.
// Used by the cart, wishlist and compare hooks so they work without Redis/login.

const EVENT = "hobbymart:store";

export function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

export function writeList<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
  // Notify other hook instances in THIS tab (storage event only fires cross-tab).
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

export function subscribe(key: string, cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onCustom = (e: Event) => {
    if ((e as CustomEvent).detail === key) cb();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) cb();
  };
  window.addEventListener(EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
