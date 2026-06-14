import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Image upload with a storage backend chosen by environment:
//   1. Vercel Blob   — if BLOB_READ_WRITE_TOKEN is set (works anywhere)
//   2. Netlify Blobs — when running on Netlify (process.env.NETLIFY), served via /api/uploads/<key>
//   3. Local disk    — dev fallback (public/uploads, served at /uploads/<key>)
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

  const useVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
  const onNetlify = !!process.env.NETLIFY;
  const results: { url: string; name: string }[] = [];

  try {
    if (useVercelBlob) {
      const { put } = await import("@vercel/blob");
      for (const file of files) {
        const ext = extOf(file.name);
        const blob = await put(`uploads/${crypto.randomUUID()}.${ext}`, file, {
          access: "public",
          contentType: file.type,
        });
        results.push({ url: blob.url, name: file.name });
      }
    } else if (onNetlify) {
      const { getStore } = await import("@netlify/blobs");
      const store = getStore("uploads");
      for (const file of files) {
        const key = `${crypto.randomUUID()}.${extOf(file.name)}`;
        await store.set(key, await file.arrayBuffer(), {
          metadata: { contentType: file.type },
        });
        results.push({ url: `/api/uploads/${key}`, name: file.name });
      }
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      for (const file of files) {
        const key = `${crypto.randomUUID()}.${extOf(file.name)}`;
        await writeFile(path.join(uploadDir, key), Buffer.from(await file.arrayBuffer()));
        results.push({ url: `/uploads/${key}`, name: file.name });
      }
    }
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed on the server" }, { status: 500 });
  }

  return NextResponse.json({ files: results });
}

function extOf(name: string): string {
  return (name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
}
