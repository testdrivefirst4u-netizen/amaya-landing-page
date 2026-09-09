const FOUNDERS = ["Dhruv Badruka", "J. Arudradev Rao", "Tanay Saboo"];

export default function FoundersMessage() {
  return (
    <section className="section fd-note" id="founders">
      <div className="fd-note-media" aria-hidden="true">
        <picture>
          <source media="(max-width: 820px)" srcSet="/courtyard/Courtyard_mobile_690×515.webp" />
          <img src="/courtyard/courtyard_Desktop_970×1110.webp" alt="" loading="lazy" />
        </picture>
      </div>
      <div className="container on-dark">
        <span className="eyebrow eyebrow--light" data-reveal>
          A Note from the Founders
        </span>
        <h2 className="h2" data-reveal-line>
          <span className="line-mask">
            <span className="line-inner">
              Built for the people <em>we love.</em>
            </span>
          </span>
        </h2>

        <div className="fd-note-body" style={{ marginTop: "var(--s10)" }} data-reveal data-delay="0.12">
          <p>
            We began with one question. What should life feel like when there
            is finally time to live fully?
          </p>
          <p>
            Seniors, families and experts gave us the same answer.
            Independent, connected and supported. Never managed. That answer
            shapes every part of Amaya, and we would be proud to have our own
            families call it home.
          </p>
        </div>

        <div className="fd-signatures" data-reveal>
          {FOUNDERS.map((name) => (
            <div key={name}>
              <span className="fd-sign-name">{name}</span>
              <span className="fd-sign-role">Founder &middot; Vera Vita</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
