"use client";

import { ASSETS, PHONE, PHONE_HREF } from "@/lib/assets";
import { useBookVisit } from "./BookVisitContext";

export default function VisitCta() {
  const { open } = useBookVisit();
  return (
    <section className="section visit" id="visit">
      <div className="visit-bg" aria-hidden>
        <picture>
          <source
            media="(max-width: 820px)"
            srcSet={ASSETS.experienceMobile}
            width="780"
            height="1450"
          />
          <img
            src={ASSETS.experienceDesktop}
            alt=""
            width="2880"
            height="1840"
            data-parallax
            loading="lazy"
          />
        </picture>
        <div className="visit-scrim" />
      </div>

      <div className="container visit-inner">
        <span className="eyebrow" data-reveal>
          Come and experience Amaya
        </span>
        <h2 className="visit-title" data-reveal-line>
          <span className="line-mask">
            <span className="line-inner">See it for</span>
          </span>
          <span className="line-mask">
            <span className="line-inner">
              <em>yourself.</em>
            </span>
          </span>
        </h2>
        <p className="visit-sub" data-reveal data-delay="0.15">
          Visit the Amaya Experience Centre, explore the residence and speak
          with our advisors. We are open Monday to Saturday, from 10:00 to
          18:00.
        </p>

        <div className="visit-ctas" data-reveal data-delay="0.25">
          <button className="btn btn-primary btn-lg" type="button" onClick={open}>
            Book a Visit
          </button>
          <a className="btn btn-outline-light btn-lg" href={PHONE_HREF}>
            {PHONE}
          </a>
        </div>

        <p className="visit-address" data-reveal data-delay="0.3">
          Amaya Experience Centre &middot; Munirabad, Medchal, Hyderabad
        </p>
      </div>
    </section>
  );
}
