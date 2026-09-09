import { cache } from "react";
import { MongoClient, type Collection } from "mongodb";
import { SEED_POSTS, type BlogPost } from "@/lib/blogData";
import { stripHtml } from "@/lib/richText";
import { withRetry } from "@/lib/withRetry";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "amaya";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromiseBlog: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _blogSeeded: boolean | undefined;
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
  if (!global._mongoClientPromiseBlog) {
    global._mongoClientPromiseBlog = new MongoClient(uri as string, MONGO_OPTIONS).connect().catch((err) => {
      global._mongoClientPromiseBlog = undefined;
      throw err;
    });
  }
  return global._mongoClientPromiseBlog;
}

type BlogDoc = BlogPost;

async function getCollection(): Promise<Collection<BlogDoc> | null> {
  if (!isConfigured()) return null;
  const client = await getClientPromise();
  const col = client.db(dbName).collection<BlogDoc>("blogPosts");

  // One-time-per-instance seed check for local/fresh databases. Best-effort:
  // a hiccup here shouldn't fail the real request that triggered it, since
  // the collection itself is already usable regardless of this check.
  if (!global._blogSeeded) {
    global._blogSeeded = true;
    try {
      const count = await col.countDocuments();
      if (count === 0) {
        await col.insertMany(SEED_POSTS.map((p) => ({ ...p })));
      }
    } catch (err) {
      global._blogSeeded = false;
      console.error("Blog seed check failed (non-fatal):", err);
    }
  }
  return col;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  const col = await getCollection();
  if (!col) return sortByDateDesc(SEED_POSTS);
  const docs = await col.find({}, { projection: { _id: 0 } }).toArray();
  return sortByDateDesc(docs);
}

// The public /blogs index only renders title/excerpt/image/meta — never the
// article body or SEO-only fields — so leave those out of the query.
// `content` in particular can be tens of KB of rich-text HTML per post, and
// fetching it for every post just to show a card was the main thing making
// /blogs slow to load. (listBlogPosts() itself is left untouched since the
// admin dashboard and its API route reuse it and do need the full document.)
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

export async function listBlogPostsForDisplay(): Promise<BlogPost[]> {
  const col = await getCollection();
  if (!col) return sortByDateDesc(SEED_POSTS);
  const docs = await withRetry(() =>
    col.find({}, { projection: { _id: 0, ...LIST_EXCLUDED_FIELDS } }).toArray()
  );
  return sortByDateDesc(docs as BlogPost[]);
}

// Cached per-request: /blogs/[slug] calls this from both generateMetadata
// and the page component, which would otherwise be two separate DB round
// trips for the same document on every single request.
export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const col = await getCollection();
  if (!col) return SEED_POSTS.find((p) => p.slug === slug) ?? null;
  const doc = await withRetry(() => col.findOne({ slug }, { projection: { _id: 0 } }));
  return doc ?? null;
});

export async function getRelatedBlogPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const all = await listBlogPostsForDisplay();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  const rest = all.filter((p) => p.slug !== slug);
  const sameCategory = rest.filter((p) => p.category === current.category);
  const others = rest.filter((p) => p.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export type BlogPostInput = BlogPost;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Validates and normalizes the admin form's flat JSON body into a BlogPostInput. */
export function parseFormInput(body: Record<string, unknown>): BlogPostInput | { error: string } {
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

  if (!title) return { error: "Title is required." };
  if (!slug) return { error: "Slug is required." };
  if (!category) return { error: "Category is required." };
  if (!stripHtml(excerpt)) return { error: "Excerpt is required." };
  if (!featuredImage) return { error: "Featured image is required." };
  if (!content) return { error: "Article body is required." };

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
    ...(focusKeyword ? { focusKeyword } : {}),
    ...(canonicalUrl ? { canonicalUrl } : {}),
    ...(noIndex ? { noIndex } : {}),
    ...(noFollow ? { noFollow } : {}),
    ...(socialTitle ? { socialTitle } : {}),
    ...(socialDescription ? { socialDescription } : {}),
  };
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const col = await getCollection();
  if (!col) throw new Error("Database not configured.");
  const existing = await col.findOne({ slug: input.slug });
  if (existing) throw new Error("A post with this slug already exists.");
  await col.insertOne({ ...input });
  return input;
}

export async function updateBlogPost(
  currentSlug: string,
  input: BlogPostInput
): Promise<BlogPost | null> {
  const col = await getCollection();
  if (!col) throw new Error("Database not configured.");
  if (input.slug !== currentSlug) {
    const clash = await col.findOne({ slug: input.slug });
    if (clash) throw new Error("A post with this slug already exists.");
  }
  const result = await col.findOneAndUpdate(
    { slug: currentSlug },
    { $set: { ...input } },
    { returnDocument: "after", projection: { _id: 0 } }
  );
  return result ?? null;
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const col = await getCollection();
  if (!col) throw new Error("Database not configured.");
  const result = await col.deleteOne({ slug });
  return result.deletedCount > 0;
}
