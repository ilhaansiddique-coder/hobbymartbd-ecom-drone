import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const auth = await checkAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const search = searchParams.get("search") || "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        _count: { select: { products: true } },
        parent: { select: { name: true } },
      },
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.count({ where }),
  ]);

  return NextResponse.json({
    categories,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
  });
}

export async function POST(req: NextRequest) {
  const auth = await checkAdmin();
  if (auth.error) return auth.error;

  const { name, description, image, parentId } = await req.json();
  const slug = slugify(name);

  const category = await prisma.category.create({
    data: { name, slug, description, image, parentId },
  });

  return NextResponse.json({ category });
}
