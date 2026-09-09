import { NextResponse } from "next/server";
import { getBlogAsset } from "@/lib/blogAssets";

// Public route — blog article images must load for every visitor, not just admins.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const asset = await getBlogAsset(id);
  if (!asset) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return new NextResponse(new Uint8Array(asset.buffer), {
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
