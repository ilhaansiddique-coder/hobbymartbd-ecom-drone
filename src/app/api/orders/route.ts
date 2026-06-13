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

  const productIds = items.map((i: any) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const total = products.reduce((sum, p) => {
    const item = items.find((i: any) => i.id === p.id);
    const price = p.salePrice ? Number(p.salePrice) : Number(p.price);
    return sum + price * item.quantity;
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
        create: items.map((item: any) => {
          const product = products.find((p) => p.id === item.id)!;
          return {
            productId: item.id,
            quantity: item.quantity,
            price: product.salePrice ? Number(product.salePrice) : Number(product.price),
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
