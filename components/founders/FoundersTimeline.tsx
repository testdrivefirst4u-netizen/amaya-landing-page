const MILESTONES = [
  { year: "1895", name: "Orient BlackSwan", tag: "Educational Publishing" },
  { year: "1950", name: "Badruka Educational Society", tag: "Education & The Arts" },
  { year: "Decades of enterprise", name: "Saboo Group", tag: "Business & Investments" },
  { year: "2001", name: "Kalpataru", tag: "Music & Culture" },
  { year: "2024", name: "Vera Vita", tag: "Purpose-driven Living" },
];

export default function FoundersTimeline() {
  return (
    <section className="section fd-timeline-section">
      <div className="container">
        <span className="eyebrow eyebrow--bare" data-reveal style={{ justifyContent: "center" }}>
          Our Legacy
        </span>
        <h2 className="h2" data-reveal-line style={{ textAlign: "center" }}>
          <span className="line-mask">
            <span className="line-inner">Three legacies,</span>
          </span>
          <span className="line-mask">
            <span className="line-inner">
              <em>one future.</em>
            </span>
          </span>
        </h2>

        <div className="fd-timeline">
          {MILESTONES.map((m, i) => (
            <div
              className="fd-timeline-item"
              key={m.name}
              data-reveal
              data-delay={`${i * 0.08}`}
            >
              <span className="fd-timeline-dot" />
              <span className="fd-timeline-year">{m.year}</span>
              <p className="fd-timeline-name">{m.name}</p>
              <p className="fd-timeline-tag">{m.tag}</p>
            </div>
          ))}
        </div>

        <p className="fd-timeline-closing" data-reveal>
          Amaya is the first expression of that shared future.
        </p>
      </div>
    </section>
  );
}
