import Link from "next/link";
import { IconArrow } from "./Icons";
import { formatDate } from "./BlogCard";
import { ikTransform, IK_CARD } from "@/lib/imagekitUrl";
import { hasTeluguScript } from "@/lib/richText";
import { mediaSource, type MediaItem } from "@/lib/mediaData";

/** The /media lead story. The badge shows the outlet name (see mediaSource),
 * and a non-English headline (detected from its script, not hardcoded to a
 * slug) gets a Telugu face and correct leading. */
export default function PressLead({ item }: { item: MediaItem }) {
  const source = mediaSource(item);
  const titleLang = hasTeluguScript(item.title) ? "te" : undefined;
  const sourceLang = hasTeluguScript(source) ? "te" : undefined;

  return (
    <article className="lead-story">
      <Link
        href={`/media/${item.slug}`}
        className="card-media lead-media"
        aria-label="Read the feature"
        data-reveal-scale
      >
        <img src={ikTransform(item.featuredImage, IK_CARD)} alt={item.featuredImageAlt} loading="eager" />
      </Link>
      <div data-reveal data-delay="0.1">
        <div className="meta">
          <span>Featured</span>
          <span className="meta-dot" />
          <span lang={sourceLang} style={{ letterSpacing: ".06em" }}>
            {source}
          </span>
          <span className="meta-dot" />
          <span className="meta-date">
            <time dateTime={item.publishedDate}>{formatDate(item.publishedDate)}</time>
          </span>
        </div>
        <h2 className="lead-title" lang={titleLang}>
          <Link href={`/media/${item.slug}`}>{item.title}</Link>
        </h2>
        <div
          className="lead-excerpt"
          lang={titleLang}
          dangerouslySetInnerHTML={{ __html: item.excerpt }}
        />
        <div className="lead-cta">
          <Link href={`/media/${item.slug}`} className="btn btn-primary">
            Read the coverage
            <IconArrow size={14} className="btn-arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
}
