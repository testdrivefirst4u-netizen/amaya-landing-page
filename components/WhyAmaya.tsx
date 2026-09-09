import { ASSETS } from "@/lib/assets";
import {
  IconCommunity,
  IconCare,
  IconSafety,
  IconHome,
} from "./Icons";

const PILLARS = [
  {
    icon: IconCommunity,
    title: "COMMUNITY, BY CHOICE ",
    body: "Shared interests grow into lasting friendships.",
  },
  {
    icon: IconCare,
    title: "CARE, CLOSE AT HAND",
    body: "Medical care, available when needed.",
  },
  {
    icon: IconSafety,
    title: "SAFE BY DESIGN",
    body: "Senior-friendly layouts and safety features, built in.",
  },
  {
    icon: IconHome,
    title: "WELLNESS, EVERY DAY",
    body: "Movement, fitness and calm, part of daily life.",
  },
];

export default function WhyAmaya() {
  return (
    <section className="section why" id="why">
      <div className="container">
        <div className="why-grid">
          <div className="why-copy">
            <span className="eyebrow" data-reveal>
              01 &middot; Why Amaya
            </span>
            <h2 className="h2" data-reveal-line>
              <span className="line-mask">
                <span className="line-inner">Designed around a</span>
              </span>
              <span className="line-mask">
                <span className="line-inner">
                  <em>different idea</em> of home
                </span>
              </span>
            </h2><br/>
            <p className="lead" data-reveal data-delay="0.15">
              Amaya brings together the freedom to live independently and the reassurance of support close at hand. Community, care and nature remain part of everyday life, without ever getting in the way of it.
            </p>
            {/* <blockquote className="why-quote" data-reveal data-delay="0.25">
              &ldquo;Not a hospital. Not a hotel. A home.&rdquo;
            </blockquote> */}
          </div>

          <div className="why-media frame" data-reveal-scale>
            <picture>
              <source
                media="(max-width: 820px)"
                srcSet={ASSETS.courtyardMobile}
                width="690"
                height="515"
              />
              <img
                src={ASSETS.courtyardDesktop}
                alt="Courtyard and pool at Amaya"
                width="970"
                height="1110"
                data-parallax
                loading="lazy"
              />
            </picture>
            {/* <span className="why-media-caption">
              Courtyard &amp; pool &middot; Amaya, Medchal
            </span> */}
          </div>
        </div>

        <div className="pillars">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <article
                className="pillar"
                key={p.title}
                data-reveal
                data-delay={`${i * 0.1}`}
              >
                <span className="pillar-rule" data-draw data-delay={`${0.2 + i * 0.1}`} />
                <span className="pillar-icon">
                  <Icon size={30} />
                </span>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-body">{p.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
