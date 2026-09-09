import Link from "next/link";
import { IconArrow } from "./Icons";
import { formatDate } from "./BlogCard";
import { ikTransform, IK_CARD } from "@/lib/imagekitUrl";
import { mediaSource, type MediaItem } from "@/lib/mediaData";
import { hasTeluguScript } from "@/lib/richText";

export default function PressPairCard({ item, index = 0 }: { item: MediaItem; index?: number }) {
  const source = mediaSource(item);
  const sourceLang = hasTeluguScript(source) ? "te" : undefined;
  const titleLang = hasTeluguScript(item.title) ? "te" : undefined;

  return (
    <article className="pair-card" data-reveal data-delay={`${index * 0.1}`}>
      <Link href={`/media/${item.slug}`} className="card-media pair-media" aria-label={item.title}>
        <img src={ikTransform(item.featuredImage, IK_CARD)} alt={item.featuredImageAlt} loading="lazy" />
      </Link>
      <div className="pair-body">
        <div className="meta">
          <span lang={sourceLang}>{source}</span>
          <span className="meta-dot" />
          <span className="meta-date">
            <time dateTime={item.publishedDate}>{formatDate(item.publishedDate)}</time>
          </span>
        </div>
        <h3 className="pair-title" lang={titleLang}>
          <Link href={`/media/${item.slug}`}>{item.title}</Link>
        </h3>
        <div
          className="pair-excerpt"
          lang={titleLang}
          dangerouslySetInnerHTML={{ __html: item.excerpt }}
        />
        <Link href={`/media/${item.slug}`} className="btn-text pair-link">
          Read More
          <IconArrow size={13} className="btn-arrow" />
        </Link>
      </div>
    </article>
  );
}
