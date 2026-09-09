declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type ChatAnalyticsEvent =
  | "chat_opened"
  | "chat_started"
  | "residence_viewed"
  | "pricing_requested"
  | "availability_requested"
  | "healthcare_question"
  | "location_viewed"
  | "visit_started"
  | "visit_completed"
  | "callback_requested"
  | "whatsapp_clicked"
  | "advisor_requested"
  | "lead_created";

/**
 * Sends chatbot events through the site's existing Google Analytics (gtag)
 * setup — no separate analytics system. No-ops safely if gtag hasn't
 * loaded (e.g. ad blockers, or the script tag hasn't run yet).
 */
export function trackChatEvent(event: ChatAnalyticsEvent, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
