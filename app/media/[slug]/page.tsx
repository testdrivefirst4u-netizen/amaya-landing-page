import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import { MediaCard } from "@/components/MediaCard";
import { formatDate } from "@/components/BlogCard";
import MediaShareBar from "@/components/MediaShareBar";
import { getPublicMediaBySlug, getRelatedMedia } from "@/lib/mediaStore";
import { IconArrow } from "@/components/Icons";
import { ikTransform, IK_FEATURED, IK_SOCIAL } from "@/lib/imagekitUrl";
import { hasTeluguScript, stripHtml } from "@/lib/richText";
import { mediaSource } from "@/lib/mediaData";

const SITE_URL = "https://www.amayaseniorliving.com";

// Media items are admin-editable in MongoDB — always read fresh, never
// statically prerender this page.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicMediaBySlug(slug);
  if (!item) return { title: "Not Found · Amaya Senior Living" };

  const socialTitle = item.socialTitle || item.seoTitle;
  const socialDescription = item.socialDescription || item.seoDescription;

  return {
    title: `${item.seoTitle} · Amaya Senior Living`,
    description: item.seoDescription,
    alternates: { canonical: item.canonicalUrl || `/media/${item.slug}` },
    robots: {
      index: !item.noIndex,
      follow: !item.noFollow,
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      type: "article",
      url: `/media/${item.slug}`,
      publishedTime: item.publishedDate,
      authors: [mediaSource(item)],
      images: [
        {
          url: ikTransform(item.featuredImage, IK_SOCIAL),
          width: 1200,
          height: 630,
          alt: item.featuredImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [ikTransform(item.featuredImage, IK_SOCIAL)],
    },
  };
}

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPublicMediaBySlug(slug);
  if (!item) notFound();

  const related = await getRelatedMedia(slug, 3);
  const itemUrl = `${SITE_URL}/media/${item.slug}`;
  const source = mediaSource(item);
  const sourceLang = hasTeluguScript(source) ? "te" : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: stripHtml(item.excerpt),
    image: [ikTransform(item.featuredImage, IK_SOCIAL)],
    datePublished: item.publishedDate,
    author: { "@type": "Organization", name: source },
    publisher: { "@type": "Organization", name: "Vera Vita Living LLP" },
    mainEntityOfPage: itemUrl,
  };

  return (
    <>
      <Nav />
      <main>
        <article>
          <section className="legal-hero blog-article-hero">
            <div className="container">
              <span className="eyebrow" data-reveal>
                {item.category}
              </span>
              <h1 className="legal-hero-title" data-reveal-line>
                <span className="line-mask">
                  <span className="line-inner">{item.title}</span>
                </span>
              </h1>
              <p className="legal-hero-sub blog-article-meta" data-reveal data-delay="0.15">
                By <span lang={sourceLang}>{source}</span> &middot; {formatDate(item.publishedDate)}
              </p>
            </div>
          </section>

          <section className="legal-page blog-article-page">
            <div className="container">
              <div className="blog-article-media" data-reveal-fade>
                <img
                  src={ikTransform(item.featuredImage, IK_FEATURED)}
                  alt={item.featuredImageAlt}
                  loading="eager"
                />
              </div>

              <div
                className="blog-article-content"
                data-reveal-fade
                dangerouslySetInnerHTML={{ __html: item.content }}
              />

              <div className="blog-article-tags">
                {(item.tags ?? []).map((t) => (
                  <span className="blog-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>

              <MediaShareBar url={itemUrl} title={item.title} />

              <Link href="/media" className="btn-text blog-back-link">
                <IconArrow size={14} className="blog-back-arrow" />
                Back to Media
              </Link>

              {related.length > 0 && (
                <div className="blog-related">
                  <h2 className="blog-related-title">Related</h2>
                  <div className="blog-grid">
                    {related.map((r, i) => (
                      <MediaCard item={r} index={i} key={r.slug} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </article>
        <Footer />
      </main>
      <Animations />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
