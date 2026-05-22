import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify, generateSKU } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: {
      categories: { include: { category: { select: { name: true, slug: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = products.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    categories: p.categories.map((c) => c.category),
  }));

  return NextResponse.json({ products: mapped });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price, salePrice, stock, images, specs, featured, published, categoryIds } = body;

  const slug = slugify(name);
  const categorySlug = categoryIds?.length ? await prisma.category.findUnique({ where: { id: categoryIds[0] } }).then(c => c?.slug || "") : "";
  const sku = generateSKU(name, categorySlug);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      sku,
      description,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      stock: stock || 0,
      images: images || [],
      specs: specs || undefined,
      featured: featured || false,
      published: published ?? true,
      categories: categoryIds?.length
        ? { create: categoryIds.map((categoryId: string) => ({ categoryId })) }
        : undefined,
    },
    include: {
      categories: { include: { category: { select: { name: true, slug: true } } } },
    },
  });

  return NextResponse.json({
    product: {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      categories: product.categories.map((c) => c.category),
    },
  });
}
