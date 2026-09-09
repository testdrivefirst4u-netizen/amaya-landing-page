import { cache } from "react";
import { MongoClient, type Collection } from "mongodb";
import type { MediaItem } from "@/lib/mediaData";
import { stripHtml } from "@/lib/richText";
import { withRetry } from "@/lib/withRetry";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "amaya";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromiseMedia: Promise<MongoClient> | undefined;
}

function isConfigured(): boolean {
  return !!uri && !uri.includes("dummy") && !uri.includes("<username>");
}

// The driver's own defaults (serverSelectionTimeoutMS: 30000) can outlast a
// Vercel serverless function's own execution limit, so a slow/unreachable
// DB hangs the request until the platform kills it with a 504 instead of
// failing fast. Keep these well under that limit.
const MONGO_OPTIONS = {
  connectTimeoutMS: 8000,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 10000,
};

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromiseMedia) {
    global._mongoClientPromiseMedia = new MongoClient(uri as string, MONGO_OPTIONS).connect().catch((err) => {
      global._mongoClientPromiseMedia = undefined;
      throw err;
    });
  }
  return global._mongoClientPromiseMedia;
}

async function getCollection(): Promise<Collection<MediaItem> | null> {
  if (!isConfigured()) return null;
  const client = await getClientPromise();
  return client.db(dbName).collection<MediaItem>("media");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortByDateDesc(items: MediaItem[]): MediaItem[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

/**
 * The admin's <input type="datetime-local"> gives a timezone-less
 * "YYYY-MM-DDTHH:mm" string representing the ADMIN's (India) wall-clock
 * time. Interpreting it with the bare `Date` constructor would instead use
 * the server process's own timezone (e.g. UTC on most cloud hosts),
 * silently shifting scheduled publish times by hours. Pin it to IST
 * (UTC+5:30) explicitly so it means the same moment everywhere.
 */
function parseIstDateTime(value: string): number {
  return new Date(`${value}+05:30`).getTime();
}

/** Publicly visible once published, or once its scheduled time has arrived. */
function isLive(item: MediaItem): boolean {
  if (item.status === "published") return true;
  if (item.status === "scheduled" && item.scheduledDate) {
    return parseIstDateTime(item.scheduledDate) <= Date.now();
  }
  return false;
}

// List/index pages never render the article body or SEO-only fields, so
// leave them out of the query — `content` in particular can be tens of KB
// of rich-text HTML per item, and fetching it for every item just to show a
// card was the main thing making /media slow to load.
const LIST_EXCLUDED_FIELDS = {
  content: 0,
  seoTitle: 0,
  seoDescription: 0,
  focusKeyword: 0,
  canonicalUrl: 0,
  noIndex: 0,
  noFollow: 0,
  socialTitle: 0,
  socialDescription: 0,
} as const;

/** Public-facing list — published (or now-due scheduled) items only, newest first, featured first. */
export async function listPublishedMedia(): Promise<MediaItem[]> {
  const col = await getCollection();
  if (!col) return [];
  const docs = await withRetry(() =>
    col.find({}, { projection: { _id: 0, ...LIST_EXCLUDED_FIELDS } }).toArray()
  );
  const live = sortByDateDesc((docs as MediaItem[]).filter(isLive));
  const featured = live.filter((a) => a.featured);
  const rest = live.filter((a) => !a.featured);
  return [...featured, ...rest];
}

/** Public single-item lookup — only returns it if it's actually live. */
// Cached per-request: /media/[slug] calls this from both generateMetadata
// and the page component, which would otherwise be two separate DB round
// trips for the same document on every single request.
export const getPublicMediaBySlug = cache(async (slug: string): Promise<MediaItem | null> => {
  const col = await getCollection();
  if (!col) return null;
  const doc = await withRetry(() => col.findOne({ slug }, { projection: { _id: 0 } }));
  if (!doc || !isLive(doc)) return null;
  return doc;
});

export async function getRelatedMedia(slug: string, limit = 3): Promise<MediaItem[]> {
  const all = await listPublishedMedia();
  const current = all.find((a) => a.slug === slug);
  if (!current) return [];
  const rest = all.filter((a) => a.slug !== slug);
  const sameCategory = rest.filter((a) => a.category === current.category);
  const others = rest.filter((a) => a.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

/** Admin-facing list — every item regardless of status. */
export async function listAllMedia(): Promise<MediaItem[]> {
  const col = await getCollection();
  if (!col) return [];
  const docs = await col.find({}, { projection: { _id: 0 } }).toArray();
  return sortByDateDesc(docs);
}

/** Admin-facing single lookup — any status, for the edit screen. */
export async function getMediaBySlugAdmin(slug: string): Promise<MediaItem | null> {
  const col = await getCollection();
  if (!col) return null;
  const doc = await col.findOne({ slug }, { projection: { _id: 0 } });
  return doc ?? null;
}

export type MediaItemInput = MediaItem;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Validates and normalizes the admin form's flat JSON body into a MediaItemInput. */
export function parseMediaFormInput(body: Record<string, unknown>): MediaItemInput | { error: string } {
  const title = str(body.title);
  const category = str(body.category);
  const excerpt = str(body.excerpt);
  const featuredImage = str(body.featuredImage);
  const featuredImageAlt = str(body.featuredImageAlt) || title;
  const author = str(body.author) || "Team Amaya";
  const publishedDate = str(body.publishedDate) || new Date().toISOString().slice(0, 10);
  const seoTitle = str(body.seoTitle) || title;
  const seoDescription = str(body.seoDescription) || stripHtml(excerpt);
  const content = str(body.content);
  const slug = slugify(str(body.slug) || title);
  const tags = Array.isArray(body.tags)
    ? body.tags.map(str).filter(Boolean)
    : str(body.tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
  const focusKeyword = str(body.focusKeyword);
  const canonicalUrl = str(body.canonicalUrl);
  const noIndex = body.noIndex === true;
  const noFollow = body.noFollow === true;
  const socialTitle = str(body.socialTitle);
  const socialDescription = str(body.socialDescription);
  const featured = body.featured === true;
  const statusRaw = str(body.status);
  const status = statusRaw === "published" || statusRaw === "scheduled" ? statusRaw : "draft";
  const scheduledDate = str(body.scheduledDate);

  if (!title) return { error: "Title is required." };
  if (!slug) return { error: "Slug is required." };
  if (!category) return { error: "Category is required." };
  if (!stripHtml(excerpt)) return { error: "Excerpt is required." };
  if (!featuredImage) return { error: "Featured image is required." };
  if (!content) return { error: "Body content is required." };
  if (status === "scheduled" && !scheduledDate) {
    return { error: "A scheduled date/time is required when status is Scheduled." };
  }

  return {
    title,
    slug,
    category,
    excerpt,
    featuredImage,
    featuredImageAlt,
    author,
    publishedDate,
    tags,
    seoTitle,
    seoDescription,
    content,
    status,
    featured,
    ...(status === "scheduled" ? { scheduledDate } : {}),
    ...(focusKeyword ? { focusKeyword } : {}),
    ...(canonicalUrl ? { canonicalUrl } : {}),
    ...(noIndex ? { noIndex } : {}),
    ...(noFollow ? { noFollow } : {}),
    ...(socialTitle ? { socialTitle } : {}),
    ...(socialDescription ? { socialDescription } : {}),
  };
}

export async function createMediaItem(input: MediaItemInput): Promise<MediaItem> {
  const col = await getCollection();
  if (!col) throw new Error("Database not configured.");
  const existing = await col.findOne({ slug: input.slug });
  if (existing) throw new Error("An item with this slug already exists.");
  await col.insertOne({ ...input });
  return input;
}

export async function updateMediaItem(
  currentSlug: string,
  input: MediaItemInput
): Promise<MediaItem | null> {
  const col = await getCollection();
  if (!col) throw new Error("Database not configured.");
  if (input.slug !== currentSlug) {
    const clash = await col.findOne({ slug: input.slug });
    if (clash) throw new Error("An item with this slug already exists.");
  }
  const result = await col.findOneAndUpdate(
    { slug: currentSlug },
    { $set: { ...input }, $unset: input.status === "scheduled" ? {} : { scheduledDate: "" } },
    { returnDocument: "after", projection: { _id: 0 } }
  );
  return result ?? null;
}

export async function setMediaStatus(
  slug: string,
  status: MediaItem["status"]
): Promise<MediaItem | null> {
  const col = await getCollection();
  if (!col) throw new Error("Database not configured.");
  const result = await col.findOneAndUpdate(
    { slug },
    { $set: { status } },
    { returnDocument: "after", projection: { _id: 0 } }
  );
  return result ?? null;
}

export async function deleteMediaItem(slug: string): Promise<boolean> {
  const col = await getCollection();
  if (!col) throw new Error("Database not configured.");
  const result = await col.deleteOne({ slug });
  return result.deletedCount > 0;
}
