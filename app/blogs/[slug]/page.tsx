import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import { BlogCard, formatDate } from "@/components/BlogCard";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blogStore";
import { IconArrow } from "@/components/Icons";
import { ikTransform, IK_FEATURED, IK_SOCIAL } from "@/lib/imagekitUrl";
import { stripHtml } from "@/lib/richText";

// Blog posts are admin-editable in MongoDB — always read fresh, never
// statically prerender this page.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Blog Post Not Found · Amaya Senior Living" };

  const socialTitle = post.socialTitle || post.seoTitle;
  const socialDescription = post.socialDescription || post.seoDescription;

  return {
    title: `${post.seoTitle} · Amaya Senior Living`,
    description: post.seoDescription,
    alternates: { canonical: post.canonicalUrl || `/blogs/${post.slug}` },
    robots: {
      index: !post.noIndex,
      follow: !post.noFollow,
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      type: "article",
      url: `/blogs/${post.slug}`,
      publishedTime: post.publishedDate,
      authors: [post.author],
      images: [
        {
          url: ikTransform(post.featuredImage, IK_SOCIAL),
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [ikTransform(post.featuredImage, IK_SOCIAL)],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: stripHtml(post.excerpt),
    image: [ikTransform(post.featuredImage, IK_SOCIAL)],
    datePublished: post.publishedDate,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Vera Vita Living LLP" },
    mainEntityOfPage: `https://www.amayaseniorliving.com/blogs/${post.slug}`,
  };

  return (
    <>
      <Nav />
      <main>
        <article>
          <section className="legal-hero blog-article-hero">
            <div className="container">
              <span className="eyebrow" data-reveal>
                {post.category}
              </span>
              <h1 className="legal-hero-title" data-reveal-line>
                <span className="line-mask">
                  <span className="line-inner">{post.title}</span>
                </span>
              </h1>
              <p className="legal-hero-sub blog-article-meta" data-reveal data-delay="0.15">
                By {post.author} &middot; {formatDate(post.publishedDate)}
              </p>
            </div>
          </section>

          <section className="legal-page blog-article-page">
            <div className="container">
              <div className="blog-article-media" data-reveal-fade>
                <img
                  src={ikTransform(post.featuredImage, IK_FEATURED)}
                  alt={post.featuredImageAlt}
                  loading="eager"
                />
              </div>

              <div
                className="blog-article-content"
                data-reveal-fade
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="blog-article-tags">
                {(post.tags ?? []).map((t) => (
                  <span className="blog-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>

              <Link href="/blogs" className="btn-text blog-back-link">
                <IconArrow size={14} className="blog-back-arrow" />
                Back to Blogs
              </Link>

              {related.length > 0 && (
                <div className="blog-related">
                  <h2 className="blog-related-title">Related Articles</h2>
                  <div className="blog-grid">
                    {related.map((p, i) => (
                      <BlogCard post={p} index={i} key={p.slug} />
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
