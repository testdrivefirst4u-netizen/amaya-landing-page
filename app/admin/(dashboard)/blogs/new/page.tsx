import type { Metadata } from "next";
import BlogPostForm from "@/components/admin/BlogPostForm";

export const metadata: Metadata = {
  title: "New Post · Amaya Admin",
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
  return (
    <div>
      <div className="admin-topbar">
        <h1>New Post</h1>
        <p>Publish a new article to /blogs.</p>
      </div>
      <BlogPostForm />
    </div>
  );
}
