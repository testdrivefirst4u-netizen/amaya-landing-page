import { ASSETS } from "@/lib/assets";
import { IconLocation } from "./Icons";

const DISTANCES = [
  { place: "ORR Service Road", mins: 4 },
  { place: "ORR Exit 6", mins: 10 },
  { place: "MediCiti Hospital", mins: 15 },
  { place: "Kompally", mins: 20 },
  { place: "KIMS Hospital", mins: 25 },
];

const MAX = 25;

export default function Location() {
  return (
    <section className="section location" id="location">
      <div className="container">
        <div className="loc-grid">
          <div className="loc-copy">
            <span className="eyebrow" data-reveal>
              05 &middot; Location
            </span>
            <h2 className="h2" data-reveal-line>
              <span className="line-mask">
                <span className="line-inner">Beside a 700-acre</span>
              </span>
              <span className="line-mask">
                <span className="line-inner">
                  <em>reserve forest.</em>
                </span>
              </span>
            </h2>
            <p className="lead" data-reveal data-delay="0.15">
              Just off Hyderabad&rsquo;s Outer Ring Road in Medchal, Amaya
              keeps hospitals, shopping and everyday conveniences within easy
              reach.
            </p>

            <div className="loc-distances">
              {DISTANCES.map((d, i) => (
                <div className="loc-row" key={d.place} data-reveal data-delay={`${i * 0.07}`}>
                  <span className="loc-place">{d.place}</span>
                  <span className="loc-track">
                    <span
                      className="loc-bar"
                      data-draw
                      data-delay={`${0.2 + i * 0.07}`}
                      style={{ width: `${Math.max(10, (d.mins / MAX) * 100)}%` }}
                    />
                  </span>
                  <span className="loc-mins">
                    <span data-count={d.mins}>0</span> min
                  </span>
                </div>
              ))}
            </div>

            <p className="loc-note" data-reveal>
              <IconLocation size={16} /> Munirabad, Medchal &middot; Hyderabad,
              Telangana
            </p>
            <p className="loc-disclaimer" data-reveal>
              Distances and travel times are indicative and may vary with
              route and traffic conditions.
            </p>
          </div>

          <div className="loc-media-wrap">
            <div className="loc-media frame" data-reveal-scale>
              <picture>
                <source
                  media="(max-width: 820px)"
                  srcSet={ASSETS.locationMobile}
                  width="690"
                  height="515"
                />
                <img
                  src={ASSETS.locationDesktop}
                  alt="Aerial view of the reserve forest beside Amaya"
                  width="965"
                  height="1060"
                  data-parallax
                  loading="lazy"
                />
              </picture>
            </div>
            <span className="loc-media-caption">
              The Kandlakoya Reserve Forest, seen from Amaya.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
