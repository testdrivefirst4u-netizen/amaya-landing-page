import type { MetadataRoute } from "next";
import { listBlogPostsForDisplay } from "@/lib/blogStore";
import { listPublishedMedia } from "@/lib/mediaStore";

const SITE_URL = "https://www.amayaseniorliving.com";

// Blog/Media posts are admin-editable in MongoDB — always read fresh, so new
// or deleted posts appear here immediately instead of only after a rebuild.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, mediaItems] = await Promise.all([listBlogPostsForDisplay(), listPublishedMedia()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/founders`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faqs`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blogs`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/media`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => !p.noIndex)
    .map((p) => ({
      url: `${SITE_URL}/blogs/${p.slug}`,
      lastModified: p.publishedDate,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  const mediaRoutes: MetadataRoute.Sitemap = mediaItems
    .filter((a) => !a.noIndex)
    .map((a) => ({
      url: `${SITE_URL}/media/${a.slug}`,
      lastModified: a.publishedDate,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...blogRoutes, ...mediaRoutes];
}
