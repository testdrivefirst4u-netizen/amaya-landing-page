import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import PageHero from "@/components/PageHero";
import VisitBand from "@/components/VisitBand";
import PressLead from "@/components/PressLead";
import PressPairCard from "@/components/PressPairCard";
import PressIndex from "@/components/PressIndex";
import { hasTeluguScript } from "@/lib/richText";
import { listPublishedMedia } from "@/lib/mediaStore";
import { teluguFont } from "@/lib/teluguFont";

const OUTLETS = [
  "The Times of India",
  "Telangana Today",
  "United News of India",
  "V6 Velugu",
  "V3 News",
  "HYBIZTV",
  "బిజినెస్",
];

// Media items are admin-editable in MongoDB — always read fresh, never
// statically prerender this page.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media · Amaya Senior Living by Vera Vita",
  description:
    "In-depth reading on independent senior living, healthcare, residences and community life at Amaya, Medchal, Hyderabad.",
  alternates: { canonical: "/media" },
  openGraph: {
    title: "Media · Amaya Senior Living",
    description:
      "In-depth reading on independent senior living, healthcare, residences and community life at Amaya, Medchal, Hyderabad.",
    type: "website",
    url: "/media",
    images: [
      {
        url: "/og-images/OG_Tag.png",
        width: 1200,
        height: 628,
        alt: "Amaya by Vera Vita | Active Senior Living in Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Media · Amaya Senior Living",
    description:
      "In-depth reading on independent senior living, healthcare, residences and community life at Amaya, Medchal, Hyderabad.",
    images: ["/og-images/OG_Tag.png"],
  },
};

export default async function MediaPage() {
  const items = await listPublishedMedia();
  const [featured, ...rest] = items;
  const pair = rest.slice(0, 2);
  const indexItems = rest.slice(2);

  return (
    <>
      <Nav />
      <main className={teluguFont.variable}>
        <PageHero
          eyebrow="Press"
          titleLines={["Amaya,", "in the news."]}
          sub="Coverage of Vera Vita Living's entry into India's premium senior living sector, and of Amaya in Hyderabad."
        />

        <div className="press-strip">
          <div className="container">
            <div className="press-strip-inner">
              <span className="press-strip-label">As featured in</span>
              {OUTLETS.map((name) => (
                <span className="press-name" key={name} lang={hasTeluguScript(name) ? "te" : undefined}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {featured ? (
          <>
            <section className="section">
              <div className="container">
                <PressLead item={featured} />

                {pair.length > 0 && (
                  <>
                    <hr className="rule" style={{ marginBlock: "clamp(56px, 7vw, 104px)" }} />
                    <div className="pair">
                      {pair.map((item, i) => (
                        <PressPairCard item={item} index={i} key={item.slug} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="section section--tight">
              <div className="container">
                <span className="eyebrow" data-reveal>
                  More coverage
                </span>
                <h2 className="h2" data-reveal style={{ marginBottom: "clamp(32px, 4vw, 56px)" }}>
                  Elsewhere in <em>the press.</em>
                </h2>

                <PressIndex items={indexItems} />

                <div className="enquiries" style={{ marginTop: "clamp(56px, 7vw, 96px)" }} data-reveal>
                  <div>
                    <h3>
                      Media <em>enquiries.</em>
                    </h3>
                    <p>
                      For interviews, imagery, project fact sheets or site visits, our
                      communications team is glad to help.
                    </p>
                  </div>
                  <div className="enquiries-actions">
                    <a className="btn btn-secondary" href="tel:+919553395533">
                      Call +91 95533 95533
                    </a>
                    <a
                      className="btn btn-accent"
                      href="https://wa.me/919553395533"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="section">
            <div className="container">
              <p className="gallery-empty">More stories are coming soon.</p>
            </div>
          </section>
        )}
        <VisitBand />

        <div className="container">
          <p
            style={{
              padding: "24px 0",
              fontSize: ".6875rem",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            All trademarks are the property of their respective owners.
          </p>
        </div>

        <Footer />
      </main>
      <Animations />
    </>
  );
}
