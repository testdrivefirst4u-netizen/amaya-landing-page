"use client";

import { useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { SITE_DOMAIN, truncate } from "./seoUtils";
import { ikTransform, IK_THUMB } from "@/lib/imagekitUrl";

type Network = "facebook" | "linkedin" | "x";

const NETWORKS: { key: Network; label: string; Icon: typeof FaFacebookF }[] = [
  { key: "facebook", label: "Facebook", Icon: FaFacebookF },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedinIn },
  { key: "x", label: "X", Icon: FaXTwitter },
];

export default function SocialPreview({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  const [active, setActive] = useState<Network>("facebook");

  const displayTitle = title || "Your social title appears here";

  return (
    <div className="social-preview">
      <div className="social-tabs" role="tablist" aria-label="Social network preview">
        {NETWORKS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={`social-tab ${active === key ? "is-active" : ""}`}
            onClick={() => setActive(key)}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {active === "facebook" && (
        <div className="social-card social-card--facebook">
          <div className="social-card-media">
            {image ? (
              <img src={ikTransform(image, IK_THUMB)} alt="" />
            ) : (
              <span className="social-card-media-empty">1200 × 630</span>
            )}
          </div>
          <div className="social-card-body">
            <span className="social-card-domain">{SITE_DOMAIN.toUpperCase()}</span>
            <p className="social-card-title">{truncate(displayTitle, 100)}</p>
            <p className="social-card-desc">{truncate(description || "Your description appears here.", 150)}</p>
          </div>
        </div>
      )}

      {active === "linkedin" && (
        <div className="social-card social-card--linkedin">
          <div className="social-card-media">
            {image ? (
              <img src={ikTransform(image, IK_THUMB)} alt="" />
            ) : (
              <span className="social-card-media-empty">1200 × 630</span>
            )}
          </div>
          <div className="social-card-body">
            <p className="social-card-title">{truncate(displayTitle, 100)}</p>
            <span className="social-card-domain">{SITE_DOMAIN}</span>
          </div>
        </div>
      )}

      {active === "x" && (
        <div className="social-card social-card--x">
          <div className="social-card-media">
            {image ? (
              <img src={ikTransform(image, IK_THUMB)} alt="" />
            ) : (
              <span className="social-card-media-empty">1200 × 630</span>
            )}
          </div>
          <div className="social-card-body">
            <span className="social-card-domain">{SITE_DOMAIN}</span>
            <p className="social-card-title">{truncate(displayTitle, 70)}</p>
            <p className="social-card-desc">{truncate(description || "Your description appears here.", 125)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
