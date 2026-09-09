"use client";

import { IconArrow } from "./Icons";
import { PHONE, PHONE_HREF } from "@/lib/assets";
import { useBookVisit } from "./BookVisitContext";

/** Closing "See it for yourself" CTA band shared by /blogs, /media and
 * /founders — named .visit-band (not .visit) so it doesn't collide with the
 * homepage's own #visit section, which has different markup. */
export default function VisitBand() {
  const { open } = useBookVisit();

  return (
    <section className="visit-band">
      <div className="visit-band-media" aria-hidden="true">
        <img src="/experience-Amaya/See_it_Desktop_2880×1840.webp" alt="" loading="lazy" />
      </div>
      <div className="container on-dark">
        <div className="visit-band-grid">
          <div data-reveal>
            <span className="eyebrow eyebrow--light">The Experience Centre</span>
            <h2 className="h2">
              See it for <em>yourself.</em>
            </h2>
            <p className="lead" style={{ marginTop: "var(--s6)" }}>
              Walk the site, sit in a model residence, and meet the team. Visits are unhurried
              and by appointment.
            </p>
            <div className="visit-band-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={open}>
                Book a Visit
                <IconArrow size={14} className="btn-arrow" />
              </button>
              <a className="btn btn-outline-light btn-lg" href={PHONE_HREF}>
                Call {PHONE}
              </a>
            </div>
          </div>
          <dl className="visit-band-hours" data-reveal data-delay="0.12">
            <dt>Address</dt>
            <dd>
              Amaya Experience Centre
              <br />
              Munirabad, Medchal
              <br />
              Hyderabad, Telangana
            </dd>
            <dt>Open</dt>
            <dd>
              Monday to Saturday
              <br />
              9:00 AM to 6:00 PM
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
