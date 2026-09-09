import Link from "next/link";
import { IconArrow } from "./Icons";
import { mediaSource, type MediaItem } from "@/lib/mediaData";
import { formatDate } from "./BlogCard";
import { ikTransform, IK_CARD } from "@/lib/imagekitUrl";
import { hasTeluguScript } from "@/lib/richText";

export function MediaCard({ item, index = 0 }: { item: MediaItem; index?: number }) {
  const source = mediaSource(item);
  const sourceLang = hasTeluguScript(source) ? "te" : undefined;
  const titleLang = hasTeluguScript(item.title) ? "te" : undefined;

  return (
    <article className="blog-card" data-reveal data-delay={`${index * 0.08}`}>
      <Link href={`/media/${item.slug}`} className="blog-card-media" aria-label={item.title}>
        <img src={ikTransform(item.featuredImage, IK_CARD)} alt={item.featuredImageAlt} loading="lazy" />
        {item.featured && <span className="blog-card-featured-badge">Featured</span>}
      </Link>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="blog-card-category" lang={sourceLang}>{source}</span>
          <span className="blog-card-date">{formatDate(item.publishedDate)}</span>
        </div>
        <h3 className="blog-card-title" lang={titleLang}>
          <Link href={`/media/${item.slug}`}>{item.title}</Link>
        </h3>
        <div
          className="blog-card-excerpt"
          lang={titleLang}
          dangerouslySetInnerHTML={{ __html: item.excerpt }}
        />
        <Link href={`/media/${item.slug}`} className="btn-text blog-card-link">
          Read More
          <IconArrow size={14} className="btn-arrow" />
        </Link>
      </div>
    </article>
  );
}
