"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Single animation orchestrator.
 * - Lenis smooth scroll, integrated with GSAP's ticker
 * - On-load hero timeline           [data-hero], [data-hero-line]
 * - Scroll reveals                  [data-reveal], [data-reveal-line],
 *                                   [data-reveal-fade], [data-reveal-scale]
 * - Hairline draws                  [data-draw]
 * - Animated counters               [data-count]
 * - Image parallax                  [data-parallax]
 * Motion language: slow, unhurried, power3 easing — luxury restraint.
 */
export default function Animations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.09, autoRaf: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      /* ---------- Hero intro (on load) ---------- */
      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });
      heroTl
        .to("[data-hero-media]", { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" }, 0)
        .to(
          "[data-hero-line] .line-inner",
          { y: 0, duration: 1.3, stagger: 0.14 },
          0.5
        )
        .to(
          "[data-hero]",
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 },
          1.0
        );

      /* ---------- Scroll reveals ---------- */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.15,
          ease: "power3.out",
          delay: parseFloat(el.dataset.delay || "0"),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-line]").forEach((el) => {
        gsap.to(el.querySelectorAll(".line-inner"), {
          y: 0,
          duration: 1.25,
          ease: "power3.out",
          stagger: 0.13,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-fade]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          duration: 1.6,
          ease: "power2.out",
          delay: parseFloat(el.dataset.delay || "0"),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-scale]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((el) => {
        gsap.to(el, {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.inOut",
          delay: parseFloat(el.dataset.delay || "0"),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      /* ---------- Counters ---------- */
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count || "0");
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 3.6,
          ease: "power1.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = obj.v.toLocaleString("en-IN", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
          },
        });
      });

      /* ---------- Parallax ---------- */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".frame") || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
