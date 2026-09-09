"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMessageCircle, FiSend, FiX, FiMinus } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { findBestFaq } from "@/lib/faqData";
import { UNITS, type ResidenceUnit } from "@/lib/residenceData";
import {
  ADDRESS,
  LOCATION_SUMMARY,
  DISTANCES,
  NEARBY_HOSPITALS,
  GOOGLE_MAPS_HREF,
  CLUB_AMAYA_SUMMARY,
  CLUB_FEATURES,
  HEALTHCARE_SUMMARY,
  RERA_NUMBER,
} from "@/lib/chatbotKnowledge";
import { classifyIntent, type Intent } from "@/lib/chatIntents";
import { scoreLead } from "@/lib/leadScoring";
import { trackChatEvent } from "@/lib/analytics";
import { isValidEmail, isValidPhone, normalizePhoneInput } from "@/lib/validation";
import { PHONE_HREF } from "@/lib/assets";

const WHATSAPP_NUMBER = "919553395533";
function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

type Reply = { label: string; value: string };

type Message = {
  id: number;
  role: "bot" | "user";
  text?: string;
  card?: ResidenceUnit;
  whatsappPrefill?: string;
  mapsHref?: string;
};

type Draft = {
  purpose?: string;
  peopleCount?: string;
  priority?: string;
  residence?: string;
  budget?: string;
  timeline?: string;
  visitDate?: string;
  visitTime?: string;
  visitWho?: string;
  askedPricing?: boolean;
  askedAvailability?: boolean;
  askedHealthcare?: boolean;
  exploringResidences?: boolean;
  requestedCallback?: boolean;
};

type Step =
  | "welcome"
  | "explore_who"
  | "explore_count"
  | "explore_priority"
  | "explore_result"
  | "pricing_config"
  | "pricing_result"
  | "healthcare_menu"
  | "healthcare_result"
  | "lifestyle_menu"
  | "location_menu"
  | "advisor_menu"
  | "visit_time"
  | "visit_who"
  | "idle";

type FormKind = "contact" | "date" | null;

const GREETING_LINES = [
  "Welcome to Amaya Senior Living 🌿",
  "I'm your Amaya Senior Living Advisor. I can help you explore residences, pricing, healthcare, lifestyle, location and visits.",
  "How can I help you today?",
];

const WELCOME_REPLIES: Reply[] = [
  { label: "🏡 Explore Residences", value: "explore_residences" },
  { label: "💰 Pricing & Availability", value: "pricing" },
  { label: "🌿 Life at Amaya", value: "lifestyle" },
  { label: "🏥 Healthcare & Support", value: "healthcare" },
  { label: "📍 Location", value: "location" },
  { label: "📅 Book a Visit", value: "book_visit" },
  { label: "👨‍💼 Talk to an Advisor", value: "talk_to_advisor" },
];

const NO_MATCH_TEXT =
  "I don't want to give you inaccurate information. I can connect you with an Amaya advisor who can help with that.";

let msgId = 0;
function nextId() {
  msgId += 1;
  return msgId;
}

function recommendResidence(peopleCount?: string, priority?: string): ResidenceUnit {
  let idx = 1; // default: 2 BHK
  if (peopleCount === "1") idx = 0;
  else if (peopleCount === "2") idx = 1;
  else if (peopleCount === "3+") idx = 3;

  if (priority === "More space" || priority === "Family visits" || priority === "Premium lifestyle") {
    idx = Math.min(idx + 1, UNITS.length - 1);
  }
  return UNITS[idx];
}

const SESSION_KEY = "amaya_chat_session_v1";

