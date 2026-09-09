"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { PHONE, PHONE_HREF } from "@/lib/assets";
import { FiPhone } from "react-icons/fi";
import { useBookVisit } from "./BookVisitContext";

const LINKS = [
  { href: "#why", label: "Why Amaya" },
  { href: "#project", label: "The Project" },
  { href: "#life", label: "Life at Amaya" },
  { href: "#residences", label: "Residences" },
  { href: "#location", label: "Location" },
];

const WHATSAPP_HREF = "https://wa.me/919553395533";

// Landing-page variant of the main site's Nav — same look, but with
// Founders and the "More" (Gallery/FAQs/Blogs/Media) dropdown removed,
// since this is a single-page campaign site with nowhere for those to go.
export default function Nav() {
  const { open: openBookVisit } = useBookVisit();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const goTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.4 });
    } else {
      (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <header className={`nav ${solid ? "nav--solid" : ""}`}>
        <div className="nav-inner">
          <a
            href="#top"
            className="nav-logo"
            onClick={(e) => goTo(e, "#top")}
            aria-label="Amaya, back to top"
          >
            <Image
              src="/Amaya_black_Logo.webp"
              alt="Amaya"
              width={1080}
              height={543}
              priority
              className={`nav-logo-img ${solid ? "" : "is-inverted"}`}
            />
          </a>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => goTo(e, l.href)}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="btn btn-primary nav-cta"
              type="button"
              onClick={() => {
                setOpen(false);
                openBookVisit();
              }}
            >
              Book a Visit
            </button>
            <a className="nav-phone" href={PHONE_HREF}>
              {PHONE}
            </a>
            <a className="nav-phone-icon" href={PHONE_HREF} aria-label={`Call ${PHONE}`}>
              <FiPhone size={20} />
            </a>
            <button
              className={`nav-burger ${open ? "is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`nav-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              style={{ transitionDelay: open ? `${0.08 + i * 0.05}s` : "0s" }}
              onClick={(e) => goTo(e, l.href)}
            >
              {l.label}
            </a>
          ))}
          <a
            href={WHATSAPP_HREF}
            className="overlay-cta"
            style={{ transitionDelay: open ? `${0.08 + (LINKS.length + 1) * 0.05}s` : "0s" }}
            onClick={() => setOpen(false)}
          >
            Contact Us
          </a>
        </nav>
        <div className="nav-overlay-foot">
          <a href={PHONE_HREF}>{PHONE}</a>
          <span>RERA No: P02200011109</span>
        </div>
      </div>
    </>
  );
}
