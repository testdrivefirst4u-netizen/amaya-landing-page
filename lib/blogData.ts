import { ASSETS } from "@/lib/assets";

export type BlogPost = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  /** Rich-text article body, as HTML produced by the admin's TipTap editor. */
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  publishedDate: string; // ISO date, e.g. "2026-07-10"
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  /** Advanced SEO — all optional, safe to be absent on older/seed documents. */
  focusKeyword?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  /** Social share overrides — fall back to seoTitle/seoDescription when blank. */
  socialTitle?: string;
  socialDescription?: string;
};

type RawBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string };

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function blocksToHtml(blocks: RawBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "h2") return `<h2>${escapeHtml(b.text)}</h2>`;
      if (b.type === "h3") return `<h3>${escapeHtml(b.text)}</h3>`;
      if (b.type === "quote") return `<blockquote><p>${escapeHtml(b.text)}</p></blockquote>`;
      if (b.type === "image")
        return `<figure><img src="${b.src}" alt="${escapeHtml(b.alt)}">${
          b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : ""
        }</figure>`;
      return `<p>${escapeHtml(b.text)}</p>`;
    })
    .join("\n");
}

type RawSeedPost = Omit<BlogPost, "content"> & { content: RawBlock[] };

/**
 * One-time seed content, grounded in Amaya's own established copy (Why
 * Amaya, Life at Amaya, Location, healthcare and residence facts already
 * used elsewhere on the site — nothing here is invented). Imported by
 * lib/blogStore.ts to populate the "blogPosts" MongoDB collection the
 * first time it's empty; after that, the database (editable from
 * /admin/blogs, via the TipTap rich-text editor) is the source of truth.
 */
