import { NextRequest, NextResponse } from "next/server";

// Serves images stored in Netlify Blobs (uploaded via /api/upload in production).
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("uploads");
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
    if (!result) {
      return new NextResponse("Not found", { status: 404 });
    }
    const contentType = (result.metadata?.contentType as string) || "application/octet-stream";
    return new NextResponse(result.data as ArrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Failed to serve blob:", err);
    return new NextResponse("Not found", { status: 404 });
  }
}
