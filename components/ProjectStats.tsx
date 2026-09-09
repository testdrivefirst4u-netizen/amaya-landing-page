"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ASSETS } from "@/lib/assets";

const STATS = [
  { value: 256, suffix: "", label: "Thoughtfully planned homes" },
  { value: 65, suffix: "%", label: "Open & green" },
  { value: 35, suffix: "k sqft", label: "Club Amaya" },
  { value: 47, suffix: "k sqft", label: "Landscaped areas" },
  { value: 100, suffix: "+", label: "Lifestyle amenities" },
];

// Add more { desktop, mobile, alt, label, value } entries here as new
// project image pairs (desktop + mobile) become available.
const PROJECT_SLIDES = [{
  desktop: ASSETS.infrastructure1,
  mobile: ASSETS.infrastructure1,
  alt: "Amaya infrastructure",
  label: "ARCHITECTURE",
  value: "Designed around light, water and everyday life.",
}, {
  desktop: ASSETS.infrastructure2,
  mobile: ASSETS.infrastructure2,
  alt: "Amaya infrastructure",
  label: "LANDSCAPE",
  value: "Layered gardens bring nature into the heart of Amaya.",
}, {
  desktop: ASSETS.infrastructure3,
  mobile: ASSETS.infrastructure3,
  alt: "Amaya infrastructure",
  label: "FOREST LIVING",
  value: "Everyday life, lived closer to nature.",
},

{
  desktop: ASSETS.yoga,
  mobile: ASSETS.yoga,
  alt: "Amaya architecture rising beside the reserve forest",
  label: "WELLNESS",
  value: "Movement feels better beneath the open sky.",
}, {
  desktop: ASSETS.infrastructure4,
  mobile: ASSETS.infrastructure4,
  alt: "Amenities at Amaya",
  label: "COMMUNITY",
  value: "Shared interests turn neighbours into friends.",
},
{
  desktop: '/Infrastructure/AmenitiesSlides512×340_3.webp',
  mobile: '/Infrastructure/AmenitiesSlides512×340_3.webp',
  alt: "Amenities at Amaya",
  label: "HOSPITALITY",
  value: "Thoughtful dining, served with warmth and ease.",
},
  // {
  //   desktop: ASSETS.architectureDesktop,
  //   mobile: ASSETS.architectureMobile,
  //   alt: "Amaya architecture rising beside the reserve forest",
  //   label: "Architecture",
  //   value: "ARCHITECTUREDesigned around light, water and everyday life.",
  // },




];

export default function ProjectStats() {
  return (
    <section className="section project" id="project">
      <div className="container">
        <div className="project-head">
          <div>
            <span className="eyebrow" data-reveal>
              02 &middot; The Project
            </span>
            <h2 className="h2 h2--light" data-reveal-line>
              <span className="line-mask">
                <span className="line-inner">Hyderabad’s most thoughtfully conceived </span>
              </span>
              <span className="line-mask">
                <span className="line-inner">
                  <em>senior community.</em>
                </span>
              </span>
            </h2>
          </div>
          <p className="project-intro" data-reveal data-delay="0.2">
            Set beside the Kandlakoya Reserve Forest, Amaya offers hospitality, wellness, healthcare and social living which come together to make everyday life easier and more fulfilling.
          </p>
        </div>
        <div className="project-media" data-reveal-scale>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            // navigation={PROJECT_SLIDES.length > 1}
            pagination={PROJECT_SLIDES.length > 1 ? { clickable: true } : false}
            // autoplay={
            //   PROJECT_SLIDES.length > 1
            //     ? { delay: 3500, disableOnInteraction: false }
            //     : false
            // }
            loop={PROJECT_SLIDES.length > 1}
            grabCursor
            spaceBetween={20}
            slidesPerView={1.15}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 24 },
              1024: { slidesPerView: 2.2, spaceBetween: 28 },
            }}
            className="project-swiper"
          >
            {PROJECT_SLIDES.map((s, i) => (
              <SwiperSlide className="project-slide" key={`${s.label}-${i}`}>
                <picture>
                  <source media="(max-width: 820px)" srcSet={s.mobile} />
                  <img src={s.desktop} alt={s.alt} loading="lazy" />
                </picture>
                <div className="project-media-tag">
                  <span className="project-media-tag-label">{s.label}</span>
                  <span className="project-media-tag-value">{s.value}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="project-stats">
          {STATS.map((s, i) => (
            <div className="stat" key={s.label} data-reveal data-delay={`${i * 0.08}`}>
              <div className="stat-value">
                <span data-count={s.value}>0</span>
                <span className="stat-suffix">{s.suffix}</span>
              </div>
              <span className="stat-rule" data-draw data-delay={`${0.3 + i * 0.08}`} />
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
