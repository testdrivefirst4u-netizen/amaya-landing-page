export type MediaStatus = "draft" | "published" | "scheduled";

export type MediaItem = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  /** Rich-text body, as HTML produced by the admin's TipTap editor. */
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  publishedDate: string; // ISO date, e.g. "2026-07-10"
  tags: string[];
  status: MediaStatus;
  /** Required when status is "scheduled" — ISO datetime it goes live. */
  scheduledDate?: string;
  featured?: boolean;
  seoTitle: string;
  seoDescription: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  socialTitle?: string;
  socialDescription?: string;
};

/**
 * The outlet/publication name to display for a media item. Almost every
 * item leaves `category` as the generic "Media Coverage" default and puts
 * the real outlet name in `author` — but at least one published item (the
 * Telugu బిజినెస్ post) has it reversed: `category` holds the outlet name
 * and `author` is a generic placeholder. Prefer `category` whenever it's
 * been set to something other than the generic default.
 */
export function mediaSource(item: Pick<MediaItem, "author" | "category">): string {
  return item.category && item.category !== "Media Coverage" ? item.category : item.author;
}
