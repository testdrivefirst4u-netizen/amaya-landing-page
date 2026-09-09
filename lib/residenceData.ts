import { ASSETS } from "@/lib/assets";

export type ResidenceUnit = {
  type: string;
  sqft: string;
  price: string;
  tagline: string;
  desktop: string;
  mobile: string;
};

/**
 * Shared by the Residences section (components/Residences.tsx) and the
 * chatbot (components/ChatWidget.tsx) so both read from one source of
 * truth — real configurations, areas and prices, never invented.
 */
export const UNITS: ResidenceUnit[] = [
  {
    type: "1 BHK", sqft: "1,015.72", price: "₹86 Lac", tagline: "Simple, intuitive and filled with light.",
    desktop: ASSETS.residence1Desktop, mobile: ASSETS.residence1Mobile,
  },
  {
    type: "2 BHK", sqft: "1,525.38", price: "₹138 Lac", tagline: "Comfortable space for everyday life and visiting family.",
    desktop: ASSETS.residence2Desktop, mobile: ASSETS.residence2Mobile,
  },
  {
    type: "2.5 BHK", sqft: "1,731.03", price: "₹156 Lac", tagline: "An adaptable extra room for work, hobbies or guests.",
    desktop: ASSETS.residence3Desktop, mobile: ASSETS.residence3Mobile,
  },
  {
    type: "3 BHK", sqft: "2,133.65", price: "₹192 Lac", tagline: "Generous proportions with privacy built in.",
    desktop: ASSETS.residence4Desktop, mobile: ASSETS.residence4Mobile,
  },
  {
    type: "3.5 BHK", sqft: "2,455.89", price: "₹256 Lac", tagline: "Amaya’s most expansive layout.",
    desktop: ASSETS.residence5Desktop, mobile: ASSETS.residence5Mobile,
  },
];

export const RES_FEATURES = [
  "Anti-skid flooring",
  "Senior-friendly furniture",
  "Safety-assist fixtures",
  "Wider doorways and passages",
  "Thoughtfully planned lighting",
  "Senior-centric amenities",
];