export default function ChatWidget() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [activeForm, setActiveForm] = useState<FormKind>(null);
  const [step, setStep] = useState<Step>("welcome");
  const [draft, setDraft] = useState<Draft>({});
  const [input, setInput] = useState("");
  const [conversationId] = useState(() => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const listRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  // ---------- persistence (session only) ----------
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.messages) && saved.messages.length > 0) {
          setMessages(saved.messages);
          setReplies(saved.replies || []);
          setActiveForm(saved.activeForm || null);
          setStep(saved.step || "idle");
          setDraft(saved.draft || {});
          setHasOpenedOnce(true);
        }
      }
    } catch {
      // ignore corrupt/unavailable storage
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ messages, replies, activeForm, step, draft })
      );
    } catch {
      // ignore quota/availability issues — persistence is best-effort
    }
  }, [messages, replies, activeForm, step, draft]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, replies, activeForm, isOpen, isMinimized]);

  // ---------- message helpers ----------
  function pushBot(text: string, extra?: Partial<Message>) {
    setMessages((prev) => [...prev, { id: nextId(), role: "bot", text, ...extra }]);
  }
  function pushUser(text: string) {
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
  }

  function openWidget() {
    setIsOpen(true);
    setIsMinimized(false);
    if (!hasOpenedOnce) {
      setHasOpenedOnce(true);
      trackChatEvent("chat_opened");
      trackChatEvent("chat_started");
      GREETING_LINES.forEach((line) => pushBot(line));
      setReplies(WELCOME_REPLIES);
      setStep("welcome");
    } else {
      trackChatEvent("chat_opened");
    }
  }

  function goToWelcome() {
    pushBot("How else can I help?");
    setReplies(WELCOME_REPLIES);
    setActiveForm(null);
    setStep("welcome");
  }

  /** Jump to a homepage section — scrolls in place if already home, else navigates there. */
  function goToSection(id: string) {
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    } else {
      window.location.href = `/#${id}`;
    }
  }

  // ---------- flow entry points (shared by buttons + free-text intent) ----------
  function startExplore() {
    trackChatEvent("residence_viewed");
    setDraft((d) => ({ ...d, exploringResidences: true }));
    pushBot("Let's find a residence that suits your needs.");
    pushBot("Who are you exploring Amaya for?");
    setReplies([
      { label: "Myself", value: "Myself" },
      { label: "My Parents", value: "My Parents" },
      { label: "My Spouse", value: "My Spouse" },
      { label: "Another Family Member", value: "Another Family Member" },
      { label: "Just Exploring", value: "Just Exploring" },
    ]);
    setActiveForm(null);
    setStep("explore_who");
  }

  function startPricing() {
    trackChatEvent("pricing_requested");
    setDraft((d) => ({ ...d, askedPricing: true }));
    pushBot("I can help you explore current residence pricing and availability.");
    pushBot("Which configuration are you interested in?");
    setReplies(UNITS.map((u) => ({ label: u.type, value: u.type })));
    setActiveForm(null);
    setStep("pricing_config");
  }

  function startHealthcare() {
    trackChatEvent("healthcare_question");
    setDraft((d) => ({ ...d, askedHealthcare: true }));
    pushBot(
      "Amaya is designed around independent senior living, with healthcare and everyday support available when needed."
    );
    pushBot("What would you like to know?");
    setReplies([
      { label: "Doctor support", value: "Doctor support" },
      { label: "Nursing support", value: "Nursing support" },
      { label: "Physiotherapy", value: "Physiotherapy" },
      { label: "Emergency support", value: "Emergency support" },
      { label: "Hospital coordination", value: "Hospital coordination" },
      { label: "All healthcare facilities", value: "All healthcare facilities" },
    ]);
    setActiveForm(null);
    setStep("healthcare_menu");
  }

  function startLifestyle() {
    pushBot("Life at Amaya is designed around wellness, community and choice.");
    pushBot("What would you like to explore?");
    setReplies([
      { label: "🍽️ Dining and social spaces", value: "Dining and social spaces" },
      { label: "📚 Library and reading rooms", value: "Library and reading rooms" },
      { label: "🧘 Wellness and therapy rooms", value: "Wellness and therapy rooms" },
      { label: "🎨 Arts and activity studios", value: "Arts and activity studios" },
      { label: "🎭 Performance and events hall", value: "Performance and events hall" },
      { label: "🏢 Club Amaya overview", value: "Club Amaya overview" },
    ]);
    setActiveForm(null);
    setStep("lifestyle_menu");
  }

  function startLocation() {
    trackChatEvent("location_viewed");
    pushBot(`Amaya is at ${ADDRESS}.`);
    pushBot(LOCATION_SUMMARY);
    setReplies([
      { label: "📍 Open Google Maps", value: "open_maps" },
      { label: "🚗 How to Reach", value: "how_to_reach" },
      { label: "🏥 Nearby Healthcare", value: "nearby_healthcare" },
      { label: "📅 Book a Visit", value: "book_visit" },
    ]);
    setActiveForm(null);
    setStep("location_menu");
  }

  function startBookVisit(prefillResidence?: string) {
    trackChatEvent("visit_started");
    if (prefillResidence) setDraft((d) => ({ ...d, residence: prefillResidence }));
    pushBot("We'd love to welcome you to Amaya.");
    pushBot("When would you like to visit?");
    setReplies([]);
    setActiveForm("date");
    setStep("welcome"); // date step is driven by activeForm, not a named Step
  }

  function startAdvisorMenu() {
    trackChatEvent("advisor_requested");
    pushBot("Absolutely. I can connect you with an Amaya advisor.");
    setReplies([
      { label: "📞 Call Now", value: "call_now" },
      { label: "💬 WhatsApp", value: "whatsapp" },
      { label: "📅 Schedule a Call", value: "schedule_call" },
      { label: "📝 Request a Callback", value: "request_callback" },
    ]);
    setActiveForm(null);
    setStep("advisor_menu");
  }

  function startContactForm() {
    setReplies([]);
    setActiveForm("contact");
  }

  // ---------- welcome menu dispatch (shared by button clicks + intents) ----------
  function handleTopLevel(value: string) {
    switch (value) {
      case "explore_residences":
        startExplore();
        break;
      case "pricing":
        startPricing();
        break;
      case "lifestyle":
      case "amenities":
        startLifestyle();
        break;
      case "healthcare":
        startHealthcare();
        break;
      case "location":
        startLocation();
        break;
      case "book_visit":
        startBookVisit();
        break;
      case "talk_to_advisor":
      case "callback":
        startAdvisorMenu();
        break;
      case "whatsapp":
        window.open(
          whatsappHref("Hi, I found Amaya Senior Living through the website chatbot and would like to know more about the residences."),
          "_blank"
        );
        trackChatEvent("whatsapp_clicked");
        break;
      case "floor_plans":
        pushBot("I'd be happy to have an Amaya advisor confirm the latest floor plan details for you.");
        setReplies([{ label: "Talk to an Advisor", value: "talk_to_advisor" }]);
        break;
      case "availability":
        startPricing();
        break;
      case "explore_more_life":
        goToSection("life");
        break;
      case "continue":
        goToWelcome();
        break;
      default:
        goToWelcome();
    }
  }

  // ---------- reply handling per step ----------
  function handleReply(reply: Reply) {
    pushUser(reply.label);
    setReplies([]);

    switch (step) {
      case "welcome":
        handleTopLevel(reply.value);
        return;

      case "explore_who":
        setDraft((d) => ({ ...d, purpose: reply.value }));
        pushBot("How many people will usually live in the residence?");
        setReplies([
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3+", value: "3+" },
          { label: "Not sure", value: "Not sure" },
        ]);
        setStep("explore_count");
        return;

      case "explore_count":
        setDraft((d) => ({ ...d, peopleCount: reply.value }));
        pushBot("What matters most to you?");
        setReplies([
          { label: "Comfortable independent living", value: "Comfortable independent living" },
          { label: "More space", value: "More space" },
          { label: "Easy maintenance", value: "Easy maintenance" },
          { label: "Family visits", value: "Family visits" },
          { label: "Premium lifestyle", value: "Premium lifestyle" },
          { label: "Healthcare support", value: "Healthcare support" },
        ]);
        setStep("explore_priority");
        return;

      case "explore_priority": {
        const priority = reply.value;
        setDraft((d) => ({ ...d, priority }));
        const rec = recommendResidence(draft.peopleCount, priority);
        pushBot(`Based on your preferences, a ${rec.type} may be a good fit.`, { card: rec });
        setDraft((d) => ({ ...d, residence: rec.type }));
        setReplies([
          { label: `View ${rec.type}`, value: "view_details" },
          { label: "View Floor Plan", value: "floor_plans" },
          { label: "Check Availability", value: "check_availability" },
          { label: "Book a Visit", value: "book_visit_this" },
        ]);
        setStep("explore_result");
        return;
      }

      case "explore_result":
        if (reply.value === "view_details") {
          goToSection("residences");
          return;
        }
        if (reply.value === "floor_plans") {
          pushBot("I'd be happy to have an Amaya advisor confirm the latest floor plan details for you.");
          setReplies([{ label: "Talk to an Advisor", value: "talk_to_advisor" }]);
          setStep("welcome");
          return;
        }
        if (reply.value === "check_availability") {
          trackChatEvent("availability_requested");
          setDraft((d) => ({ ...d, askedAvailability: true }));
          pushBot("I'd be happy to have an Amaya advisor confirm the latest availability for you.");
          startContactForm();
          return;
        }
        if (reply.value === "book_visit_this") {
          startBookVisit(draft.residence);
          return;
        }
        handleTopLevel(reply.value);
        return;

      case "pricing_config": {
        const unit = UNITS.find((u) => u.type === reply.value);
        setDraft((d) => ({ ...d, residence: reply.value }));
        if (unit) {
          pushBot(
            `${unit.type} homes at Amaya start from ${unit.price} onwards, for approximately ${unit.sqft} sq ft super built-up. ${unit.tagline}`,
            { card: unit }
          );
        }
        pushBot("Would you like an Amaya advisor to help you with the latest availability?");
        setReplies([
          { label: "Yes, Contact Me", value: "yes_contact" },
          { label: "Book a Visit", value: "book_visit" },
          { label: "Continue Exploring", value: "continue" },
        ]);
        setStep("pricing_result");
        return;
      }

      case "pricing_result":
        if (reply.value === "yes_contact") {
          startContactForm();
          return;
        }
        if (reply.value === "book_visit") {
          startBookVisit(draft.residence);
          return;
        }
        goToWelcome();
        return;

      case "healthcare_menu":
        pushBot(`On ${reply.label.toLowerCase()}: ${HEALTHCARE_SUMMARY}`);
        setReplies([
          { label: "Talk to an Advisor", value: "talk_to_advisor" },
          { label: "Continue Exploring", value: "continue" },
        ]);
        setStep("healthcare_result");
        return;

      case "healthcare_result":
        if (reply.value === "talk_to_advisor") {
          startAdvisorMenu();
          return;
        }
        goToWelcome();
        return;

      case "lifestyle_menu": {
        if (reply.value === "Club Amaya overview") {
          pushBot(CLUB_AMAYA_SUMMARY);
          pushBot(CLUB_FEATURES.join(" · "));
        } else {
          pushBot(
            `${reply.value} is part of Club Amaya — ${CLUB_AMAYA_SUMMARY.toLowerCase()}`
          );
        }
        pushBot("Would you like to explore the Club Amaya experience further?");
        setReplies([
          { label: "Explore More", value: "explore_more_life" },
          { label: "Book a Visit", value: "book_visit" },
        ]);
        setStep("welcome");
        return;
      }

      case "location_menu":
        if (reply.value === "open_maps") {
          window.open(GOOGLE_MAPS_HREF, "_blank");
          setReplies([
            { label: "🚗 How to Reach", value: "how_to_reach" },
            { label: "🏥 Nearby Healthcare", value: "nearby_healthcare" },
            { label: "📅 Book a Visit", value: "book_visit" },
          ]);
          return;
        }
        if (reply.value === "how_to_reach") {
          pushBot(DISTANCES.map((d) => `${d.place} — ${d.mins} min`).join("\n"));
          setReplies([
            { label: "📍 Open Google Maps", value: "open_maps" },
            { label: "🏥 Nearby Healthcare", value: "nearby_healthcare" },
            { label: "📅 Book a Visit", value: "book_visit" },
          ]);
          return;
        }
        if (reply.value === "nearby_healthcare") {
          pushBot(NEARBY_HOSPITALS.map((d) => `${d.place} — ${d.mins} min`).join("\n"));
          setReplies([
            { label: "📍 Open Google Maps", value: "open_maps" },
            { label: "📅 Book a Visit", value: "book_visit" },
          ]);
          return;
        }
        handleTopLevel(reply.value);
        return;

      case "advisor_menu":
        if (reply.value === "call_now") {
          window.location.href = PHONE_HREF;
          return;
        }
        if (reply.value === "whatsapp") {
          window.open(
            whatsappHref("Hi, I found Amaya Senior Living through the website chatbot and would like to know more about the residences."),
            "_blank"
          );
          trackChatEvent("whatsapp_clicked");
          return;
        }
        if (reply.value === "schedule_call" || reply.value === "request_callback") {
          setDraft((d) => ({ ...d, requestedCallback: true }));
          trackChatEvent("callback_requested");
          pushBot(
            reply.value === "schedule_call"
              ? "Happy to schedule a call. A few details, and an advisor will ring you at a time that works."
              : "No problem — share your details and an advisor will call you back shortly."
          );
          startContactForm();
          return;
        }
        return;

      default:
        goToWelcome();
    }
  }

  // ---------- date step (Book a Visit) ----------
  const [dateValue, setDateValue] = useState("");
  function submitDate() {
    if (!dateValue) return;
    pushUser(new Date(dateValue).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }));
    setDraft((d) => ({ ...d, visitDate: dateValue }));
    setDateValue("");
    pushBot("What time would you prefer?");
    setReplies([
      { label: "Morning", value: "Morning" },
      { label: "Afternoon", value: "Afternoon" },
      { label: "Evening", value: "Evening" },
    ]);
    setActiveForm(null);
    setStep("visit_time");
  }

  // The Book-a-Visit date/time/who sequence is intercepted here, ahead of
  // the main step switch, so its linear flow stays easy to follow on its own.
  function handleVisitFlowReply(reply: Reply) {
    if (step === "visit_time") {
      pushUser(reply.label);
      setDraft((d) => ({ ...d, visitTime: reply.value }));
      pushBot("Who will be visiting?");
      setReplies([
        { label: "Myself", value: "Myself" },
        { label: "My Parents", value: "My Parents" },
        { label: "Family", value: "Family" },
        { label: "Myself + Parents", value: "Myself + Parents" },
        { label: "Other", value: "Other" },
      ]);
      setStep("visit_who");
      return true;
    }
    if (step === "visit_who") {
      pushUser(reply.label);
      setDraft((d) => ({ ...d, visitWho: reply.value }));
      pushBot("Just need a few details to confirm your visit.");
      startContactForm();
      return true;
    }
    return false;
  }

  function onReplyClick(reply: Reply) {
    if (handleVisitFlowReply(reply)) return;
    handleReply(reply);
  }

  // ---------- contact / lead form ----------
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitContactForm(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!isValidPhone(formPhone)) {
      setFormError("Enter a valid 10-digit phone number.");
      return;
    }
    if (formEmail && !isValidEmail(formEmail)) {
      setFormError("Enter a valid email address, or leave it blank.");
      return;
    }

    setSubmitting(true);
    const isVisit = Boolean(draft.visitDate);
    const leadScore = scoreLead({
      requestedVisit: isVisit,
      requestedCallback: draft.requestedCallback,
      askedAboutSpecificResidence: Boolean(draft.residence),
      askedAvailability: draft.askedAvailability,
      hasBudget: Boolean(draft.budget),
      timeline: draft.timeline,
      askedPricing: draft.askedPricing,
      askedHealthcare: draft.askedHealthcare,
      exploringResidences: draft.exploringResidences,
    });

    try {
      const res = await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          phone: formPhone,
          email: formEmail.trim(),
          purpose: draft.purpose || "",
          residence: draft.residence || "",
          budget: draft.budget || "",
          city: "",
          timeline: draft.timeline || "",
          visitDate: draft.visitDate || "",
          visitTime: draft.visitTime || "",
          visitWho: draft.visitWho || "",
          conversationId,
          requestedCallback: Boolean(draft.requestedCallback),
          askedAvailability: Boolean(draft.askedAvailability),
          askedPricing: Boolean(draft.askedPricing),
          askedHealthcare: Boolean(draft.askedHealthcare),
          exploringResidences: Boolean(draft.exploringResidences),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      trackChatEvent("lead_created", { leadScore });
      if (isVisit) trackChatEvent("visit_completed");

      pushUser(`${formName.trim()} · ${formPhone}${formEmail ? ` · ${formEmail}` : ""}`);
      pushBot(
        isVisit
          ? "Thank you. Your visit request has been received.\n\nAn Amaya advisor will contact you to confirm the details."
          : "Thank you — an Amaya advisor will be in touch shortly.",
        { whatsappPrefill: "Hi, I just spoke with the Amaya chatbot and would like to follow up." }
      );
      setActiveForm(null);
      setFormName("");
      setFormPhone("");
      setFormEmail("");
      setReplies([{ label: "Continue Exploring", value: "continue" }]);
      setStep("welcome");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- free-text input (always intent-routed) ----------
  function handleSubmitText(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    pushUser(trimmed);
    setReplies([]);
    setActiveForm(null);

    const intent: Intent | null = classifyIntent(trimmed);
    if (intent && intent !== "faq" && intent !== "general_information") {
      handleTopLevel(intent);
      return;
    }

    const faq = findBestFaq(trimmed);
    if (faq) {
      pushBot(faq.a);
      setReplies([
        { label: "Talk to an Advisor", value: "talk_to_advisor" },
        { label: "Continue Exploring", value: "continue" },
      ]);
      setStep("welcome");
      return;
    }

    if (/rera/i.test(trimmed)) {
      pushBot(`Amaya's RERA registration number is ${RERA_NUMBER}.`);
      setReplies([{ label: "Continue Exploring", value: "continue" }]);
      setStep("welcome");
      return;
    }

    pushBot(NO_MATCH_TEXT, {
      whatsappPrefill: `Hi, I have a question about Amaya: ${trimmed}`,
    });
    setReplies(WELCOME_REPLIES);
    setStep("welcome");
  }

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <button
        className="chat-launcher"
        type="button"
        aria-label={isOpen ? "Close chat" : "Ask a question"}
        onClick={() => (isOpen ? setIsOpen(false) : openWidget())}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {isOpen && (
        <div className={`chat-panel ${isMinimized ? "is-minimized" : ""}`} role="dialog" aria-label="Amaya Senior Living Advisor">
          <div className="chat-header">
            <div>
              <span className="chat-header-title">Amaya</span>
              <span className="chat-header-sub">
                <span className="chat-online-dot" /> Senior Living Advisor · Online
              </span>
            </div>
            <div className="chat-header-actions">
              <a
                className="chat-agent-link"
                href={whatsappHref("Hi, I'd like to speak with someone about Amaya.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackChatEvent("whatsapp_clicked")}
              >
                <FaWhatsapp size={14} />
                Agent
              </a>
              <button
                className="chat-icon-btn"
                type="button"
                aria-label="Minimize"
                onClick={() => setIsMinimized((v) => !v)}
              >
                <FiMinus size={16} />
              </button>
              <button
                className="chat-icon-btn"
                type="button"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages" ref={listRef}>
                {messages.map((m) => (
                  <div className={`chat-bubble chat-bubble--${m.role}`} key={m.id}>
                    <span style={{ whiteSpace: "pre-line" }}>{m.text}</span>
                    {m.card && (
                      <div className="chat-residence-card">
                        <img src={m.card.desktop} alt={m.card.type} />
                        <div className="chat-residence-card-body">
                          <span className="chat-residence-card-type">{m.card.type}</span>
                          <span className="chat-residence-card-sqft">{m.card.sqft} sq ft</span>
                          <span className="chat-residence-card-price">{m.card.price} onwards</span>
                        </div>
                      </div>
                    )}
                    {m.whatsappPrefill && (
                      <a
                        className="chat-whatsapp-btn"
                        href={whatsappHref(m.whatsappPrefill)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackChatEvent("whatsapp_clicked")}
                      >
                        <FaWhatsapp size={14} />
                        Chat on WhatsApp
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {replies.length > 0 && (
                <div className="chat-suggestions">
                  {replies.map((r) => (
                    <button
                      className="chat-suggestion-btn"
                      type="button"
                      key={r.value + r.label}
                      onClick={() => onReplyClick(r)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}

              {activeForm === "date" && (
                <div className="chat-inline-form">
                  <input
                    type="date"
                    className="chat-inline-input"
                    value={dateValue}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDateValue(e.target.value)}
                  />
                  <button
                    className="chat-inline-submit"
                    type="button"
                    onClick={submitDate}
                    disabled={!dateValue}
                  >
                    Continue
                  </button>
                </div>
              )}

              {activeForm === "contact" && (
                <form className="chat-inline-form chat-inline-form--stacked" onSubmit={submitContactForm}>
                  <input
                    className="chat-inline-input"
                    type="text"
                    placeholder="Full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                  <input
                    className="chat-inline-input"
                    type="tel"
                    placeholder="10-digit phone number"
                    value={formPhone}
                    onChange={(e) => setFormPhone(normalizePhoneInput(e.target.value))}
                    inputMode="numeric"
                    maxLength={10}
                    required
                  />
                  <input
                    className="chat-inline-input"
                    type="email"
                    placeholder="Email (optional)"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                  {formError && <p className="chat-form-error">{formError}</p>}
                  <button className="chat-inline-submit" type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}

              <form className="chat-form" onSubmit={handleSubmitText}>
                <input
                  className="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  aria-label="Type your question"
                />
                <button className="chat-send" type="submit" aria-label="Send" disabled={!input.trim()}>
                  <FiSend size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
