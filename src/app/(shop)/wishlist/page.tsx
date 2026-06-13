"use client";

import { useWishlist } from "@/lib/hooks/use-wishlist";
import { ProductGrid } from "@/components/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items, loading } = useWishlist();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Skeleton className="mb-8 h-8 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border p-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="mt-4 h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-3 h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h1 className="mb-2 text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mb-8 text-gray-500">Save your favorite items here.</p>
        <Link href="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  const mappedItems = items.map((i: any) => ({
    id: i.id,
    name: i.name,
    slug: i.slug,
    price: Number(i.price),
    salePrice: i.salePrice ? Number(i.salePrice) : null,
    images: i.images,
    stock: i.stock,
    categories: [],
    rating: null,
    reviewCount: 0,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">My Wishlist ({items.length} items)</h1>
      <ProductGrid products={mappedItems} />
    </div>
  );
}
