function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("");
}

/**
 * Renders a real portrait when `src` is supplied; otherwise a clearly
 * labelled placeholder panel (never a fabricated photo) so the page still
 * reads cleanly until the real image is dropped in.
 */
export default function FounderPortrait({
  name,
  src,
  mobileSrc,
  alt,
}: {
  name: string;
  src?: string;
  mobileSrc?: string;
  alt?: string;
}) {
  if (!src) {
    return (
      <div className="fd-portrait-placeholder">
        <span className="fd-portrait-placeholder-initials">{initials(name)}</span>
        <span className="fd-portrait-placeholder-note">Portrait pending &middot; {name}</span>
      </div>
    );
  }

  return (
    <picture>
      {mobileSrc && (
        <source media="(max-width: 820px)" srcSet={mobileSrc} />
      )}
      <img src={src} alt={alt || name} loading="lazy" />
    </picture>
  );
}
