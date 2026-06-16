"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { Pagination } from "@/components/admin/pagination";
import { SearchBar } from "@/components/admin/search-bar";
import { OrderStatusSelect } from "@/components/admin/status-update";
import { formatPrice } from "@/lib/utils";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statuses = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
}

interface OrderUser {
  name: string | null;
  email: string;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  address: string;
  phone: string;
  email: string;
  note: string | null;
  createdAt: string;
  user: OrderUser | null;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const columns = [
    {
      key: "id",
      header: "Order ID",
      cell: (order: Order) => <span className="font-mono text-xs">#{order.id.slice(0, 8)}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      cell: (order: Order) => (
        <div>
          <p className="font-medium">{order.user?.name || "N/A"}</p>
          <p className="text-xs text-gray-500">{order.email}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      cell: (order: Order) => <span className="text-gray-500">{order.items.length} items</span>,
    },
    {
      key: "total",
      header: "Total",
      cell: (order: Order) => <span className="font-medium">{formatPrice(Number(order.total))}</span>,
    },
    {
      key: "date",
      header: "Date",
      cell: (order: Order) => <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (order: Order) => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>
          {order.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (order: Order) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
            View
          </Link>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} onChanged={fetchOrders} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Orders</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar placeholder="Search by order ID or email..." onSearch={handleSearch} defaultValue={search} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Statuses" : s}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl border bg-red-50 p-4 text-sm text-red-700 mb-4">{error}</div>
      )}

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyMessage="No orders found"
        keyExtractor={(order: Order) => order.id}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
