import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/status-update";
import { PrintButton } from "@/components/admin/print-button";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Orders
        </Link>
        <PrintButton />
      </div>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Order #{order.id.slice(0, 8)}
      </h1>

      <div className="space-y-6">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Order Information
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Order ID</dt>
              <dd className="font-mono text-gray-900">{order.id}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Date</dt>
              <dd className="text-gray-900">
                {order.createdAt.toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}
                >
                  {order.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Update Status</dt>
              <dd>
                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Customer Information
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900">{order.user?.name || "Guest"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900">{order.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-900">{order.phone}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Shipping Address
          </h2>
          <p className="whitespace-pre-line text-sm text-gray-900">
            {order.address}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Payment Information
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Method</dt>
              <dd className="text-gray-900">
                {order.paymentMethod || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="text-gray-900">
                {order.paymentStatus || "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border bg-white">
          <div className="p-6 pb-0">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatPrice(Number(item.price))}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t bg-gray-50">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-right font-semibold text-gray-900"
                  >
                    Total
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatPrice(Number(order.total))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {order.note && (
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Note</h2>
            <p className="whitespace-pre-line text-sm text-gray-700">
              {order.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
