import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const COMPARE_PREFIX = "compare:";

function getSessionId(req: NextRequest) {
  return req.cookies.get("compare_session")?.value || "default";
}

async function getCompareIds(sessionId: string): Promise<string[]> {
  if (!redis) return [];
  return (await redis.get(`${COMPARE_PREFIX}${sessionId}`)) || [];
}

async function saveCompareIds(sessionId: string, ids: string[]) {
  if (redis) await redis.set(`${COMPARE_PREFIX}${sessionId}`, ids);
}

export async function GET(req: NextRequest) {
  const sessionId = getSessionId(req);
  const ids = await getCompareIds(sessionId);
  if (ids.length === 0) return NextResponse.json({ items: [] });

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, slug: true, price: true, salePrice: true, images: true, specs: true },
  });

  return NextResponse.json({ items: products });
}

export async function POST(req: NextRequest) {
  const sessionId = getSessionId(req);
  const { productId } = await req.json();
  const ids = await getCompareIds(sessionId);

  if (!ids.includes(productId) && ids.length < 4) {
    ids.push(productId);
    await saveCompareIds(sessionId, ids);
  }

  return NextResponse.json({ items: ids });
}

export async function DELETE(req: NextRequest) {
  const sessionId = getSessionId(req);
  const { productId } = await req.json();
  const ids = await getCompareIds(sessionId);
  const filtered = ids.filter((id: string) => id !== productId);
  await saveCompareIds(sessionId, filtered);
  return NextResponse.json({ items: filtered });
}
