"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { IconArrow } from "./Icons";
import { formatDate } from "./BlogCard";
import { hasTeluguScript, stripHtml } from "@/lib/richText";
import { mediaSource, type MediaItem } from "@/lib/mediaData";

const PAGE_SIZE = 6;

/** "Elsewhere in the press" — a plain typographic list, matching the mockup. */
export default function PressIndex({ items }: { items: MediaItem[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const listRef = useRef<HTMLDivElement>(null);
  const prevVisible = useRef(PAGE_SIZE);
  const shown = items.slice(0, visible);
  const hasMore = visible < items.length;

  // Rows added after the initial scroll-reveal scan never get animated in
  // on their own, so animate newly-shown rows in by hand.
  useEffect(() => {
    if (visible <= prevVisible.current || !listRef.current) {
      prevVisible.current = visible;
      return;
    }
    const newRows = Array.from(
      listRef.current.querySelectorAll<HTMLElement>("[data-reveal]")
    ).slice(prevVisible.current);
    prevVisible.current = visible;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(newRows, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      newRows,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 1.15, ease: "power3.out", stagger: 0.08 }
    );
  }, [visible]);

  if (items.length === 0) return null;

  return (
    <>
      <div className="index-list" ref={listRef}>
        {shown.map((item) => {
          const source = mediaSource(item);
          const sourceLang = hasTeluguScript(source) ? "te" : undefined;
          const titleLang = hasTeluguScript(item.title) ? "te" : undefined;
          return (
            <Link
              key={item.slug}
              className="index-row"
              href={`/media/${item.slug}`}
              data-reveal
            >
              <div className="index-inner">
                <div className="index-source">
                  <span className="index-pub" lang={sourceLang}>{source}</span>
                  <span className="index-date">
                    <time dateTime={item.publishedDate}>{formatDate(item.publishedDate)}</time>
                  </span>
                </div>
                <div>
                  <h3 className="index-headline" lang={titleLang}>{item.title}</h3>
                  <p className="index-excerpt" lang={titleLang}>{stripHtml(item.excerpt)}</p>
                </div>
                <IconArrow size={20} className="index-arrow" />
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="articles-load-more">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
