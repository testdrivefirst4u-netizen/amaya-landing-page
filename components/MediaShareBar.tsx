"use client";

import { useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { FiLink } from "react-icons/fi";

export default function MediaShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on Facebook",
      Icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Share on LinkedIn",
      Icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Share on X",
      Icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "Share on WhatsApp",
      Icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="article-share-bar">
      <span className="article-share-label">Share this</span>
      <div className="article-share-links">
        {links.map(({ label, Icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="article-share-btn"
            aria-label={label}
            title={label}
          >
            <Icon size={15} />
          </a>
        ))}
        <button
          type="button"
          className="article-share-btn"
          onClick={handleCopy}
          aria-label="Copy link"
          title="Copy link"
        >
          <FiLink size={15} />
        </button>
        {copied && <span className="article-share-copied">Link copied</span>}
      </div>
    </div>
  );
}
