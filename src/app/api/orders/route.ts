import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: { select: { name: true, slug: true, images: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, address, phone, email, note } = await req.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }
  if (!address || !phone) {
    return NextResponse.json({ error: "Address and phone are required" }, { status: 400 });
  }

  const productIds = items.map((i: any) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  // Keep only items whose product still exists (a cart can hold a since-deleted product).
  const validItems = items.filter((i: any) => productById.has(i.id) && Number(i.quantity) > 0);
  if (validItems.length === 0) {
    return NextResponse.json(
      { error: "None of the items in your cart are available anymore" },
      { status: 400 }
    );
  }

  const priceOf = (p: { salePrice: unknown; price: unknown }) =>
    p.salePrice ? Number(p.salePrice) : Number(p.price);

  const total = validItems.reduce((sum: number, item: any) => {
    const product = productById.get(item.id)!;
    return sum + priceOf(product) * Number(item.quantity);
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      address,
      phone,
      email,
      note,
      items: {
        create: validItems.map((item: any) => {
          const product = productById.get(item.id)!;
          return {
            productId: item.id,
            quantity: Number(item.quantity),
            price: priceOf(product),
          };
        }),
      },
    },
    include: { items: true },
  });

  try {
    const emailData = orderConfirmationEmail(
      email || session.user.email || "",
      order.id,
      order.items.map((item: any) => ({
        name: products.find((p) => p.id === item.productId)?.name || "Product",
        quantity: item.quantity,
        price: Number(products.find((p) => p.id === item.productId)?.salePrice || products.find((p) => p.id === item.productId)?.price || 0),
      })),
      Number(total),
    );
    await sendEmail(emailData);
  } catch (err) {
    console.error("Failed to send email:", err);
  }

  return NextResponse.json({ order });
}
