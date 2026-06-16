import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/admin-auth";

const FIELDS = [
  "companyName", "logoUrl", "email", "phone", "address",
  "whatsappNumber", "whatsappText", "primaryColor", "fontFamily",
  "footerTagline", "facebookUrl", "instagramUrl", "youtubeUrl",
] as const;

export async function GET() {
  const { error } = await checkAdmin();
  if (error) return error;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const { error } = await checkAdmin();
  if (error) return error;

  const body = await req.json();
  const data: Record<string, string | null> = {};
  for (const key of FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  return NextResponse.json({ settings });
}
