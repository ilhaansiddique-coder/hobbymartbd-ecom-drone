"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingCart, Users, Star, Tags, DollarSign } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardData {
  productCount: number;
  orderCount: number;
  userCount: number;
  reviewCount: number;
  categoryCount: number;
  revenue: number;
  recentOrders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string };
  }[];
  ordersByStatus: { status: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const chartColors = {
  PENDING: "#facc15",
  CONFIRMED: "#60a5fa",
  PROCESSING: "#a78bfa",
  SHIPPED: "#22d3ee",
  DELIVERED: "#4ade80",
  CANCELLED: "#f87171",
};

const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statCards = [
  { label: "Total Products", key: "productCount" as const, icon: Package, color: "text-blue-600" },
  { label: "Total Orders", key: "orderCount" as const, icon: ShoppingCart, color: "text-purple-600" },
  { label: "Total Users", key: "userCount" as const, icon: Users, color: "text-green-600" },
  { label: "Total Reviews", key: "reviewCount" as const, icon: Star, color: "text-yellow-600" },
  { label: "Total Categories", key: "categoryCount" as const, icon: Tags, color: "text-cyan-600" },
  { label: "Revenue", key: "revenue" as const, icon: DollarSign, color: "text-emerald-600", format: (v: number) => formatPrice(v) },
];

function StatCardSkeleton() {
  return (
    <Card className="p-0">
      <CardContent className="flex items-center gap-4 p-6">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load dashboard data"); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="mb-8">
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const value = data[card.key];
          return (
            <Card key={card.key} className="p-0">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-lg bg-gray-100 p-3 ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {card.format ? card.format(value as number) : value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {data.revenueByMonth.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500">No revenue data yet</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(v: number) => [formatPrice(v), "Revenue"]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {data.ordersByStatus.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500">No orders yet</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusOrder.map((s) => ({ status: s, count: data.ordersByStatus.find((o) => o.status === s)?.count ?? 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="status" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {statusOrder.map((s) => (
                        <Cell key={s} fill={chartColors[s as keyof typeof chartColors]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Order</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Total</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">No orders yet</td>
                    </tr>
                  ) : (
                    data.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{order.user.name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{order.user.email}</p>
                        </td>
                        <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
