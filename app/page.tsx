import Animations from "@/components/Animations";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhyAmaya from "@/components/WhyAmaya";
import ProjectStats from "@/components/ProjectStats";
import LifeAtAmaya from "@/components/LifeAtAmaya";
import Residences from "@/components/Residences";
import Location from "@/components/Location";
import Founders from "@/components/Founders";
import Faq from "@/components/Faq";
import VisitCta from "@/components/VisitCta";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhyAmaya />
        <ProjectStats />
        <LifeAtAmaya />
        <Residences />
        <Location />
        <Founders />
        <Faq />
        <VisitCta />
        <Footer />
      </main>
      <Animations />
    </>
  );
}
