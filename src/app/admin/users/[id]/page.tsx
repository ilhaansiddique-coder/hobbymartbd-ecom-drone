import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { UserRoleSelect } from "@/components/admin/role-update";
import { DeleteButton } from "@/components/admin/delete-button";
import { UserPasswordReset } from "@/components/admin/user-password-reset";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  STAFF: "bg-blue-100 text-blue-700",
  USER: "bg-gray-100 text-gray-600",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { orders: true, reviews: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          items: true,
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          product: { select: { name: true } },
        },
      },
    },
  });

  if (!user) notFound();

  const totalSpent = user.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div>
      <Link
        href="/admin/users"
        className="mb-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        &larr; Back to Users
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.name || "Unnamed User"}
        </h1>
        <div className="flex items-center gap-2">
          <UserRoleSelect userId={user.id} currentRole={user.role} />
          <DeleteButton url={`/api/admin/users/${user.id}`} label="Delete" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="rounded-2xl border bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            User Information
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900">{user.name || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-900">{user.phone || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Role</dt>
              <dd>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleColors[user.role] || ""}`}>
                  {user.role}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Joined</dt>
              <dd className="text-gray-900">{user.createdAt.toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Total Spent</dt>
              <dd className="text-gray-900 font-medium">{formatPrice(totalSpent)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Stats</h2>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Orders</dt>
              <dd className="font-medium text-gray-900">{user._count.orders}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Reviews</dt>
              <dd className="font-medium text-gray-900">{user._count.reviews}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mb-6 max-w-xl">
        <UserPasswordReset userId={user.id} />
      </div>

      {user.address && (
        <div className="rounded-2xl border bg-white p-6 mb-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Address</h2>
          <p className="whitespace-pre-line text-sm text-gray-900">{user.address}</p>
        </div>
      )}

      <div className="rounded-2xl border bg-white mb-6">
        <div className="p-6 pb-0">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Orders
          </h2>
        </div>
        {user.orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Items</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {user.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-gray-500">{order.items.length}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(Number(order.total))}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-gray-500">No orders yet</div>
        )}
      </div>

      <div className="rounded-2xl border bg-white">
        <div className="p-6 pb-0">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Reviews
          </h2>
        </div>
        {user.reviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Rating</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Comment</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {user.reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{review.product.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{review.comment || "—"}</td>
                    <td className="px-6 py-4 text-gray-500">{review.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-gray-500">No reviews yet</div>
        )}
      </div>
    </div>
  );
}
