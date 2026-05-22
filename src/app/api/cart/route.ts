import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const CART_PREFIX = "cart:";

async function getCart(sessionId: string) {
  if (!redis) return [];
  return (await redis.get(`${CART_PREFIX}${sessionId}`)) as any[] || [];
}

async function setCart(sessionId: string, items: any[]) {
  if (redis) await redis.set(`${CART_PREFIX}${sessionId}`, items);
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ items: [] });
  const items = await getCart(sessionId);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, name, price, salePrice, image, slug, stock, quantity, sessionId } = body;
  if (!sessionId || !id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const items = await getCart(sessionId);
  const existing = items.find((i: any) => i.id === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ id, name, price, salePrice, image, slug, stock, quantity });
  }

  await setCart(sessionId, items);
  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, quantity, sessionId } = body;
  if (!sessionId || !id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const items = await getCart(sessionId);
  const item = items.find((i: any) => i.id === id);
  if (item) item.quantity = quantity;

  await setCart(sessionId, items);
  return NextResponse.json({ items });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id, all, sessionId } = body;
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  if (all) {
    if (redis) await redis.del(`${CART_PREFIX}${sessionId}`);
    return NextResponse.json({ items: [] });
  }

  const items = await getCart(sessionId);
  const filtered = items.filter((i: any) => i.id !== id);
  await setCart(sessionId, filtered);
  return NextResponse.json({ items: filtered });
}
