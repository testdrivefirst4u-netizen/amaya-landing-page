import { ASSETS } from "@/lib/assets";

const FOUNDERS =   ["Arudradev Rao","Dhruv Badruka","Tanay Saboo"];

/**
 * 06 · A Note from the Founders
 * Landscape editorial layout: full-width image, heading row,
 * intro line, then the note flowing across two columns.
 */
export default function Founders() {
  return (
    <section className="section founders" id="founders">
      <div className="container">
        <div className="founders-media frame" data-reveal-scale>
          <picture>
            <source
              media="(max-width: 820px)"
              srcSet={ASSETS.foundersMobile}
              width="780"
              height="520"
            />
            <img
              src={ASSETS.foundersDesktop}
              alt="The founders of Amaya"
              width="1760"
              height="1173"
              data-parallax
              loading="lazy"
            />
          </picture>
          {/* <span className="founders-caption">
            The founders &middot; Vera Vita
          </span> */}
        </div>

        <div className="founders-head">
          <span className="eyebrow" data-reveal>
            06 &middot; A Note from the Founders
          </span>
          <h2 className="h2 founders-title" data-reveal-line>
            <span className="line-mask">
              <span className="line-inner">
                Built for the people <em>we love.</em>
              </span>
            </span>
          </h2>
          <p className="founders-intro" data-reveal data-delay="0.15">
            Thank you for taking the time to learn about Amaya.
          </p>
        </div>

        <div className="founders-note" data-reveal data-delay="0.2">
          <p>
            We began with a simple question: what should life feel like when there is finally time to live more fully? From seniors, families and experts, we heard the same answer: independent, connected and supported; never managed.
          </p>
          <p>
            That belief shapes every part of Amaya, from the homes and healthcare to dining and daily life. We are building a lasting community we would be proud to have our own families call home.
            <em> <br />We look forward to welcoming you.</em>
          </p>
        </div>

        <div className="founders-signs" data-reveal data-delay="0.3">
          {FOUNDERS.map((name) => (
            <div className="founders-sign" key={name}>
              <span className="founders-sign-name">{name}</span>
              <span className="founders-sign-title">
                Founder &middot; Vera Vita
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
