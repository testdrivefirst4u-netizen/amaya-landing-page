"use client";

import { useState } from "react";
import { IconArrow } from "./Icons";
import { UNITS, RES_FEATURES } from "@/lib/residenceData";

export default function Residences() {
  const [active, setActive] = useState<number | null>(null);
  const unit = UNITS[active ?? 1];

  return (
    <section className="section residences" id="residences">
      <div className="container">
        <span className="eyebrow" data-reveal>
          04 &middot; The Residences
        </span>
        <div className="res-head">
          <h2 className="h2" data-reveal-line>
            <span className="line-mask">
              <span className="line-inner">Homes that</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                <em>breathe.</em>
              </span>
            </span>
          </h2>
          <p className="lead" data-reveal data-delay="0.15">
            Light-filled homes with intuitive layouts, generous spaces and thoughtful details for easier everyday living.
          </p>
        </div>

        <div className="res-grid" data-reveal data-delay="0.2">
          <div className="res-left">
            <div className="res-list" role="tablist" aria-label="Residence types">
              {UNITS.map((u, i) => {
                const isActive = i === active;
                return (
                  <div className={`res-row-wrap ${isActive ? "is-active" : ""}`} key={u.type}>
                    <button
                      role="tab"
                      aria-selected={isActive}
                      aria-expanded={isActive}
                      className={`res-row ${isActive ? "is-active" : ""}`}
                      onClick={() => setActive(isActive ? active : i)}
                    >
                      <span className="res-row-type">{u.type}</span>
                      <span className="res-row-sqft">{u.sqft} sq ft</span>
                      <span className="res-row-price">{u.price} onwards</span>
                      <span className="res-row-arrow">
                        <IconArrow size={18} />
                      </span>
                    </button>
                    {isActive && (
                      <div className="res-row-detail">
                        <div className="res-row-detail-inner">
                          <div className="res-row-detail-media frame">
                            <picture>
                              <source media="(max-width: 820px)" srcSet={u.mobile} />
                              <img
                                src={u.desktop}
                                alt={`${u.type} interior at Amaya`}
                                loading="lazy"
                              />
                            </picture>
                          </div>
                          <p className="res-detail-tagline">{u.tagline}</p>
                          <div className="res-detail-specs">
                            <div>
                              <span className="res-spec-label">Super Built-up Area</span>
                              <span className="res-spec-value">{u.sqft} sq ft</span>
                            </div>
                            <div>
                              <span className="res-spec-label">Priced from</span>
                              <span className="res-spec-value">{u.price}*</span>
                            </div>
                          </div>
                          <a className="btn btn-accent" href="#visit">
                            Enquire About This Home
                          </a>
       
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <ul className="res-features">
              {RES_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <p className="res-note">
              Areas shown are super built-up areas. Plans, specifications and
              views are indicative and may vary.
            </p>
          </div>

          <aside className="res-detail">
            <div className="res-detail-media frame">
              <picture>
                <source media="(max-width: 820px)" srcSet={unit.mobile} />
                <img src={unit.desktop} alt={`${unit.type} interior at Amaya`} loading="lazy" />
              </picture>
            </div>
            <div className="res-detail-body" key={unit.type}>
              <span className="res-detail-type">{unit.type}</span>
              <p className="res-detail-tagline">{unit.tagline}</p>
              <div className="res-detail-specs">
                <div>
                  <span className="res-spec-label">Super Built-up Area</span>
                  <span className="res-spec-value">{unit.sqft} sq ft</span>
                </div>
                <div>
                  <span className="res-spec-label">Priced from</span>
                  <span className="res-spec-value">{unit.price}*</span>
                </div>
              </div>
              <a className="btn btn-accent" href="#visit">
                Enquire About This Home
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
