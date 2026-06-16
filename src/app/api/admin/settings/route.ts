import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/admin-auth";
import { coerceFooterColumns, coerceNavLinks } from "@/lib/site-config";

// Plain scalar fields copied straight through from the request body.
const STRING_FIELDS = [
  "companyName", "logoUrl", "email", "phone", "address",
  "whatsappNumber", "whatsappText", "primaryColor", "fontFamily",
  "footerTagline", "facebookUrl", "instagramUrl", "youtubeUrl",
  "topbarText", "copyrightText",
] as const;

const BOOL_FIELDS = [
  "topbarEnabled", "topbarShowContact", "topbarShowTrackOrder",
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
  const data: Record<string, unknown> = {};

  for (const key of STRING_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  for (const key of BOOL_FIELDS) {
    if (body[key] !== undefined) data[key] = Boolean(body[key]);
  }
  // JSON list fields — sanitise to drop malformed entries before persisting.
  if (body.navLinks !== undefined) data.navLinks = coerceNavLinks(body.navLinks, []);
  if (body.footerColumns !== undefined) data.footerColumns = coerceFooterColumns(body.footerColumns, []);

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  return NextResponse.json({ settings });
}
