"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/hooks/use-cart";

export default function CartPage() {
  const { items, loading, updateQuantity, removeItem, subtotal } = useCart();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Skeleton className="mb-8 h-8 w-64" />
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border bg-white p-4">
                <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 lg:mt-0">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mb-8 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products">
          <Button><ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Shopping Cart ({items.length} items)</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl border bg-white p-4">
              <div className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${item.slug}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {item.salePrice ? formatPrice(item.salePrice) : formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="mt-6 w-full" size="lg">Proceed to Checkout</Button>
            </Link>
            <Link href="/products" className="mt-3 block text-center text-sm text-blue-600 hover:text-blue-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
