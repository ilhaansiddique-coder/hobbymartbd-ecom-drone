import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";
import * as z from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  salePrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  specs: z.any().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin();
  if (auth.error) return auth.error;

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
  const auth = await checkAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const {
    name, slug: customSlug, description, price, salePrice, stock, images, specs,
    featured, published, categoryIds, metaTitle, metaDescription,
  } = parsed.data;

  const data: Record<string, unknown> = {};

  if (name !== undefined) data.name = name;

  if (customSlug !== undefined) {
    const slug = slugify(customSlug);
    const existing = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    data.slug = slug;
  }

  if (description !== undefined) data.description = description || null;
  if (price !== undefined) data.price = price;
  if (salePrice !== undefined) data.salePrice = salePrice || null;
  if (stock !== undefined) data.stock = stock;
  if (images !== undefined) data.images = images;
  if (specs !== undefined) data.specs = specs;
  if (featured !== undefined) data.featured = featured;
  if (published !== undefined) data.published = published;
  if (metaTitle !== undefined) data.metaTitle = metaTitle || null;
  if (metaDescription !== undefined) data.metaDescription = metaDescription || null;

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
  const auth = await checkAdmin(["ADMIN"]);
  if (auth.error) return auth.error;

  const { id } = await params;

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Product deleted" });
}
