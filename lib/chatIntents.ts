export type Intent =
  | "explore_residences"
  | "pricing"
  | "availability"
  | "healthcare"
  | "amenities"
  | "lifestyle"
  | "location"
  | "floor_plans"
  | "book_visit"
  | "callback"
  | "whatsapp"
  | "talk_to_advisor"
  | "faq"
  | "general_information";

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
 * Strong keywords (worth 2 points) are distinctive enough to trigger an
 * intent on their own. Weak keywords (1 point) are common words that could
 * plausibly appear in an unrelated sentence — on their own they must NOT be
 * enough to claim an intent, or generic phrases (e.g. "can my family visit")
 * get misrouted into the wrong flow instead of honestly falling back.
 */
const STRONG_KEYWORDS: Record<Intent, string[]> = {
  explore_residences: ["bhk", "apartment", "configuration"],
  pricing: ["price", "pricing", "cost", "budget", "lac", "crore"],
  availability: ["availability", "vacant"],
  healthcare: ["healthcare", "nursing", "physiotherapy", "physio", "emergency", "hospital"],
  amenities: ["amenities", "amenity", "facilities", "facility"],
  lifestyle: ["clubhouse", "dining"],
  location: ["located", "medchal", "hyderabad", "address"],
  floor_plans: ["floorplan"],
  book_visit: ["appointment", "schedule visit", "site visit", "book a visit"],
  callback: ["callback", "call back", "call me"],
  whatsapp: ["whatsapp", "whats app"],
  talk_to_advisor: ["advisor", "representative", "salesperson"],
  faq: ["rera", "possession", "maintenance", "registered"],
  general_information: [],
};

const WEAK_KEYWORDS: Record<Intent, string[]> = {
  explore_residences: ["layout", "flat", "explore"],
  pricing: ["rate", "rates", "expensive", "afford", "much"],
  availability: ["available", "stock", "left", "units left"],
  healthcare: ["health", "doctor", "nurse", "medical", "wellness", "care"],
  amenities: ["gym", "fitness", "library", "swimming", "pool"],
  lifestyle: ["lifestyle", "life", "club", "activities", "community", "arts", "hobby", "hobbies"],
  location: ["location", "where", "forest", "orr", "map", "directions", "reach"],
  floor_plans: ["floor", "plan", "plans", "layout plan"],
  book_visit: ["book", "visit", "tour", "meet"],
  callback: ["ring me"],
  whatsapp: [],
  talk_to_advisor: ["agent", "someone", "human", "contact", "speak", "talk", "person"],
  faq: ["legal", "meals", "housekeeping", "grandchildren", "family"],
  general_information: ["amaya", "senior", "living", "about", "information"],
};

/** Order matters: earlier entries win ties, so put more specific intents first. */
const INTENT_PRIORITY: Intent[] = [
  "book_visit",
  "callback",
  "whatsapp",
  "talk_to_advisor",
  "pricing",
  "availability",
  "floor_plans",
  "healthcare",
  "lifestyle",
  "amenities",
  "location",
  "explore_residences",
  "faq",
  "general_information",
];

const ACCEPT_THRESHOLD = 2;

function scoreAgainst(tokenSet: Set<string>, lowerText: string, keywords: string[], weight: number): number {
  let score = 0;
  for (const kw of keywords) {
    const kwTokens = kw.split(" ");
    if (kwTokens.length === 1) {
      if (tokenSet.has(kw)) score += weight;
    } else if (lowerText.includes(kw)) {
      score += weight + 1;
    }
  }
  return score;
}

/**
 * Best-effort intent classification from free text, using weighted keyword
 * overlap. A single generic word (e.g. "visit") is never enough on its own
 * — only a distinctive keyword, or multiple weaker signals together, clear
 * the acceptance threshold. Returns null when nothing clears it; callers
 * should fall back to the FAQ matcher or an honest "I don't know" rather
 * than guessing.
 */
export function classifyIntent(text: string): Intent | null {
  const tokens = tokenize(text);
  if (tokens.length === 0) return null;
  const tokenSet = new Set(tokens);
  const lowerText = text.toLowerCase();

  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENT_PRIORITY) {
    const score =
      scoreAgainst(tokenSet, lowerText, STRONG_KEYWORDS[intent], 2) +
      scoreAgainst(tokenSet, lowerText, WEAK_KEYWORDS[intent], 1);
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  return bestScore >= ACCEPT_THRESHOLD ? best : null;
}
