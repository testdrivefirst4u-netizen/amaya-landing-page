import Link from "next/link";
import { IconArrow } from "./Icons";
import type { BlogPost } from "@/lib/blogData";
import { ikTransform, IK_CARD } from "@/lib/imagekitUrl";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <article
      className="blog-card"
      data-category={post.category}
      data-reveal
      data-delay={`${index * 0.08}`}
    >
      <Link href={`/blogs/${post.slug}`} className="card-media blog-card-media" aria-label={post.title}>
        <img src={ikTransform(post.featuredImage, IK_CARD)} alt={post.featuredImageAlt} loading="lazy" />
      </Link>
      <div className="blog-card-body">
        <span className="blog-card-rule" />
        <div className="meta">
          <span>{post.category}</span>
          <span className="meta-dot" />
          <span className="meta-date">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
          </span>
        </div>
        <h3 className="blog-card-title">
          <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
        </h3>
        <div className="blog-card-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <Link href={`/blogs/${post.slug}`} className="btn-text blog-card-link">
          Read More
          <IconArrow size={14} className="btn-arrow" />
        </Link>
      </div>
    </article>
  );
}

export function FeaturedBlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="feature" data-category={post.category}>
      <Link
        href={`/blogs/${post.slug}`}
        className="card-media feature-media"
        aria-label={post.title}
        data-reveal-scale
      >
        <img src={ikTransform(post.featuredImage, IK_CARD)} alt={post.featuredImageAlt} loading="eager" />
      </Link>
      <div data-reveal data-delay="0.1">
        <span className="feature-index">01</span>
        <div className="meta">
          <span>{post.category}</span>
          <span className="meta-dot" />
          <span className="meta-date">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
          </span>
        </div>
        <h2 className="feature-title">
          <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
        </h2>
        <div className="feature-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <div className="feature-cta">
          <Link href={`/blogs/${post.slug}`} className="btn btn-primary">
            Read the story
            <IconArrow size={14} className="btn-arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export { formatDate };
