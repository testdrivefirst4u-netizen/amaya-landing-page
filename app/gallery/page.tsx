import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import GalleryGrid, { type GalleryItem } from "@/components/GalleryGrid";
import { ASSETS } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Gallery · Amaya Senior Living by Vera Vita",
  description:
    "A closer look at Amaya — the residences, Club Amaya, and the 700-acre reserve forest that surrounds it, in Medchal, Hyderabad.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery · Amaya Senior Living",
    description:
      "A closer look at Amaya — the residences, Club Amaya, and the 700-acre reserve forest that surrounds it, in Medchal, Hyderabad.",
    type: "website",
    url: "/gallery",
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
    title: "Gallery · Amaya Senior Living",
    description:
      "A closer look at Amaya — the residences, Club Amaya, and the 700-acre reserve forest that surrounds it, in Medchal, Hyderabad.",
    images: ["/og-images/OG_Tag.png"],
  },
};

const GALLERY: GalleryItem[] = [
  {
    desktop: ASSETS.architectureDesktop,
    mobile: ASSETS.architectureMobile,
    alt: "Amaya architecture rising beside the reserve forest",
    caption: "Architecture, beside the forest",
    category: "Architecture",
  },
  // {
  //   desktop: ASSETS.heroImage,
  //   mobile: ASSETS.heroImage,
  //   alt: "Amaya, beside the reserve forest",
  //   caption: "Amaya, at the forest’s edge",
  //   category: "Architecture",
  // },
  {
    desktop: ASSETS.courtyardDesktop,
    mobile: ASSETS.courtyardMobile,
    alt: "Courtyard and pool at Amaya",
    caption: "Courtyard & pool · Club Amaya",
    category: "Landscape",
  },
  {
    desktop: ASSETS.bedroom,
    mobile: ASSETS.bedroom,
    alt: "A furnished residence interior at Amaya",
    caption: "A furnished residence interior",
    category: "Amenities",
  },
  {
    desktop: ASSETS.cardsRoomDesktop,
    mobile: ASSETS.cardsRoomMobile,
    alt: "Friends at the card room, Club Amaya",
    caption: "The card room · Club Amaya",
    category: "Community",
  },

  // {
  //   desktop: ASSETS.locationDesktop,
  //   mobile: ASSETS.locationMobile,
  //   alt: "Aerial view of the reserve forest beside Amaya",
  //   caption: "The Kandlakoya Reserve Forest",
  //   category: "Location",
  // },
  {
    desktop: ASSETS.galleryHeroFacade,
    mobile: ASSETS.galleryHeroFacade,
    alt: "The Amaya facade",
    caption: "The Amaya facade",
    category: "Architecture",
  },
  {
    desktop: ASSETS.galleryLocationAerial,
    mobile: ASSETS.galleryLocationAerial,
    alt: "Aerial view of Amaya within the reserve forest",
    caption: "Set within the reserve forest",
    category: "Location",
  },
  {
    desktop: ASSETS.galleryArrivalDriveway,
    mobile: ASSETS.galleryArrivalDriveway,
    alt: "The arrival driveway at Amaya",
    caption: "The arrival driveway",
    category: "Architecture",
  },
  {
    desktop: ASSETS.galleryCentralCourtyard,
    mobile: ASSETS.galleryCentralCourtyard,
    alt: "The central garden courtyard at Amaya",
    caption: "The central garden courtyard",
    category: "Landscape",
  },
  {
    desktop: ASSETS.galleryPoolCanopy,
    mobile: ASSETS.galleryPoolCanopy,
    alt: "Pool courtyard beneath the canopy at Amaya",
    caption: "Pool courtyard, beneath the canopy",
    category: "Amenities",
  },
  {
    desktop: ASSETS.galleryWaterFeature,
    mobile: ASSETS.galleryWaterFeature,
    alt: "A reflective water feature at Amaya",
    caption: "A reflective water feature",
    category: "Amenities",
  },
  {
    desktop: ASSETS.galleryPoolReflection,
    mobile: ASSETS.galleryPoolReflection,
    alt: "Poolside reflections at Amaya",
    caption: "Poolside reflections",
    category: "Amenities",
  },
  {
    desktop: ASSETS.galleryAmphitheatre,
    mobile: ASSETS.galleryAmphitheatre,
    alt: "The stepped amphitheatre garden at Amaya",
    caption: "The stepped amphitheatre garden",
    category: "Community",
  },
  {
    desktop: ASSETS.galleryWellnessGrove,
    mobile: ASSETS.galleryWellnessGrove,
    alt: "A quiet seating grove at Amaya",
    caption: "A quiet seating grove",
    category: "Wellness",
  },
  {
    desktop: ASSETS.galleryColonnade,
    mobile: ASSETS.galleryColonnade,
    alt: "Colonnade detail at Amaya",
    caption: "Colonnade detail",
    category: "Architecture",
  },
  {
    desktop: ASSETS.galleryOverviewAerial,
    mobile: ASSETS.galleryOverviewAerial,
    alt: "Aerial view of the courtyard and pool at Amaya",
    caption: "Aerial view of the courtyard and pool",
    category: "Landscape",
  },
  {
    desktop: ASSETS.galleryBetweenBlocks,
    mobile: ASSETS.galleryBetweenBlocks,
    alt: "Landscaped walkway between residential blocks at Amaya",
    caption: "Landscaped walkway between blocks",
    category: "Landscape",
  },
];

export default function GalleryPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="gallery-hero">
          <div className="container">
            <span className="eyebrow" data-reveal>
              Gallery
            </span>
            <h1 className="gallery-hero-title" data-reveal-line>
              <span className="line-mask">
                <span className="line-inner">A glimpse of Amaya.</span>
              </span>
            </h1>
            <p className="gallery-hero-sub" data-reveal data-delay="0.15">
              Architectural renders and visualisations. More to follow as the
              project develops.
            </p>
          </div>
        </section>

        <section className="gallery-page">
          <div className="container">
            <GalleryGrid items={GALLERY} />
          </div>
        </section>
        <Footer />
      </main>
      <Animations />
    </>
  );
}
