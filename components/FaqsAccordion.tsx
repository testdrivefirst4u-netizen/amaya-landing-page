"use client";

import { useState } from "react";
import { IconPlus } from "./Icons";
import { FAQS, CHATBOT_ONLY_FAQS, type FaqEntry } from "@/lib/faqData";

const ALL_FAQS: FaqEntry[] = [...FAQS, ...CHATBOT_ONLY_FAQS];

export default function FaqsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="faq-list" data-reveal-fade>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {ALL_FAQS.map((f, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={f.q}>
            <h3>
              <button
                className="faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                <span className="faq-toggle">
                  <IconPlus size={18} />
                </span>
              </button>
            </h3>
            <div className="faq-a" aria-hidden={!isOpen}>
              <p>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
