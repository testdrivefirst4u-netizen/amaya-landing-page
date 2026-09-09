import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blogStore";
import BlogPostForm from "@/components/admin/BlogPostForm";

export const metadata: Metadata = {
  title: "Edit Post · Amaya Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <div className="admin-topbar">
        <h1>Edit Post</h1>
        <p>{post.title}</p>
      </div>
      <BlogPostForm post={post} />
    </div>
  );
}
