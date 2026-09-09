import type { LengthStatus } from "./seoUtils";

const LABELS: Record<LengthStatus, string> = {
  empty: "Empty",
  good: "Good length",
  warn: "Could be better",
  bad: "Too long",
};

export default function LengthCounter({
  length,
  max,
  status,
  range,
}: {
  length: number;
  max: number;
  status: LengthStatus;
  range: string;
}) {
  const pct = Math.min(100, (length / max) * 100);
  return (
    <div className="seo-counter">
      <div className="seo-counter-bar">
        <div className={`seo-counter-fill seo-counter-fill--${status}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="seo-counter-meta">
        <span className={`seo-counter-badge seo-counter-badge--${status}`}>{LABELS[status]}</span>
        <span className="seo-counter-count">
          {length}/{max} &middot; {range}
        </span>
      </div>
    </div>
  );
}
