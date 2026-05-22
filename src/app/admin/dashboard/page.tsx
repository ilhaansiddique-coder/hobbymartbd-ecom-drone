import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, reviewCount, categoryCount, revenueResult, recentOrders, ordersByStatus] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.review.count(),
      prisma.category.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      prisma.order.groupBy({ by: ["status"], _count: true }),
    ]);

  const revenue = revenueResult._sum.total ?? 0;

  const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Products", value: productCount },
          { label: "Total Orders", value: orderCount },
          { label: "Total Users", value: userCount },
          { label: "Total Reviews", value: reviewCount },
          { label: "Total Categories", value: categoryCount },
          { label: "Revenue", value: formatPrice(Number(revenue)) },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white">
          <div className="border-b p-4">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          </div>
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">No orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.user.name || "N/A"}</p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                      </td>
                      <td className="px-4 py-3 font-medium">{formatPrice(Number(order.total))}</td>
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
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <h2 className="mb-4 font-semibold text-gray-900">Orders by Status</h2>
          <div className="space-y-3">
            {statusOrder.map((status) => {
              const count = ordersByStatus.find((o) => o.status === status)?._count ?? 0;
              const maxCount = Math.max(...ordersByStatus.map((o) => o._count), 1);
              const pct = (count / maxCount) * 100;
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${
                        status === "PENDING"
                          ? "bg-yellow-400"
                          : status === "CONFIRMED"
                            ? "bg-blue-400"
                            : status === "PROCESSING"
                              ? "bg-purple-400"
                              : status === "SHIPPED"
                                ? "bg-cyan-400"
                                : status === "DELIVERED"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
