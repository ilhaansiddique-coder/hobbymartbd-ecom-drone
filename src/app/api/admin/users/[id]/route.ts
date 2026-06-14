import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import bcrypt from "bcryptjs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkAdmin(["ADMIN", "STAFF"]);
  if (error) return error;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      phone: true,
      address: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionResult = await checkAdmin(["ADMIN", "STAFF"]);
  if (sessionResult.error) return sessionResult.error;

  const session = sessionResult.session!;
  const currentRole = (session.user as any).role;

  const { id } = await params;
  const body = await req.json();

  const data: any = {};

  if (body.role !== undefined) {
    if (!Object.values(Role).includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    // Only ADMIN can set role to ADMIN (privilege escalation guard)
    if (body.role === "ADMIN" && currentRole !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can assign the ADMIN role" }, { status: 403 });
    }
    data.role = body.role;
  }

  if (body.name !== undefined) data.name = body.name;
  if (body.phone !== undefined) data.phone = body.phone;
  if (body.address !== undefined) data.address = body.address;

  // Admin password reset
  if (body.password) {
    if (typeof body.password !== "string" || body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    data.password = await bcrypt.hash(body.password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      phone: true,
      address: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ user });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkAdmin(["ADMIN"]);
  if (error) return error;

  const { id } = await params;

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "User deleted" });
}
