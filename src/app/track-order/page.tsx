"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, Loader2, MapPin, Calendar, CreditCard } from "lucide-react";

const statusSteps = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?id=${orderId}&email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Order not found");
      }
      const data = await res.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? statusSteps.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Track Your <span className="text-blue-600">Order</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Enter your order ID and email to check the current status.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-12 lg:px-8">
        <form onSubmit={handleTrack} className="rounded-2xl border bg-white p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              required
              placeholder="e.g. ORD-123456"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            {loading ? "Searching..." : "Track Order"}
          </Button>
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {order && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="text-sm font-medium text-gray-900">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-medium text-gray-900">${Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
                <div className="space-y-6 relative">
                  {statusSteps.map((step, i) => (
                    <div key={step.key} className="flex items-center gap-4">
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          i <= currentStepIndex
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            i <= currentStepIndex ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        {i === currentStepIndex && order.status === "shipped" && order.trackingNumber && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="rounded-2xl border bg-white p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Items</h2>
                <div className="divide-y">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-500">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.product?.name || item.name || `Product #${item.productId}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
