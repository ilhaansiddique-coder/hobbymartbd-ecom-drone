import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function currentUserId(session: unknown): string | undefined {
  return (session as { user?: { id?: string } } | null)?.user?.id;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const id = currentUserId(session);
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, phone: true, address: true, role: true },
  });
  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const id = currentUserId(session);
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, string> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.phone !== undefined) data.phone = body.phone;
  if (body.address !== undefined) data.address = body.address;

  // Change own password — verify the current password first.
  if (body.newPassword) {
    if (typeof body.newPassword !== "string" || body.newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }
    const dbUser = await prisma.user.findUnique({ where: { id } });
    if (dbUser?.password) {
      const ok = await bcrypt.compare(body.currentPassword || "", dbUser.password);
      if (!ok) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }
    data.password = await bcrypt.hash(body.newPassword, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, phone: true, address: true, role: true },
  });
  return NextResponse.json({ user });
}
