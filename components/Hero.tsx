"use client";

import { useEffect, useRef } from "react";
import { ASSETS } from "@/lib/assets";
import { useBookVisit } from "./BookVisitContext";

export default function Hero() {
  const { open } = useBookVisit();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Safari can block autoplay on a video with an audio track (this one has
  // one) if it isn't certain the video is muted before playback starts —
  // the `muted` attribute alone sometimes loses that race. Setting `.muted`
  // imperatively and calling `.play()` ourselves is the reliable fix.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-media" data-hero-media>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // poster={ASSETS.heroImage}
          src={ASSETS.heroVideo}
        />
        <div className="hero-scrim" />
      </div>

      <div className="hero-content container">
        <span className="hero-eyebrow" data-hero>
          Senior Living by Vera Vita &middot; Medchal, Hyderabad
        </span>

        <h1 className="hero-title" data-hero-line>
          <span className="line-mask">
            <span className="line-inner">Independent living,</span>
          </span>
          <span className="line-mask">
            <span className="line-inner">
              <em>beautifully supported.</em>
            </span>
          </span>
        </h1>

        <p className="hero-sub" data-hero>
          Thoughtfully planned senior living beside the Kandlakoya Reserve Forest.
        </p>

        <div className="hero-ctas" data-hero>
          <button className="btn btn-primary" type="button" onClick={open}>
            Book a Visit
          </button>
          <a className="btn btn-outline-light" href="#residences">
            Explore the Residences
          </a>
        </div>
      </div>

      <div className="hero-meta" data-hero>
        <div className="hero-meta-grid container">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Homes from</span>
            <span className="hero-meta-value">&#8377;86 Lac*</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label" style={{ marginRight: "4px" }}>Setting</span>
            <span className="hero-meta-value">By the reserve forest</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Clubhouse</span>
            <span className="hero-meta-value">35,000 sq ft</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Amenities</span>
            <span className="hero-meta-value">100+ curated</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll" data-hero aria-hidden>
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
