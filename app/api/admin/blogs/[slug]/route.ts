import { NextResponse } from "next/server";
import {
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
  parseFormInput,
} from "@/lib/blogStore";
import { pingIndexNow } from "@/lib/indexNow";

const SITE_URL = "https://www.amayaseniorliving.com";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const raw = await req.json().catch(() => null);
  if (!raw) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const input = parseFormInput(raw);
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  try {
    const post = await updateBlogPost(slug, input);
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    await pingIndexNow([`${SITE_URL}/blogs/${post.slug}`]);
    return NextResponse.json({ post });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const deleted = await deleteBlogPost(slug);
    if (!deleted) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
