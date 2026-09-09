const CIRCLES = [
  {
    name: "Tanay Saboo",
    role: "Capital & Strategy",
    tags: ["Capital", "Strategy", "Governance", "Investments", "Healthcare"],
    mod: "1",
  },
  {
    name: "Dhruv Badruka",
    role: "Development & Execution",
    tags: ["Real Estate", "Development", "Execution", "Institution Building", "Community"],
    mod: "2",
  },
  {
    name: "Arudradev Rao",
    role: "Brand & Experience",
    tags: ["Brand", "Experience", "Education", "Culture", "Hospitality"],
    mod: "3",
  },
];

export default function FoundersSynergy() {
  return (
    <section className="section fd-synergy">
      <div className="container">
        <span className="eyebrow eyebrow--bare" data-reveal>
          Why We Work Together
        </span>
        <h2 className="fd-synergy-title" data-reveal-line>
          <span className="line-mask">
            <span className="line-inner">Why We Work Together</span>
          </span>
        </h2>
        <p className="fd-synergy-sub" data-reveal data-delay="0.1">
          Every major decision brings together investment discipline,
          resident experience and long-term institution building.
        </p>

        {/* Desktop / tablet: interconnected circles. Its CSS counterpart,
            .fd-venn-list below, is the mobile layout for the same content —
            each is display:none on the other's breakpoint, so exactly one
            copy is ever in the accessibility tree. */}
        <div className="fd-venn" data-reveal-fade data-delay="0.15">
          {CIRCLES.map((c) => (
            <div className={`fd-venn-circle fd-venn-circle--${c.mod}`} key={c.name}>
              <div className="fd-venn-content">
                <span className="fd-venn-name">{c.name}</span>
                <span className="fd-venn-role">{c.role}</span>
                <span className="fd-venn-tags">{c.tags.join(" · ")}</span>
              </div>
            </div>
          ))}
          <div className="fd-venn-center">
            <span className="fd-venn-center-name">Vera Vita</span>
            <span className="fd-venn-center-tag">Purpose-driven living</span>
          </div>
        </div>

        {/* Mobile: same content, vertical relationship structure */}
        <div className="fd-venn-list">
          {CIRCLES.map((c) => (
            <div className="fd-venn-list-item" key={c.name}>
              <span className="fd-venn-list-name">{c.name}</span>
              <span className="fd-venn-list-role">{c.role}</span>
              <span className="fd-venn-list-tags">{c.tags.join(" · ")}</span>
            </div>
          ))}
          <div className="fd-venn-list-item fd-venn-list-center">
            <span className="fd-venn-list-name">Vera Vita</span>
            <span className="fd-venn-list-role">Purpose-driven living</span>
          </div>
        </div>
      </div>
    </section>
  );
}
