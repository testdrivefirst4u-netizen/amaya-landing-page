"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/blogData";
import RichTextEditor from "./RichTextEditor";
import FeaturedImageField from "./FeaturedImageField";
import GooglePreview from "./GooglePreview";
import SocialPreview from "./SocialPreview";
import LengthCounter from "./LengthCounter";
import InfoTip from "./InfoTip";
import { SITE_URL, titleStatus, descriptionStatus, TITLE_RANGE, DESCRIPTION_RANGE } from "./seoUtils";
import { stripHtml } from "@/lib/richText";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormState = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  publishedDate: string;
  tags: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  socialTitle: string;
  socialDescription: string;
};

function initState(post?: BlogPost): FormState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    category: post?.category ?? "",
    excerpt: post?.excerpt ?? "",
    featuredImage: post?.featuredImage ?? "",
    featuredImageAlt: post?.featuredImageAlt ?? "",
    author: post?.author ?? "Team Amaya",
    publishedDate: post?.publishedDate ?? new Date().toISOString().slice(0, 10),
    tags: post?.tags.join(", ") ?? "",
    content: post?.content ?? "",
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
    focusKeyword: post?.focusKeyword ?? "",
    canonicalUrl: post?.canonicalUrl ?? "",
    noIndex: post?.noIndex ?? false,
    noFollow: post?.noFollow ?? false,
    socialTitle: post?.socialTitle ?? "",
    socialDescription: post?.socialDescription ?? "",
  };
}

