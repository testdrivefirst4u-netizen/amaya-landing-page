import type { Metadata } from "next";
import "./founders.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import FoundersHero from "@/components/founders/FoundersHero";
import FoundersIntro from "@/components/founders/FoundersIntro";
import FounderProfiles from "@/components/founders/FounderProfiles";
import FoundersSynergy from "@/components/founders/FoundersSynergy";
import FoundersMessage from "@/components/founders/FoundersMessage";
import FoundersInstitutions from "@/components/founders/FoundersInstitutions";
import VisitBand from "@/components/VisitBand";


export const metadata: Metadata = {
  title: "The People Behind Vera Vita | Vera Vita",
  description:
    "Meet the people behind Vera Vita — three Hyderabad families bringing together capital, development, brand, experience and a shared vision for purpose-driven senior living.",
};

export default function FoundersPage() {
  return (
    <>
      <Nav />
      <main>
        <FoundersHero />
        <FoundersIntro />
        <FounderProfiles />
        {/* <FoundersSynergy /> */}
        <FoundersMessage />
        {/* <FoundersInstitutions /> */}
        {/* <FoundersTimeline /> */}
        <VisitBand />
        <Footer />
      </main>
      <Animations />
    </>
  );
}
