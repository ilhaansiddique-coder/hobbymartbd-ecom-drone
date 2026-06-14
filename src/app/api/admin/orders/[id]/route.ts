import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/enums";
import { sendEmail, orderStatusEmail } from "@/lib/email";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true, images: true } },
        },
      },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    order: {
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!Object.values(OrderStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  try {
    const fullOrder = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });
    // Prefer the account email; fall back to the order's own email (guest orders).
    const to = fullOrder?.user?.email || fullOrder?.email;
    if (to) {
      const emailData = orderStatusEmail(to, order.id, order.status);
      await sendEmail(emailData);
    }
  } catch (err) {
    console.error("Failed to send status email:", err);
  }

  return NextResponse.json({ order: { ...order, total: Number(order.total) } });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.order.delete({ where: { id } });

  return NextResponse.json({ message: "Order deleted" });
}
