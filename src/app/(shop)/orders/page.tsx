"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [session]);

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Sign in to view orders</h1>
        <Link href="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="mt-4 h-6 w-32 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h1 className="mb-2 text-2xl font-bold">No orders yet</h1>
        <p className="mb-8 text-gray-500">Place your first order today.</p>
        <Link href="/products"><Button>Shop Now</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge className={statusColors[order.status]}>{order.status}</Badge>
            </div>
            <div className="space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    <Image
                      src={item.product.images?.[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-blue-600">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} x {formatPrice(Number(item.price))}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4 text-right">
              <p className="text-lg font-bold">Total: {formatPrice(Number(order.total))}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
