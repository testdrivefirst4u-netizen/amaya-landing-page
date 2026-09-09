type StripItem = { label: string; value: string };

/** Shared cinematic hero for /blogs, /media and /founders — the `.phero`
 * component from the redesign mockups, used identically on all three.
 * With no `desktopSrc`, it falls back to `.phero`'s own solid navy
 * background instead of a photo. */
export default function PageHero({
  desktopSrc,
  mobileSrc,
  eyebrow,
  titleLines,
  sub,
  strip,
}: {
  desktopSrc?: string;
  mobileSrc?: string;
  eyebrow: string;
  titleLines: [string, string];
  sub: string;
  strip?: StripItem[];
}) {
  return (
    <section className="phero">
      {desktopSrc && (
        <div className="phero-media" aria-hidden="true">
          <picture>
            {mobileSrc && <source media="(max-width: 820px)" srcSet={mobileSrc} />}
            <img src={desktopSrc} alt="" fetchPriority="high" />
          </picture>
        </div>
      )}
      <div className="phero-inner">
        <div className="container">
          <span className="eyebrow eyebrow--light" data-reveal>
            {eyebrow}
          </span>
          <h1 className="phero-title" data-reveal-line>
            <span className="line-mask">
              <span className="line-inner">{titleLines[0]}</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                <em>{titleLines[1]}</em>
              </span>
            </span>
          </h1>
          <p className="phero-sub" data-reveal data-delay="0.15">
            {sub}
          </p>
        </div>
      </div>
      {/* {strip && strip.length > 0 && (
        <div className="phero-strip">
          {strip.map((item) => (
            <div className="phero-strip-item" key={item.label}>
              <span className="phero-strip-label">{item.label}</span>
              <span className="phero-strip-value">{item.value}</span>
            </div>
          ))}
        </div>
      )} */}
    </section>
  );
}
