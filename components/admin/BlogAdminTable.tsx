"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { BlogPost } from "@/lib/blogData";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BlogAdminTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeleting(slug);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blogs/${slug}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete post.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {error && <p className="admin-error">{error}</p>}
      {posts.length === 0 ? (
        <div className="admin-table-wrap">
          <p className="admin-empty">No blog posts yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Category</th>
                <th>Published</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.slug}>
                  <td className="admin-col-sno">{i + 1}</td>
                  <td>{post.title}</td>
                  <td>{post.category}</td>
                  <td>{formatDate(post.publishedDate)}</td>
                  <td className="admin-col-slug" title={post.slug}>
                    {post.slug}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link
                        href={`/blogs/${post.slug}`}
                        target="_blank"
                        className="admin-icon-btn"
                        aria-label="View post"
                        title="View post"
                      >
                        <FiEye size={15} />
                      </Link>
                      <Link
                        href={`/admin/blogs/${post.slug}/edit`}
                        className="admin-icon-btn"
                        aria-label="Edit post"
                        title="Edit post"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        onClick={() => handleDelete(post.slug, post.title)}
                        disabled={deleting === post.slug}
                        aria-label="Delete post"
                        title="Delete post"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="admin-count">
        {posts.length} post{posts.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
