import { ASSETS } from "@/lib/assets";
import FounderPortrait from "./FounderPortrait";

const FOUNDERS = [
  {
    name: "Arudradev Rao",
    desktopSrc: ASSETS.founderArudradevDesktop,
    mobileSrc: ASSETS.founderArudradevMobile,
    role: "01 · Brand & Experience",
    quote: "Every business is a people business, eventually.",
    bio: "Arudra is a Director at Orient BlackSwan, whose roots trace back to 1895. He has spent a decade in education and business development across the subcontinent. An MBA from ISB, he founded his first company, RNC Polymers, straight out of college and made a successful exit before joining OBS full time. He brings a people-first sensibility, centred on learning, empathy, culture and long-term relationships with a strength in building strategic partnerships that create lasting value on all sides.",
    experience:
      " Orient BlackSwan, Wholetime Director · RNC Polymers, Managing Partner",
    education: "PGP (MFAB), Indian School of Business · Owner Manager Programme, SPJIMR · FLAME University",
    focus: ["Brand", "Experience", "Community", "Hospitality"],
    logos: [{ src: "/founders/logos/Arudra/Orient_Blackswan.svg", alt: "Orient BlackSwan" },
    { src: "/founders/logos/Arudra/isb_identity_colour_rgb_positive.svg", alt: "Indian School of Business" },
    { src: "/founders/logos/Arudra/FLAME.svg", alt: "FLAME UNIVERSITY’S" },
    { src: "/founders/logos/dhruv/sp_jain.webp", alt: "SP Jain Global" },
    ],
  },
  {
    name: "Dhruv Badruka",
    desktopSrc: ASSETS.founderDhruvDesktop,
    mobileSrc: ASSETS.founderDhruvMobile,
    role: "02 · Development & Execution",
    quote: "Quality is not a checkpoint. It is built into the process, from structure to spirit.",
    bio: "Dhruv brings a disciplined, entrepreneurial approach to building businesses and communities. At the Northstar Group, he led business development, structuring land transactions and joint ventures while overseeing 250+ acres under development and 150,000 sq ft under construction. He also created an investor-exit platform that delivered returns of up to 25 percent CAGR. His experience is complemented by an MBA from London Business School and a foundation in technology and engineering.",
    experience:
      "Northstar Group, Director of Business Development · Badruka College of Information Technology, Board Member · Hewlett Packard, Research Engineer",
    education: "MBA, London Business School · Owner Management Programme, SP Jain · B.Tech (IT), VIT",
    focus: ["Development", "Execution", "Deal structuring", "Community building"],
    logos: [
      { src: "/founders/logos/dhruv/nortstar.webp", alt: "Northstar Group" },
      { src: "/founders/logos/dhruv/bc.png", alt: "Badruka College of Information Technology" },
      { src: "/founders/logos/dhruv/HP_logo_2025.svg.webp", alt: "Hewlett Packard" },
      { src: "/founders/logos/Tanay/LBS.svg", alt: "London business school" },
      { src: "/founders/logos/dhruv/sp_jain.webp", alt: "SP Jain Global" },
    ],
  },
  {
    name: "Tanay Saboo",
    desktopSrc: ASSETS.founderTanayDesktop,
    mobileSrc: ASSETS.founderTanayMobile,
    role: "03 · Capital & Strategy",
    quote: "The greatest investments compound over decades, not quarters.",
    bio: "Tanay is currently the Chief Growth Officer at the Saboo Group, where he drives growth across its real estate, automobile, and hospitality businesses. His career spans institutional finance and entrepreneurship giving him a long-term perspective on capital allocation and building businesses. A Chartered Accountant with an MBA from London Business School, Tanay brings to Vera Vita the discipline of patient capital: rigour, governance, and a deep interest in healthcare and longevity.",
    experience:
      "Saboo Group, Chief Growth Officer and Director · Mobility Impact Partners, New York · Stratford House, London · Purnartha · Ernst & Young",
    education: "MBA, London Business School · Chartered Accountancy, ICAI · B.Com, HR College",
    focus: ["Capital allocation", "Governance", "Growth strategy", "Healthcare and longevity"],
    logos: [{ src: "/founders/logos/Tanay/saboo_group.png", alt: "Saboo Group" },
    { src: "/founders/logos/Tanay/LBS.svg", alt: "London business school" },
    { src: "/founders/logos/dhruv/sp_jain.webp", alt: "SP Jain Global" },
     { src: "/founders/logos/Tanay/H.R.-COLLEGE-OF-COMMERCE-ECONOMICS-HEADER.png", alt: "H.R.-COLLEGE-OF-COMMERCE-ECONOMICS" },
    //  { src: "/founders/logos/Tanay/logo-icai1.png", alt: "ica" },
    ],
  },

];

export default function FounderProfiles() {
  return (
    <section className="section">
      <div className="container">
        {FOUNDERS.map((f) => (
          <article className="fd-profile" key={f.name}>
            <div className="card-media fd-portrait" data-reveal-scale>
              <FounderPortrait
                name={f.name}
                src={f.desktopSrc}
                mobileSrc={f.mobileSrc}
              />
            </div>

            <div data-reveal data-delay="0.1">
              <span className="eyebrow">{f.role}</span>
              <h2 className="fd-name">{f.name}</h2>
              <blockquote className="fd-quote">&ldquo;{f.quote}&rdquo;</blockquote>
              <p className="fd-bio">{f.bio}</p>

              <dl className="fd-facts">
                <div>
                  <dt>Experience</dt>
                  <dd>{f.experience}</dd>
                </div>
                <div>
                  <dt>Education</dt>
                  <dd>{f.education}</dd>
                </div>
              </dl>

              <div className="fd-focus">
                <span className="fd-focus-label">Focus</span>
                <p className="fd-focus-line">
                  {f.focus.map((item, fi) => (
                    <span key={item}>
                      {fi > 0 && <b>&middot;</b>}
                      {item}
                    </span>
                  ))}
                </p>
              </div>

              {/* {f.logos.length > 0 && (
                <div className="fd-logos">
                  {f.logos.map((logo) => (
                    <img key={logo.src} src={logo.src} alt={logo.alt} loading="lazy" />
                  ))}
                </div>
              )} */}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
