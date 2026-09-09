"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconArrow, IconPlus } from "./Icons";

export type GalleryItem = {
  desktop: string;
  mobile: string;
  alt: string;
  caption: string;
  category: string;
};

const CATEGORIES = [
  "All",
  "Architecture",
  "Landscape",
  "Amenities",
  "Community",
  "Wellness",
  "Location",
];

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);
  const touchStartX = useRef<number | null>(null);

  const goPrev = () => setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  const goNext = () => setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const SWIPE_THRESHOLD = 40;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
  };

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, items.length]);

  return (
    <div data-reveal-fade>
      <div className="gallery-filters" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={active === c}
            className={`gallery-filter ${active === c ? "is-active" : ""}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="gallery-empty">More photos from this category are coming soon.</p>
      ) : (
        <div className="gallery-grid">
          {filtered.map((g) => {
            const realIndex = items.indexOf(g);
            return (
              <button
                type="button"
                className="gallery-item"
                key={g.caption}
                onClick={() => setOpenIndex(realIndex)}
                aria-label={`Open ${g.caption}`}
              >
                <picture>
                  <source media="(max-width: 820px)" srcSet={g.mobile} />
                  <img src={g.desktop} alt={g.alt} loading="lazy" />
                </picture>
              </button>
            );
          })}
        </div>
      )}

      <p className="gallery-disclaimer">
        All images are architectural renders. The finished development may
        differ from visualisations shown.
      </p>

      {openIndex !== null &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpenIndex(null);
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button className="lightbox-close" aria-label="Close" onClick={() => setOpenIndex(null)}>
              <IconPlus size={20} />
            </button>
            <button className="lightbox-nav lightbox-prev" aria-label="Previous image" onClick={goPrev}>
              <IconArrow size={20} />
            </button>
            <div className="lightbox-media">
              <img src={items[openIndex].desktop} alt={items[openIndex].alt} />
            </div>
            <button className="lightbox-nav lightbox-next" aria-label="Next image" onClick={goNext}>
              <IconArrow size={20} />
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
