export type FaqEntry = {
  q: string;
  a: string;
  /** Extra words that should also match this answer, beyond the question text itself. */
  keywords?: string[];
};

/**
 * The public FAQ accordion on the homepage (components/Faq.tsx) — exactly
 * these 6, unchanged. The chatbot draws on this list too, plus the broader
 * CHATBOT_ONLY_FAQS below, without adding anything extra to this page.
 */
export const FAQS: FaqEntry[] = [
  {
    q: "How is Vera Vita Living LLP connected to Amaya Senior Living?",
    a: "Amaya Senior Living is a brand of Vera Vita Living LLP. Vera Vita Living LLP is the company developing Amaya Senior Living, located in Medchal, Hyderabad.",
    keywords: [ "home"],
   
  },
  {
    q: "Is Amaya a care home or assisted living?",
    a: "Neither. Amaya is an independent senior-living community where you live in a home of your own, with healthcare and everyday support available when needed and never imposed.",
    keywords: ["care", "assisted", "nursing", "home", "independent"],
   
  },
  {
    q: "What healthcare support is available?",
    a: "A resident doctor, round-the-clock nursing, physiotherapy and emergency-response support keep care close at hand. Specialist consultations, pharmacy access and hospital coordination are also planned.",
    keywords: ["healthcare", "doctor", "nurse", "nursing", "medical", "emergency", "hospital"],

  },
  {
    q: "What does a typical day at Amaya look like?",
    a: "There is no fixed timetable. Residents may choose from wellness, recreation, dining and social activities, or simply enjoy the privacy of home.",
    keywords: ["day", "schedule", "routine", "activities", "lifestyle"],

  },
  {
    q: "What residence sizes are available?",
    a: "Amaya offers five layouts, from a 1,015.72 sq. ft. 1 BHK to a 2,455.89 sq. ft. 3.5 BHK. Each is planned around light, privacy and easy movement.",
    keywords: ["size", "sizes", "bhk", "layout", "sqft", "sq", "residence", "residences", "apartment", "flat"],
  
  },
  {
    q: "Can family visit or stay?",
    a: "Yes. Guest suites, hospitality services and shared spaces make it easy to welcome family and spend meaningful time together.",
    keywords: ["family", "guest", "guests", "visit", "stay", "kids", "children"],
  
  },
  {
    q: "What services are available?",
    a: "Amaya brings together hospitality, healthcare, dining, housekeeping, security, concierge and lifestyle services. Certain personalised services may be chargeable.",
    keywords: ["services", "housekeeping", "security", "concierge", "dining", "food"],
  
  },
];

/**
 * Extra ground-truth Q&A the chatbot can draw on, beyond the homepage's
 * public accordion above — never shown on the homepage itself.
 */
export const CHATBOT_ONLY_FAQS: FaqEntry[] = [
  {
    q: "What is the price of homes at Amaya?",
    a: "Homes at Amaya start from ₹86 Lac* for a 1 BHK, with larger layouts available up to a 3.5 BHK. For current pricing and availability, our advisors are a call or WhatsApp away.",
    keywords: ["price", "pricing", "cost", "budget", "lac", "crore", "cr", "rate", "rates", "expensive", "afford"],
  },
  {
    q: "Where is Amaya located?",
    a: "Amaya is in Munirabad, Medchal, Hyderabad — just off the Outer Ring Road, beside the 700-acre Kandlakoya Reserve Forest.",
    keywords: ["location", "located", "where", "address", "medchal", "hyderabad", "forest", "orr"],
  },
  {
    q: "What amenities does Club Amaya offer?",
    a: "Club Amaya spans 35,000 sq ft, with dining, wellness, a library, fitness spaces, arts and activity studios, and a performance and events hall — part of 100+ curated amenities across the community.",
    keywords: ["club", "clubhouse", "amenities", "amenity", "facilities", "gym", "fitness", "library", "wellness"],
  },
  {
    q: "How do I book a visit?",
    a: "Use the “Book a Visit” button anywhere on the site to share your name, email, phone and a preferred date — our team will call to confirm. You're also welcome to just call or WhatsApp us directly.",
    keywords: ["book", "visit", "appointment", "tour", "schedule", "meet"],
  },
  {
    q: "How can I contact Amaya?",
    a: "Call or WhatsApp us at +91 95533 95533, or visit the Amaya Experience Centre in Munirabad, Medchal — open Monday to Saturday, 10:00 AM to 6:00 PM.",
    keywords: ["contact", "call", "phone", "number", "whatsapp", "reach", "email", "talk"],
  },
];

const STOPWORDS = new Set([
  "is", "are", "the", "a", "an", "of", "to", "in", "and", "or", "what",
  "how", "can", "do", "does", "i", "you", "for", "at", "on", "with", "my",
  "me", "please", "tell", "about", "there", "any", "it", "will", "would",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Scores every FAQ by token overlap with the visitor's question and returns
 * the best match, or null if nothing scores above the noise floor.
 */
export function findBestFaq(question: string): FaqEntry | null {
  const qTokens = new Set(tokenize(question));
  if (qTokens.size === 0) return null;

  let best: FaqEntry | null = null;
  let bestScore = 0;

  for (const faq of [...FAQS, ...CHATBOT_ONLY_FAQS]) {
    // Deduped to a Set — the question text and the keywords list often
    // repeat the same word (e.g. "residence" in both), which must only
    // count once or a single shared generic word inflates the score.
    const faqTokens = new Set(tokenize(`${faq.q} ${(faq.keywords ?? []).join(" ")}`));
    let score = 0;
    for (const t of faqTokens) {
      if (qTokens.has(t)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  // Require at least two overlapping terms — a single generic shared word
  // (e.g. "residence") is not enough signal and would otherwise confidently
  // answer the wrong question instead of honestly deferring.
  return bestScore >= 2 ? best : null;
}
