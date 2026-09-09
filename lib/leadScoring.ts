export type LeadScore = "hot" | "warm" | "cold";

export type LeadSignals = {
  requestedVisit?: boolean;
  requestedCallback?: boolean;
  askedAboutSpecificResidence?: boolean;
  askedAvailability?: boolean;
  hasBudget?: boolean;
  /** Free-text timeline the visitor picked, e.g. "Within 3 months". */
  timeline?: string;
  askedPricing?: boolean;
  askedHealthcare?: boolean;
  exploringResidences?: boolean;
};

/**
 * Rule-based lead scoring per the spec: hot = strong buying intent
 * (visit/callback/specific residence/availability/budget/near-term
 * timeline), warm = active interest, cold = general browsing.
 */
export function scoreLead(signals: LeadSignals): LeadScore {
  const timeline = (signals.timeline || "").toLowerCase();
  const nearTerm = /1|2|3/.test(timeline) && /month/.test(timeline);
  const midTerm = /3|6/.test(timeline) && /month/.test(timeline);

  if (
    signals.requestedVisit ||
    signals.requestedCallback ||
    signals.askedAboutSpecificResidence ||
    signals.askedAvailability ||
    signals.hasBudget ||
    nearTerm
  ) {
    return "hot";
  }

  if (
    signals.exploringResidences ||
    signals.askedPricing ||
    signals.askedHealthcare ||
    midTerm
  ) {
    return "warm";
  }

  return "cold";
}
