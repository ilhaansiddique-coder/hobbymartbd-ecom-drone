import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Image upload with a storage backend chosen by environment (first match wins):
//   1. Cloudinary    — if CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET set (recommended for prod)
//   2. Vercel Blob   — if BLOB_READ_WRITE_TOKEN set
//   3. Netlify Blobs — when running on Netlify, served via /api/uploads/<key>
//   4. Local disk    — dev fallback (public/uploads, served at /uploads/<key>)
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

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const useCloudinary = !!(cloudName && uploadPreset);
  const useVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
  const results: { url: string; name: string }[] = [];

  try {
    if (useCloudinary) {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", uploadPreset!);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");
        results.push({ url: data.secure_url, name: file.name });
      }
    } else if (useVercelBlob) {
      const { put } = await import("@vercel/blob");
      for (const file of files) {
        const blob = await put(`uploads/${crypto.randomUUID()}.${extOf(file.name)}`, file, {
          access: "public",
          contentType: file.type,
        });
        results.push({ url: blob.url, name: file.name });
      }
    } else if (process.env.NODE_ENV === "production") {
      // Serverless hosts have a read-only filesystem — require a cloud backend.
      throw new Error(
        "Image storage is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in your hosting environment variables, then redeploy."
      );
    } else {
      // Local dev only: write to public/uploads, served at /uploads/<key>.
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      for (const file of files) {
        const key = `${crypto.randomUUID()}.${extOf(file.name)}`;
        await writeFile(path.join(uploadDir, key), Buffer.from(await file.arrayBuffer()));
        results.push({ url: `/uploads/${key}`, name: file.name });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed on the server";
    console.error("Upload failed:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ files: results });
}

function extOf(name: string): string {
  return (name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
}
