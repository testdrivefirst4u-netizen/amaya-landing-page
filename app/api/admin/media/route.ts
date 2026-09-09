import { NextResponse } from "next/server";
import { listAllMedia, createMediaItem, parseMediaFormInput } from "@/lib/mediaStore";
import { pingIndexNow } from "@/lib/indexNow";

const SITE_URL = "https://www.amayaseniorliving.com";

export async function GET() {
  const items = await listAllMedia();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  if (!raw) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const input = parseMediaFormInput(raw);
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  try {
    const item = await createMediaItem(input);
    if (item.status === "published") {
      await pingIndexNow([`${SITE_URL}/media/${item.slug}`]);
    }
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create item.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
