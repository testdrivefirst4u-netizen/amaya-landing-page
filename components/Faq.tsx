"use client";

import { useState } from "react";
import { IconPlus } from "./Icons";
import { FAQS } from "@/lib/faqData";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="faq-grid">
          <div className="faq-head">
            <span className="eyebrow" data-reveal>
              07 &middot; Questions
            </span>
            <h2 className="h2" data-reveal-line>
              <span className="line-mask">
                <span className="line-inner">Everything you may</span>
              </span>
              <span className="line-mask">
                <span className="line-inner">
                  <em>want to know.</em>
                </span>
              </span>
            </h2>
            <p className="lead" data-reveal data-delay="0.15">
              Everything families most want to know, answered plainly. For
              anything else, our advisors are a call away.
            </p>
          </div>

          <div className="faq-list" data-reveal data-delay="0.15">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={f.q}>
                  <button
                    className="faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq-toggle">
                      <IconPlus size={18} />
                    </span>
                  </button>
                  <div className="faq-a" aria-hidden={!isOpen}>
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
