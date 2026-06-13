import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkAdmin();
  if (error) return error;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ post });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkAdmin();
  if (error) return error;

  const { id } = await params;
  const { title, excerpt, content, image, author, published, featured } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let slug = existing.slug;
  if (title !== existing.title) {
    slug = slugify(title);
    const slugExists = await prisma.blogPost.findUnique({ where: { slug } });
    if (slugExists && slugExists.id !== id) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: { title, slug, excerpt, content, image, author, published, featured },
  });

  return NextResponse.json({ post });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkAdmin(["ADMIN"]);
  if (error) return error;

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });

  return NextResponse.json({ message: "Post deleted" });
}
