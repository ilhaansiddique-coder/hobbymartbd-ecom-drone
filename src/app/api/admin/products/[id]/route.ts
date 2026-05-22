import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify, generateSKU } from "@/lib/utils";

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

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
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
  const body = await req.json();
  const { name, description, price, salePrice, stock, images, specs, featured, published, categoryIds } = body;

  const data: any = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = slugify(name);
  }
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = parseFloat(price);
  if (salePrice !== undefined) data.salePrice = salePrice ? parseFloat(salePrice) : null;
  if (stock !== undefined) data.stock = stock;
  if (images !== undefined) data.images = images;
  if (specs !== undefined) data.specs = specs;
  if (featured !== undefined) data.featured = featured;
  if (published !== undefined) data.published = published;

  if (categoryIds !== undefined) {
    await prisma.productCategory.deleteMany({ where: { productId: id } });
    if (categoryIds.length > 0) {
      await prisma.productCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({ productId: id, categoryId })),
      });
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data,
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

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Product deleted" });
}
