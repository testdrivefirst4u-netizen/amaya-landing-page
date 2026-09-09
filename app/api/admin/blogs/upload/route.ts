import { NextResponse } from "next/server";
import { uploadToImageKit, isImageKitConfigured } from "@/lib/imagekit";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

function sanitizeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() || "upload";
  return base.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-100);
}

export async function POST(req: Request) {
  if (!isImageKitConfigured()) {
    return NextResponse.json(
      { error: "Image uploads are not configured. Set the IMAGEKIT_* environment variables." },
      { status: 500 }
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported image type. Use JPEG, PNG, WebP, AVIF or GIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `Image is too large — please keep uploads under ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.` },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToImageKit(buffer, sanitizeFileName(file.name || "upload"), "/amaya-blog-uploads");
    return NextResponse.json(
      { url: result.url, fileId: result.fileId, width: result.width, height: result.height },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
