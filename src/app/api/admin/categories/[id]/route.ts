import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } },
      parent: { select: { name: true } },
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ category });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const { name, slug, description, image, parentId } = await req.json();

  const data: any = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = slugify(name);
  }
  if (slug !== undefined) data.slug = slug;
  if (description !== undefined) data.description = description;
  if (image !== undefined) data.image = image;
  if (parentId !== undefined) data.parentId = parentId;

  const category = await prisma.category.update({
    where: { id },
    data,
  });

  return NextResponse.json({ category });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin(["ADMIN"]);
  if (auth.error) return auth.error;

  const { id } = await params;

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ message: "Category deleted" });
}
