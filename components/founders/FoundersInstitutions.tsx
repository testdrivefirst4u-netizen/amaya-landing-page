type Stat = { value: string; label: string };

type Institution = {
  name: string;
  meta: string;
  body: string;
  stats: Stat[];
  inherits: string;
};

const INSTITUTIONS: Institution[] = [
  {
    name: "Saboo Group",
    meta: "Real Estate · Hospitality · Finance · Automobile",
    body: "A Hyderabad group built over decades across real estate, hospitality, finance and automobile. More than 200,000 sq ft of commercial development, and one of the city's leading dealership networks. Built patiently, on relationships.",
    stats: [
      { value: "200,000+ sq ft", label: "Commercial developed" },
      { value: "15,000+", label: "Cars sold" },
      { value: "150,000+", label: "Serviced annually" },
    ],
    inherits: "From here, Vera Vita inherits governance and long-term stewardship.",
  },
  {
    name: "The Badruka Family & Northstar Group",
    meta: "Education · The Arts · Real Estate",
    body: "Badruka Educational Society has taught Hyderabad since 1950, with a Management School and a School of Music and Dance. Northstar develops and manages residential, commercial and infrastructure projects across the city, and manages more than half of what it builds.",
    stats: [
      { value: "Since 1950", label: "Educating Hyderabad" },
      { value: "4,000+", label: "Students each year" },
      { value: "250 + Acres", label: "Developed and Sold" },
    ],
    inherits: "From here, Vera Vita inherits the belief that relationships, not transactions, are the bedrock.",
  },
  {
    name: "Orient BlackSwan",
    meta: "Educational Publishing · Since 1895",
    body: "One of India's most respected educational publishers. It serves 14,000 schools across CBSE, ICSE and State Boards, through a nationwide network and more than 1,000 teacher workshops a year.",
    stats: [
      { value: "1895", label: "Established" },
      { value: "14,000+", label: "Schools served" },
      { value: "6M+", label: "Students each year" },
    ],
    inherits: "From here, Vera Vita inherits quality, trust and academic rigour.",
  },
];

export default function FoundersInstitutions() {
  return (
    <section className="section section--alt">
      <div className="container">
        <span className="eyebrow" data-reveal>
          Institutions
        </span>
        <h2 className="h2" data-reveal>
          The institutions <em>that shaped us.</em>
        </h2>
        <p
          className="lead"
          style={{ marginTop: "var(--s6)", marginBottom: "clamp(36px, 4.5vw, 64px)" }}
          data-reveal
          data-delay="0.1"
        >
          Enterprise, education, the arts, and a long view.
        </p>

        {INSTITUTIONS.map((inst) => (
          <div className="fd-inst" key={inst.name} data-reveal>
            <div className="fd-inst-grid">
              <div>
                <h3 className="fd-inst-name">{inst.name}</h3>
                <span className="fd-inst-meta">{inst.meta}</span>
              </div>
              <div>
                <p className="fd-inst-body">{inst.body}</p>
                <div className="fd-stats">
                  {inst.stats.map((s) => (
                    <div className="fd-stat" key={s.label}>
                      <span className="fd-stat-value">{s.value}</span>
                      <span className="fd-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className="fd-inherit">{inst.inherits}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
