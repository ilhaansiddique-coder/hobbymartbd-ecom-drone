"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, BarChart3, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCompare } from "@/lib/hooks/use-compare";
import { toast } from "sonner";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price: number;
    salePrice: number | null;
    stock: number;
    images: string[];
    specs: any;
    categories: { name: string; slug: string }[];
    reviews: {
      id: string;
      rating: number;
      comment: string | null;
      user: { name: string | null; image: string | null };
      createdAt: Date;
    }[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toggleItem: toggleCompare, isInCompare } = useCompare();

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const specs = product.specs as Record<string, string> | null;

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images[0] || "/placeholder.svg",
        slug: product.slug,
        stock: product.stock,
      });
    }
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-12">
      {/* Images */}
      <div className="mb-8 lg:mb-0">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-50">
          <Image
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {discount > 0 && (
            <Badge className="absolute left-4 top-4 bg-red-500 text-white text-sm px-3 py-1">
              -{discount}% OFF
            </Badge>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative aspect-square w-20 overflow-hidden rounded-xl border-2 transition-all ${
                  i === selectedImage ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <div className="mb-2 flex flex-wrap gap-2">
          {product.categories.map((cat) => (
            <Badge key={cat.slug} variant="secondary" className="rounded-full">
              {cat.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>

        <div className="mt-4">
          {product.salePrice ? (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.salePrice)}</span>
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
              <Badge className="bg-green-100 text-green-700">Save {formatPrice(product.price - product.salePrice)}</Badge>
            </div>
          ) : (
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {product.reviews.length > 0 ? (
            <>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews.length} reviews)
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">No reviews yet</span>
          )}
        </div>

        <Separator className="my-6" />

        {product.description && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Description</h3>
            <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
          </div>
        )}

        {specs && Object.keys(specs).length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Specifications</h3>
            <div className="rounded-xl border">
              {Object.entries(specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex justify-between px-4 py-2.5 text-sm ${
                    i % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <span className="text-gray-500">{key}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="text-sm font-medium text-green-600">✓ In Stock ({product.stock} units)</span>
          ) : (
            <span className="text-sm font-medium text-red-500">✗ Out of Stock</span>
          )}
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center rounded-xl border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="p-3 hover:bg-gray-50"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => toggleItem(product.id)}
            className={isInWishlist(product.id) ? "text-red-500 border-red-200" : ""}
          >
            <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => toggleCompare(product.id)}
            className={isInCompare(product.id) ? "text-blue-500 border-blue-200" : ""}
          >
            <BarChart3 className="h-5 w-5" />
          </Button>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Customer Reviews</h3>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                      {review.user.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.user.name || "Anonymous"}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
