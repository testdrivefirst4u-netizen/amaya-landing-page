"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { BlogCard, FeaturedBlogCard } from "./BlogCard";
import type { BlogPost } from "@/lib/blogData";

const TOPIC_ORDER = ["Founders", "Residences", "Healthcare", "Location", "Community", "Lifestyle"];
const PAGE_SIZE = 6;

/**
 * Topic filter + index for /blogs. Filters the already-fetched posts
 * client-side and slides a brass rule under the active topic, measured from
 * the rendered button (so it stays pixel-accurate across font loads and
 * viewport width) rather than assumed from CSS alone.
 */
export default function BlogsIndex({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const prevVisible = useRef(PAGE_SIZE);

  const topics = useMemo(() => {
    const present = new Set(posts.map((p) => p.category));
    return TOPIC_ORDER.filter((t) => present.has(t));
  }, [posts]);

  const [featured, ...rest] = posts;
  const featuredVisible = !featured || active === "all" || featured.category === active;
  const filteredRest = rest.filter((p) => active === "all" || p.category === active);
  const visibleRest = filteredRest.slice(0, visible);
  const hasMore = visible < filteredRest.length;
  const shownCount = (featuredVisible && featured ? 1 : 0) + visibleRest.length;

  useEffect(() => {
    setVisible(PAGE_SIZE);
    prevVisible.current = PAGE_SIZE;
  }, [active]);

  // Same reveal-on-load-more fix as PressIndex: cards added after the
  // initial scroll-reveal scan never get animated in on their own.
  useEffect(() => {
    if (visible <= prevVisible.current || !gridRef.current) {
      prevVisible.current = visible;
      return;
    }
    const newCards = Array.from(
      gridRef.current.querySelectorAll<HTMLElement>("[data-reveal]")
    ).slice(prevVisible.current);
    prevVisible.current = visible;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(newCards, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      newCards,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 1.15, ease: "power3.out", stagger: 0.08 }
    );
  }, [visible]);

  const place = (animate: boolean) => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const btn = list.querySelector<HTMLButtonElement>(".topic.is-active");
    if (!btn) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reduceMotion) indicator.style.transition = "none";
    indicator.style.width = `${btn.offsetWidth}px`;
    indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
    if (!animate || reduceMotion) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          indicator.style.transition = "";
        });
      });
    }
  };

  useEffect(() => {
    place(true);
  }, [active]);

  useEffect(() => {
    place(false);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => place(false));
    }
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    let observer: ResizeObserver | undefined;
    if ("ResizeObserver" in window && listRef.current) {
      observer = new ResizeObserver(() => place(false));
      observer.observe(listRef.current);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Buttons respond on pointer-down rather than click, so the filter feels
  // immediate; keydown covers keyboard activation (Enter/Space) instead.
  const selectHandlers = (topic: string) => ({
    onPointerDown: () => setActive(topic),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(topic);
      }
    },
  });

  return (
    <>
      <div className="topics-wrap">
        <div className="container">
          <div className="topics" role="group" aria-label="Filter stories by topic">
            <span className="topics-label">Topics</span>
            <div className="topics-list" ref={listRef}>
              <button
                type="button"
                className={active === "all" ? "topic is-active" : "topic"}
                aria-pressed={active === "all"}
                {...selectHandlers("all")}
              >
                All
              </button>
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={active === t ? "topic is-active" : "topic"}
                  aria-pressed={active === t}
                  {...selectHandlers(t)}
                >
                  {t}
                </button>
              ))}
              <span className="topics-indicator" ref={indicatorRef} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {featured && featuredVisible && (
            <>
              <FeaturedBlogCard post={featured} />
              <hr className="rule" style={{ marginBlock: "clamp(56px, 7vw, 104px)" }} />
            </>
          )}
          {visibleRest.length > 0 && (
            <div className="blog-grid" ref={gridRef}>
              {visibleRest.map((post, i) => (
                <BlogCard post={post} index={i} key={post.slug} />
              ))}
            </div>
          )}
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
          {shownCount === 0 && <p className="filter-empty">Nothing under this topic yet.</p>}
        </div>
      </section>
    </>
  );
}