export default function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [form, setForm] = useState<FormState>(() => initState(post));
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  const handleTitleChange = (value: string) => {
    update("title", value);
    if (!slugTouched) update("slug", slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripHtml(form.excerpt)) {
      setError("Excerpt is required.");
      return;
    }

    setSubmitting(true);

    const payload = { ...form, slug: slugify(form.slug) };

    try {
      const res = await fetch(isEdit ? `/api/admin/blogs/${post!.slug}` : "/api/admin/blogs", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save post.");
      setDirty(false);
      router.push(`/admin/blogs?saved=${isEdit ? "updated" : "created"}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post.");
      setSubmitting(false);
    }
  };

  const seoTitleValue = form.seoTitle || form.title;
  const seoDescValue = form.seoDescription || stripHtml(form.excerpt);
  const socialTitleValue = form.socialTitle || seoTitleValue;
  const socialDescValue = form.socialDescription || seoDescValue;
  const canonicalDisplay = form.canonicalUrl || `${SITE_URL}/blogs/${form.slug || "your-post"}`;

  return (
    <form className="admin-form-shell" onSubmit={handleSubmit}>
      {error && <p className="admin-error admin-error--banner">{error}</p>}

      <div className="admin-form-card">
          <h2 className="admin-card-title">Basic Information</h2>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Title</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </label>

            <label className="admin-field">
              <span>Slug</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", e.target.value);
                }}
                required
              />
            </label>

            <label className="admin-field">
              <span>Category</span>
              <input
                type="text"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Lifestyle, Healthcare, Location"
                required
              />
            </label>

            <label className="admin-field">
              <span>Published Date</span>
              <input
                type="date"
                value={form.publishedDate}
                onChange={(e) => update("publishedDate", e.target.value)}
                required
              />
            </label>

            <label className="admin-field">
              <span>Author</span>
              <input type="text" value={form.author} onChange={(e) => update("author", e.target.value)} />
            </label>

            <label className="admin-field">
              <span>Tags (comma-separated)</span>
              <input type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
            </label>
          </div>

          <label className="admin-field">
            <span>Featured Image</span>
            <FeaturedImageField
              value={form.featuredImage}
              onChange={(url) => update("featuredImage", url)}
            />
          </label>

          <label className="admin-field">
            <span>Featured Image Alt Text</span>
            <input
              type="text"
              value={form.featuredImageAlt}
              onChange={(e) => update("featuredImageAlt", e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>Excerpt</span>
            <RichTextEditor
              variant="compact"
              content={form.excerpt}
              onChange={(html) => update("excerpt", html)}
              placeholder="Write a short excerpt…"
            />
          </label>

          <label className="admin-field">
            <span>Article Body</span>
            <RichTextEditor content={form.content} onChange={(html) => update("content", html)} />
          </label>
      </div>

      <div className="seo-layout">
          <div className="admin-form-card seo-settings-card">
            <h2 className="admin-card-title">SEO Settings</h2>

            <label className="admin-field">
              <span>
                SEO Title
                <InfoTip text="Shown as the clickable headline in Google search results. Keep it under 60 characters so it doesn't get cut off." />
              </span>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => update("seoTitle", e.target.value)}
                placeholder={form.title || "Defaults to Title"}
              />
              <LengthCounter
                length={seoTitleValue.length}
                max={60}
                status={titleStatus(form.seoTitle.length)}
                range={TITLE_RANGE}
              />
            </label>

            <label className="admin-field">
              <span>
                Meta Description
                <InfoTip text="The summary shown under the title in search results. Aim for 110–160 characters." />
              </span>
              <textarea
                value={form.seoDescription}
                onChange={(e) => update("seoDescription", e.target.value)}
                rows={3}
                placeholder={stripHtml(form.excerpt) || "Defaults to Excerpt"}
              />
              <LengthCounter
                length={seoDescValue.length}
                max={160}
                status={descriptionStatus(form.seoDescription.length)}
                range={DESCRIPTION_RANGE}
              />
            </label>

            <label className="admin-field">
              <span>
                Focus Keyword
                <InfoTip text="The main phrase you want this article to rank for. Used to guide your writing — not sent to search engines directly." />
              </span>
              <input
                type="text"
                value={form.focusKeyword}
                onChange={(e) => update("focusKeyword", e.target.value)}
                placeholder="e.g. independent senior living Hyderabad"
              />
            </label>

            <label className="admin-field">
              <span>
                Canonical URL
                <InfoTip text="Set this only if this content also exists at another URL, to tell search engines which version is the original." />
              </span>
              <input
                type="text"
                value={form.canonicalUrl}
                onChange={(e) => update("canonicalUrl", e.target.value)}
                placeholder={`${SITE_URL}/blogs/${form.slug || "your-post"}`}
              />
            </label>

            <div className="admin-field admin-field--row">
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={!form.noIndex}
                  onChange={(e) => update("noIndex", !e.target.checked)}
                />
                <span>Index</span>
                <InfoTip text="On: search engines may show this page. Off (No-index): ask search engines to leave it out of results." />
              </label>
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={!form.noFollow}
                  onChange={(e) => update("noFollow", !e.target.checked)}
                />
                <span>Follow</span>
                <InfoTip text="On: search engines may follow links on this page. Off (No-follow): ask them not to pass ranking value through its links." />
              </label>
            </div>

            <h2 className="admin-card-title admin-card-title--spaced">Social Overrides</h2>
            <p className="admin-field-help">
              Leave blank to reuse the SEO title and description above when sharing on social media.
            </p>

            <label className="admin-field">
              <span>Social Title</span>
              <input
                type="text"
                value={form.socialTitle}
                onChange={(e) => update("socialTitle", e.target.value)}
                placeholder={seoTitleValue || "Defaults to SEO Title"}
              />
            </label>

            <label className="admin-field">
              <span>Social Description</span>
              <textarea
                value={form.socialDescription}
                onChange={(e) => update("socialDescription", e.target.value)}
                rows={2}
                placeholder={seoDescValue || "Defaults to Meta Description"}
              />
            </label>
          </div>

          <div className="seo-preview-col">
            <div className="admin-form-card">
              <h2 className="admin-card-title">Google Preview</h2>
              <GooglePreview title={seoTitleValue} description={seoDescValue} slug={form.slug} />
              {(form.noIndex || form.noFollow) && (
                <p className="seo-index-warning">
                  {form.noIndex && form.noFollow
                    ? "This page is set to No-index, No-follow — it won't appear in search results."
                    : form.noIndex
                      ? "This page is set to No-index — it won't appear in search results."
                      : "This page is set to No-follow — its links won't pass ranking value."}
                </p>
              )}
            </div>

            <div className="admin-form-card">
              <h2 className="admin-card-title">Social Media</h2>
              <SocialPreview
                image={form.featuredImage}
                title={socialTitleValue}
                description={socialDescValue}
              />
            </div>

            <div className="admin-form-card">
              <h2 className="admin-card-title">Canonical URL</h2>
              <p className="canonical-preview">{canonicalDisplay}</p>
            </div>
          </div>
      </div>

      <div className="admin-save-bar">
        <span className={`admin-dirty-indicator ${dirty ? "is-dirty" : ""}`}>
          {dirty ? "Unsaved changes" : "All changes saved"}
        </span>
        <button className="admin-submit admin-submit--inline" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
