import type { Metadata } from "next";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { listBlogPosts } from "@/lib/blogStore";
import BlogAdminTable from "@/components/admin/BlogAdminTable";
import AdminBanner from "@/components/admin/AdminBanner";

export const metadata: Metadata = {
  title: "Blogs · Amaya Admin",
  robots: { index: false, follow: false },
};

// Auth-gated and always reads live data — never statically prerender.
export const dynamic = "force-dynamic";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const posts = await listBlogPosts();
  const { saved } = await searchParams;

  return (
    <div>
      {saved === "created" && <AdminBanner message="Post published successfully." />}
      {saved === "updated" && <AdminBanner message="Post updated successfully." />}

      <div className="admin-topbar admin-topbar--with-action">
        <div>
          <h1>Blogs</h1>
          <p>Manage the articles shown on /blogs.</p>
        </div>
        <Link href="/admin/blogs/new" className="admin-submit admin-topbar-cta">
          <FiPlus size={15} /> New Post
        </Link>
      </div>
      <BlogAdminTable posts={posts} />
    </div>
  );
}
