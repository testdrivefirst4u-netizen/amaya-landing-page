/**
 * Verified facts the chatbot is allowed to state, transcribed from the
 * site's own sections (Location.tsx, LifeAtAmaya.tsx, Faq.tsx, Footer.tsx)
 * — never invented. Residence configs/prices live in lib/residenceData.ts
 * and general FAQs in lib/faqData.ts; this file holds the rest.
 */

export const ADDRESS = "Munirabad, Medchal, Hyderabad, Telangana";

export const LOCATION_SUMMARY =
  "Amaya is in Munirabad, Medchal, Hyderabad — just off the Outer Ring Road, beside the 700-acre Kandlakoya Reserve Forest.";

export const DISTANCES = [
  { place: "ORR Service Road", mins: 4 },
  { place: "ORR Exit 6", mins: 10 },
  { place: "MediCiti Hospital", mins: 15 },
  { place: "Kompally", mins: 20 },
  { place: "KIMS Hospital", mins: 25 },
];

export const NEARBY_HOSPITALS = DISTANCES.filter((d) => /hospital/i.test(d.place));

export const GOOGLE_MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Amaya Senior Living, " + ADDRESS
)}`;

export const CLUB_AMAYA_SUMMARY =
  "Club Amaya spans 35,000 sq ft of thoughtfully designed spaces for dining, wellness, creativity, fitness and community — all under one beautifully crafted roof.";

export const CLUB_FEATURES = [
  "Dining and social spaces",
  "Library and reading rooms",
  "Wellness and therapy rooms",
  "Fitness and movement spaces",
  "Arts and activity studios",
  "Performance and events hall",
];

export const HEALTHCARE_SUMMARY =
  "A resident doctor, round-the-clock nursing, physiotherapy and emergency-response support keep care close at hand. Specialist consultations, pharmacy access and hospital coordination are also planned.";

export const RERA_NUMBER = "P02200011109";

export const VISIT_CENTRE_HOURS = "Monday to Saturday, 10:00 AM to 6:00 PM";
