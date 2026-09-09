import { NextResponse } from "next/server";
import {
  getMediaBySlugAdmin,
  updateMediaItem,
  deleteMediaItem,
  setMediaStatus,
  parseMediaFormInput,
} from "@/lib/mediaStore";
import { pingIndexNow } from "@/lib/indexNow";

const SITE_URL = "https://www.amayaseniorliving.com";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = await getMediaBySlugAdmin(slug);
  if (!item) return NextResponse.json({ error: "Item not found." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const raw = await req.json().catch(() => null);
  if (!raw) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  // A bare status-only patch (used by the quick Publish/Unpublish toggle).
  if (raw.statusOnly && typeof raw.status === "string") {
    if (!["draft", "published", "scheduled"].includes(raw.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    try {
      const item = await setMediaStatus(slug, raw.status);
      if (!item) return NextResponse.json({ error: "Item not found." }, { status: 404 });
      if (item.status === "published") {
        await pingIndexNow([`${SITE_URL}/media/${item.slug}`]);
      }
      return NextResponse.json({ item });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  const input = parseMediaFormInput(raw);
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  try {
    const item = await updateMediaItem(slug, input);
    if (!item) return NextResponse.json({ error: "Item not found." }, { status: 404 });
    if (item.status === "published") {
      await pingIndexNow([`${SITE_URL}/media/${item.slug}`]);
    }
    return NextResponse.json({ item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update item.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const deleted = await deleteMediaItem(slug);
    if (!deleted) return NextResponse.json({ error: "Item not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete item.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
