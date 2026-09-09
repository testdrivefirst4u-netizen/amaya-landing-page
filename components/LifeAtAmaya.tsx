"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ASSETS } from "@/lib/assets";
import {
  IconDining,
  IconBook,
  IconWellness,
  IconFitness,
  IconArts,
  IconPerformance,
} from "./Icons";

const FEATURES = [
  { icon: IconDining, title: "Dining and social spaces" },
  { icon: IconBook, title: "Library and reading rooms" },
  { icon: IconWellness, title: "Wellness and therapy rooms" },
  { icon: IconFitness, title: "Fitness and movement spaces" },
  { icon: IconArts, title: "Arts and activity studios" },
  { icon: IconPerformance, title: "Performance and events hall" },
];

// Add more { src, alt, tag } entries here as new Club Amaya photos
// become available.
const CLUB_SLIDES = [
  // {
  //   src: ASSETS.cardsRoomDesktop,
  //   alt: "Club Amaya community and event spaces",
  //   // tag: "Community Spaces",
  // },
   {
    src: '/club/ClubDesktop1040×884-01.webp',
    alt: "Club Amaya community and event spaces",
    // tag: "Community Spaces",
  },
    {
    src: '/club/ClubDesktop1040×884-02.webp',
    alt: "Club Amaya community and event spaces",
    // tag: "Community Spaces",
  },
  {
    src: '/club/ClubDesktop1040×884-03.webp',
    alt: "Club Amaya community and event spaces",
    // tag: "Community Spaces",
  },
    {
    src: '/club/ClubDesktop1040×884-04.webp',
    alt: "Club Amaya community and event spaces",
    // tag: "Community Spaces",
  },
];

export default function LifeAtAmaya() {
  return (
    <section className="section life" id="life">
      <div className="container club-grid">
        <div className="club-media frame" data-reveal-scale>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            // navigation={CLUB_SLIDES.length > 1}
            
            pagination={CLUB_SLIDES.length > 1 ? { clickable: true } : false}
            autoplay={
              CLUB_SLIDES.length > 1
                ? { delay: 4000, disableOnInteraction: false }
                : false
            }
            loop={CLUB_SLIDES.length > 1}
            className="club-swiper"
          >
            {CLUB_SLIDES.map((s, i) => (
              <SwiperSlide className="club-slide" key={i}>
                <img src={s.src} alt={s.alt} loading="lazy" />
                {/* <span className="club-media-tag">{s.tag}</span> */}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div>
          <span className="eyebrow" data-reveal>
            03 &middot; CLUB AMAYA
          </span>
          <h2 className="h2" data-reveal-line>
            <span className="line-mask">
              <span className="line-inner">More to discover</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                <em>every day.</em>
              </span>
            </span><br/>
          </h2>
          <p className="lead" data-reveal data-delay="0.15">
            35,000 square feet of thoughtfully designed spaces for dining,
            wellness, creativity, fitness and community  all under one
            beautifully crafted roof.
          </p>

          <div className="club-features" data-reveal data-delay="0.2">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div className="club-feature" key={f.title}>
                  <span className="club-feature-icon">
                    <Icon size={20} />
                  </span>
                  <span className="club-feature-label">{f.title}</span>
                </div>
              );
            })}
          </div>

          {/* <a className="btn btn-accent" href="#visit" data-reveal data-delay="0.25">
            Explore Club Amaya
          </a> */}
        </div>
      </div>
    </section>
  );
}
