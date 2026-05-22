import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    productCount,
    orderCount,
    userCount,
    reviewCount,
    categoryCount,
    revenueResult,
    recentOrders,
    ordersByStatus,
    revenueOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.category.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "DELIVERED" },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.order.findMany({
      where: {
        status: "DELIVERED",
        createdAt: { gte: sixMonthsAgo },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const revenueByMonth: { month: string; revenue: number }[] = [];
  const monthMap = new Map<string, number>();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(key, 0);
  }

  for (const order of revenueOrders) {
    const d = order.createdAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthMap.has(key)) {
      monthMap.set(key, monthMap.get(key)! + Number(order.total));
    }
  }

  for (const [month, revenue] of monthMap) {
    revenueByMonth.push({ month, revenue });
  }

  return NextResponse.json({
    productCount,
    orderCount,
    userCount,
    reviewCount,
    categoryCount,
    revenue: revenueResult._sum.total ? Number(revenueResult._sum.total) : 0,
    recentOrders: recentOrders.map((o) => ({
      ...o,
      total: Number(o.total),
    })),
    ordersByStatus: ordersByStatus.map((o) => ({
      status: o.status,
      count: o._count.status,
    })),
    revenueByMonth,
  });
}
