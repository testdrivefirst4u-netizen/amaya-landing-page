"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEdit2, FiTrash2, FiStar, FiSearch } from "react-icons/fi";
import type { MediaItem, MediaStatus } from "@/lib/mediaData";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

type StatusFilter = "all" | MediaStatus;
type SortOrder = "newest" | "oldest";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
];

export default function MediaAdminTable({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(items.map((a) => a.category))).sort(),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((a) => {
      const matchesSearch =
        !q || a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
    list = [...list].sort((a, b) => {
      const diff = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });
    return list;
  }, [items, search, statusFilter, categoryFilter, sortOrder]);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setBusy(slug);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media/${slug}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete item.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item.");
    } finally {
      setBusy(null);
    }
  };

  const handleToggleStatus = async (item: MediaItem) => {
    const nextStatus: MediaStatus = item.status === "published" ? "draft" : "published";
    setBusy(item.slug);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media/${item.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusOnly: true, status: nextStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-score-filters">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`admin-score-filter ${statusFilter === f.value ? "is-active" : ""}`}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="admin-filters">
        <label className="admin-filter-field admin-filter-search">
          <span>Search</span>
          <div className="admin-search-input">
            <FiSearch size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title or slug"
            />
          </div>
        </label>
        <label className="admin-filter-field">
          <span>Category</span>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-filter-field">
          <span>Sort</span>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-table-wrap">
          <p className="admin-empty">
            {items.length === 0 ? "No media items yet." : "No items match these filters."}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.slug}>
                  <td className="admin-col-sno">{i + 1}</td>
                  <td>
                    <div className="admin-title-cell">
                      {item.featured && (
                        <FiStar size={13} className="admin-featured-star" title="Featured" />
                      )}
                      {item.title}
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`admin-status-pill admin-status-pill--${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === "scheduled" && item.scheduledDate
                      ? formatDate(item.scheduledDate)
                      : formatDate(item.publishedDate)}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-link-btn"
                        onClick={() => handleToggleStatus(item)}
                        disabled={busy === item.slug || item.status === "scheduled"}
                      >
                        {item.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <Link
                        href={`/media/${item.slug}`}
                        target="_blank"
                        className="admin-icon-btn"
                        aria-label="View"
                        title="View"
                      >
                        <FiEye size={15} />
                      </Link>
                      <Link
                        href={`/admin/media/${item.slug}/edit`}
                        className="admin-icon-btn"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        onClick={() => handleDelete(item.slug, item.title)}
                        disabled={busy === item.slug}
                        aria-label="Delete"
                        title="Delete"
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
        Showing {filtered.length} of {items.length} item{items.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
