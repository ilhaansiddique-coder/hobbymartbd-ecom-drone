import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/admin-auth";
import { slugify, generateSKU } from "@/lib/utils";
import * as z from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  price: z.coerce.number().positive("Price must be positive"),
  salePrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  specs: z.any().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  categoryIds: z.array(z.string()).default([]),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  if (!slug) slug = "product";
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    counter++;
    slug = `${slugify(base) || "product"}-${counter}`;
  }
  return slug;
}

export async function GET(req: NextRequest) {
  const auth = await checkAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const search = searchParams.get("search") || "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { sku: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        categories: { include: { category: { select: { name: true, slug: true, id: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const mapped = products.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    categories: p.categories.map((c) => c.category),
  }));

  return NextResponse.json({
    products: mapped,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await checkAdmin();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
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

  let slug: string;
  if (customSlug) {
    slug = slugify(customSlug);
    if (!slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  } else {
    slug = await generateUniqueSlug(name);
  }

  const categorySlug = categoryIds.length
    ? await prisma.category.findUnique({ where: { id: categoryIds[0] } }).then((c) => c?.slug || "")
    : "";
  const sku = categorySlug ? generateSKU(name, categorySlug) : generateSKU(name, "GEN");

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      sku,
      description: description || null,
      price,
      salePrice: salePrice || null,
      stock,
      images,
      specs: specs || undefined,
      featured,
      published,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      categories: categoryIds.length
        ? { create: categoryIds.map((categoryId: string) => ({ categoryId })) }
        : undefined,
    },
    include: {
      categories: { include: { category: { select: { name: true, slug: true } } } },
    },
  });

  const p = product as unknown as { categories: { category: { name: string; slug: string } }[] };

  return NextResponse.json({
    product: {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      categories: p.categories.map((c) => c.category),
    },
  });
}
