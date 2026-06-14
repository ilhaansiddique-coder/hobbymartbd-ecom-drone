import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Image upload. In production (serverless) it stores to Vercel Blob; in local
// dev (no BLOB_READ_WRITE_TOKEN) it falls back to /public/uploads on disk.
export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || (role !== "ADMIN" && role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `File too large (max 4MB): ${file.name}` }, { status: 400 });
    }
  }

  const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
  const results: { url: string; name: string }[] = [];

  if (useBlob) {
    // Production: store on Vercel Blob (persistent, CDN-served).
    const { put } = await import("@vercel/blob");
    for (const file of files) {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const blob = await put(`uploads/${crypto.randomUUID()}.${ext}`, file, {
        access: "public",
        contentType: file.type,
      });
      results.push({ url: blob.url, name: file.name });
    }
  } else {
    // Local dev: write to /public/uploads, served at /uploads/<name>.
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const filename = `${crypto.randomUUID()}.${ext}`;
      const bytes = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), bytes);
      results.push({ url: `/uploads/${filename}`, name: file.name });
    }
  }

  return NextResponse.json({ files: results });
}
