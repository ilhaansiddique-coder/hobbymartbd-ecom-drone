"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCompare } from "@/lib/hooks/use-compare";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    images: string[];
    stock: number;
    rating: number | null;
    reviewCount: number;
    categories: { name: string; slug: string }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toggleItem: toggleCompare, isInCompare } = useCompare();

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    await addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0] || "/placeholder.svg",
      slug: product.slug,
      stock: product.stock,
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {discount > 0 && (
            <Badge className="absolute left-2 top-2 bg-red-500 text-white">
              -{discount}%
            </Badge>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-sm font-medium text-white">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <div className="mb-1 flex items-center gap-1">
          {product.rating && (
            <>
              <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
            </>
          )}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-baseline gap-1">
          {product.salePrice ? (
            <>
              <span className="text-sm font-bold text-gray-900">{formatPrice(product.salePrice)}</span>
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1">
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={handleAddToCart} disabled={product.stock <= 0}>
            <ShoppingCart className="mr-1 h-3 w-3" />
            Add to Cart
          </Button>
          <button
            onClick={() => toggleItem({ id: product.id, name: product.name, slug: product.slug, price: product.price, salePrice: product.salePrice, images: product.images })}
            className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
              isInWishlist(product.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => toggleCompare({ id: product.id, name: product.name, slug: product.slug, price: product.price, salePrice: product.salePrice, images: product.images, specs: (product as { specs?: Record<string, string> | null }).specs ?? null })}
            className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
              isInCompare(product.id) ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
