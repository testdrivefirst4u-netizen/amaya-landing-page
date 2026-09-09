import { SITE_DOMAIN, truncate } from "./seoUtils";

export default function GooglePreview({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  const displayTitle = truncate(title || "Your SEO title appears here", 60);
  const displayDescription = truncate(
    description || "Your meta description appears here with realistic Google-style truncation.",
    160
  );

  return (
    <div className="serp-card">
      <div className="serp-favicon-row">
        <span className="serp-favicon" aria-hidden="true">
          A
        </span>
        <div className="serp-url-block">
          <span className="serp-site-name">Amaya Senior Living</span>
          <span className="serp-breadcrumb">
            {SITE_DOMAIN} <span className="serp-breadcrumb-sep">&rsaquo;</span> blogs{" "}
            <span className="serp-breadcrumb-sep">&rsaquo;</span> {slug || "article"}
          </span>
        </div>
      </div>
      <p className="serp-title">{displayTitle}</p>
      <p className="serp-description">{displayDescription}</p>
    </div>
  );
}