const RAW_SEED: RawSeedPost[] = [
  {
    title: "What Makes Independent Senior Living Different at Amaya",
    slug: "independent-senior-living-different-at-amaya",
    category: "Lifestyle",
    excerpt:
      "Amaya brings together the freedom to live independently and the reassurance of support close at hand — community, care and nature, without ever getting in the way of everyday life.",
    featuredImage: ASSETS.courtyardDesktop,
    featuredImageAlt: "Courtyard and pool at Amaya",
    author: "Team Amaya",
    publishedDate: "2026-06-01",
    tags: ["independent living", "lifestyle", "community"],
    seoTitle: "What Makes Independent Senior Living Different at Amaya",
    seoDescription:
      "Amaya is designed around a different idea of home — independent, connected and supported, never managed. Here's what that means in everyday life.",
    content: [
      {
        type: "p",
        text: "Not a hospital. Not a hotel. A home. That is the simplest way to describe what Amaya set out to build — a place where independence is never traded away for peace of mind, and where peace of mind never comes at the cost of independence.",
      },
      { type: "h2", text: "Community, by choice" },
      {
        type: "p",
        text: "Shared interests grow into lasting friendships at Amaya. Residents choose how much — or how little — community life they want, from shared dining and events to simply enjoying the privacy of their own home.",
      },
      { type: "h2", text: "Care, close at hand" },
      {
        type: "p",
        text: "Medical care is available when needed, not imposed as a routine. A resident doctor, round-the-clock nursing, physiotherapy and emergency-response support keep help close, while day-to-day life carries on exactly as residents choose to live it.",
      },
      {
        type: "quote",
        text: "Community, care and nature remain part of everyday life, without ever getting in the way of it.",
      },
      { type: "h2", text: "Safe by design, wellness every day" },
      {
        type: "p",
        text: "Senior-friendly layouts and safety features are built into every residence from the ground up — anti-skid flooring, wider doorways and passages, senior-friendly furniture and thoughtfully planned lighting. Movement, fitness and calm are part of daily life, not an afterthought.",
      },
      {
        type: "p",
        text: "It is this combination — freedom, community and care, held together by thoughtful design — that shapes every part of Amaya, from the residences to Club Amaya and the 700-acre reserve forest that surrounds it.",
      },
    ],
  },
  {
    title: "Inside Club Amaya: 35,000 Sq Ft of Everyday Discovery",
    slug: "inside-club-amaya",
    category: "Community",
    excerpt:
      "Dining, wellness, a library, fitness spaces, arts studios and a performance hall — Club Amaya brings 35,000 sq ft of community life under one roof.",
    featuredImage: ASSETS.cardsRoomDesktop,
    featuredImageAlt: "Friends at the card room, Club Amaya",
    author: "Team Amaya",
    publishedDate: "2026-06-15",
    tags: ["club amaya", "amenities", "community"],
    seoTitle: "Inside Club Amaya: Amenities & Community Spaces",
    seoDescription:
      "A closer look at Club Amaya's 35,000 sq ft of dining, wellness, library, fitness, arts and events spaces at Amaya Senior Living, Medchal.",
    content: [
      {
        type: "p",
        text: "At the heart of daily life at Amaya sits Club Amaya — 35,000 square feet of thoughtfully designed spaces for dining, wellness, creativity, fitness and community, all under one beautifully crafted roof.",
      },
      {
        type: "image",
        src: ASSETS.cardsRoomDesktop,
        alt: "Friends at the card room, Club Amaya",
        caption: "The card room, Club Amaya",
      },
      { type: "h2", text: "What's inside" },
      {
        type: "p",
        text: "Club Amaya is organised around six kinds of everyday discovery: dining and social spaces, a library and reading rooms, wellness and therapy rooms, fitness and movement spaces, arts and activity studios, and a performance and events hall.",
      },
      {
        type: "p",
        text: "Together, these form part of over 100 curated amenities across the community — spaces meant to be used often, not admired occasionally.",
      },
      { type: "h2", text: "More to discover, every day" },
      {
        type: "p",
        text: "Whether it is a quiet afternoon in the library, a physiotherapy session, a card game with neighbours, or an evening at the performance hall, Club Amaya is designed so there is always something worth stepping out for — and just as much reason to stay in when you'd rather not.",
      },
    ],
  },
  {
    title: "Living Beside a 700-Acre Reserve Forest",
    slug: "living-beside-a-700-acre-reserve-forest",
    category: "Location",
    excerpt:
      "Amaya sits in Munirabad, Medchal, just off Hyderabad's Outer Ring Road, beside the 700-acre Kandlakoya Reserve Forest — with hospitals and everyday conveniences within easy reach.",
    featuredImage: ASSETS.locationDesktop,
    featuredImageAlt: "Aerial view of the reserve forest beside Amaya",
    author: "Team Amaya",
    publishedDate: "2026-07-01",
    tags: ["location", "medchal", "hyderabad"],
    seoTitle: "Amaya's Location: Beside the Kandlakoya Reserve Forest",
    seoDescription:
      "Amaya is in Munirabad, Medchal, Hyderabad, beside the 700-acre Kandlakoya Reserve Forest and just off the Outer Ring Road — here's what that means for daily life.",
    content: [
      {
        type: "p",
        text: "Just off Hyderabad's Outer Ring Road in Medchal, Amaya keeps hospitals, shopping and everyday conveniences within easy reach — while backing directly onto the 700-acre Kandlakoya Reserve Forest.",
      },
      {
        type: "image",
        src: ASSETS.locationDesktop,
        alt: "Aerial view of the reserve forest beside Amaya",
        caption: "The Kandlakoya Reserve Forest, seen from Amaya",
      },
      { type: "h2", text: "What's nearby" },
      {
        type: "p",
        text: "The ORR Service Road is around 4 minutes away, with the ORR Exit 6 roughly 10 minutes out. MediCiti Hospital is about 15 minutes from Amaya, Kompally around 20 minutes, and KIMS Hospital approximately 25 minutes — distances and travel times that are, of course, indicative and may vary with route and traffic.",
      },
      { type: "h2", text: "Why the forest matters" },
      {
        type: "p",
        text: "A reserve forest at the doorstep is not just a view — it is quieter air, a cooler microclimate, and a daily reminder to slow down. For a community built around unhurried living, that setting was never incidental.",
      },
    ],
  },
  {
    title: "Healthcare at Amaya: Care, Close at Hand",
    slug: "healthcare-at-amaya",
    category: "Healthcare",
    excerpt:
      "A resident doctor, round-the-clock nursing, physiotherapy and emergency-response support keep care close — without ever turning Amaya into a care facility.",
    featuredImage: ASSETS.bedroom,
    featuredImageAlt: "A furnished residence interior at Amaya",
    author: "Team Amaya",
    publishedDate: "2026-07-10",
    tags: ["healthcare", "wellness", "safety"],
    seoTitle: "Healthcare at Amaya Senior Living",
    seoDescription:
      "Amaya keeps healthcare close at hand — a resident doctor, round-the-clock nursing, physiotherapy and emergency-response support — while residents live independently.",
    content: [
      {
        type: "p",
        text: "Amaya is neither a care home nor an assisted-living facility. It is an independent senior-living community where residents live in a home of their own, with healthcare and everyday support available when needed — and never imposed.",
      },
      { type: "h2", text: "What's in place" },
      {
        type: "p",
        text: "A resident doctor, round-the-clock nursing, physiotherapy and emergency-response support keep care close at hand. Specialist consultations, pharmacy access and hospital coordination are also planned as part of the community's healthcare framework.",
      },
      {
        type: "quote",
        text: "Care, close at hand — without ever getting in the way of everyday life.",
      },
      { type: "h2", text: "Designed for safety, not dependency" },
      {
        type: "p",
        text: "Every residence is planned with anti-skid flooring, senior-friendly furniture, safety-assist fixtures, wider doorways and passages, and thoughtful lighting — safety measures built into the architecture itself, so that support is present without being intrusive.",
      },
    ],
  },
  {
    title: "Choosing the Right Residence: From 1 to 3.5 BHK",
    slug: "choosing-the-right-residence",
    category: "Residences",
    excerpt:
      "Amaya offers five residence configurations, from a 1,015.72 sq ft 1 BHK to a 2,455.89 sq ft 3.5 BHK — each planned around light, privacy and easy movement.",
    featuredImage: ASSETS.residence3Desktop,
    featuredImageAlt: "A residence layout at Amaya",
    author: "Team Amaya",
    publishedDate: "2026-07-22",
    tags: ["residences", "bhk", "floor plans"],
    seoTitle: "Amaya Residences: 1 BHK to 3.5 BHK Configurations",
    seoDescription:
      "A guide to Amaya's five residence configurations — 1, 2, 2.5, 3 and 3.5 BHK — their sizes, starting prices and who each layout suits best.",
    content: [
      {
        type: "p",
        text: "Choosing a home at Amaya starts with a simple question: how much space do you need, and for whom? Amaya offers five configurations, each planned around light, privacy and easy movement.",
      },
      { type: "h2", text: "The five configurations" },
      {
        type: "p",
        text: "A 1,015.72 sq. ft. 1 BHK, starting from ₹86 Lac*, is simple, intuitive and filled with light — well suited to a single resident or a couple who prefer a compact home. The 1,525.38 sq. ft. 2 BHK, from ₹138 Lac*, offers comfortable space for everyday life and visiting family.",
      },
      {
        type: "p",
        text: "The 1,731.03 sq. ft. 2.5 BHK, from ₹156 Lac*, adds an adaptable extra room for work, hobbies or guests. The 2,133.65 sq. ft. 3 BHK, from ₹192 Lac*, offers generous proportions with privacy built in, while the 2,455.89 sq. ft. 3.5 BHK, from ₹256 Lac*, is Amaya's most expansive layout.",
      },
      { type: "h2", text: "Built senior-first" },
      {
        type: "p",
        text: "Every configuration shares the same senior-centric foundations: anti-skid flooring, senior-friendly furniture, safety-assist fixtures, wider doorways and passages, and thoughtfully planned lighting.",
      },
      {
        type: "p",
        text: "*Prices are indicative and subject to change. Please contact our sales team for current pricing and availability.",
      },
    ],
  },
  {
    title: "The Institutions That Shaped Vera Vita",
    slug: "the-institutions-that-shaped-vera-vita",
    category: "Founders",
    excerpt:
      "Vera Vita is built by three respected Hyderabad families — Saboo Group, the Badruka family and Northstar Group, and Orient BlackSwan — each bringing a distinct legacy to Amaya.",
    featuredImage: ASSETS.foundersDesktop,
    featuredImageAlt: "The founders of Amaya",
    author: "Team Amaya",
    publishedDate: "2026-08-05",
    tags: ["founders", "vera vita", "legacy"],
    seoTitle: "The Institutions That Shaped Vera Vita",
    seoDescription:
      "Vera Vita, the company behind Amaya, draws on three Hyderabad institutions — Saboo Group, the Badruka family & Northstar Group, and Orient BlackSwan.",
    content: [
      {
        type: "p",
        text: "Vera Vita was not created around an opportunity. It was created around a conviction: that India's next generation of senior living deserves the same long-term thinking that builds enduring institutions. That conviction traces back to three respected Hyderabad families.",
      },
      { type: "h2", text: "Saboo Group — a legacy of enterprise" },
      {
        type: "p",
        text: "A diversified Hyderabad group built over decades on trust and operational excellence, spanning real estate, hospitality, finance and investments, and automobile — including over 200,000 sq ft of commercial real estate developed and one of the city's leading automobile dealership networks.",
      },
      { type: "h2", text: "The Badruka Family & Northstar Group — building and educating Hyderabad" },
      {
        type: "p",
        text: "The Badruka Educational Society, founded in 1950, educates over 4,000 students across commerce, arts, IT, and a dedicated School of Music & Dance. Northstar Group, the family's real-estate arm, develops and manages residential, commercial and infrastructure projects across Hyderabad.",
      },
      { type: "h2", text: "Orient BlackSwan — a century of learning, since 1895" },
      {
        type: "p",
        text: "One of India's most respected educational publishers, Orient BlackSwan serves over 14,000 schools across CBSE, ICSE and State Boards, combining a legacy that began in 1895 with in-house editorial expertise and a nationwide distribution network.",
      },
      { type: "quote", text: "Their industries differ. Their values do not." },
      {
        type: "p",
        text: "From governance and long-term stewardship, to the belief that relationships are the bedrock of any lasting institution, to a quality-first, trust-driven ethos — each family's legacy shapes Vera Vita and, in turn, Amaya.",
      },
    ],
  },
];

export const SEED_POSTS: BlogPost[] = RAW_SEED.map((p) => ({
  ...p,
  content: blocksToHtml(p.content),
}));
