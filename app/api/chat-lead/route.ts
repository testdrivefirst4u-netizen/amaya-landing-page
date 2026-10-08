import { NextResponse, after } from "next/server";
import { getLeadsCollection } from "@/lib/mongodb";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { sendLeadNotification } from "@/lib/email";
import { sendLeadToCrm } from "@/lib/crmLead";
import { scoreLead } from "@/lib/leadScoring";

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = str(body.name);
  const phone = str(body.phone);
  const email = str(body.email); // optional for chatbot leads
  const purpose = str(body.purpose);
  const residence = str(body.residence);
  const budget = str(body.budget);
  const city = str(body.city);
  const timeline = str(body.timeline);
  const visitDate = str(body.visitDate);
  const visitTime = str(body.visitTime);
  const visitWho = str(body.visitWho);
  const conversationId = str(body.conversationId);

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required." },
      { status: 400 }
    );
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit phone number." },
      { status: 400 }
    );
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const digits = phone.replace(/\D/g, "").slice(-10);

  const leadScore = scoreLead({
    requestedVisit: Boolean(visitDate),
    requestedCallback: body.requestedCallback === true,
    askedAboutSpecificResidence: Boolean(residence),
    askedAvailability: body.askedAvailability === true,
    hasBudget: Boolean(budget),
    timeline,
    askedPricing: body.askedPricing === true,
    askedHealthcare: body.askedHealthcare === true,
    exploringResidences: body.exploringResidences === true,
  });

  const doc = {
    name,
    phone: digits,
    email,
    purpose,
    residence,
    budget,
    city,
    timeline,
    preferredDate: visitDate,
    visitTime,
    visitWho,
    requestedCallback: body.requestedCallback === true,
    leadScore,
    leadSource: "Landing Page Chatbot",
    project: "Amaya Senior Living",
    conversationId,
    source: "chatbot",
    siteSource: "landing",
    createdAt: new Date(),
  };

  after(() => {
    sendLeadNotification({
      name,
      email: email || "—",
      phone: digits,
      preferredDate: visitDate,
      source: "chatbot",
      leadScore,
      residence: residence || undefined,
      budget: budget || undefined,
      timeline: timeline || undefined,
      purpose: purpose || undefined,
      city: city || undefined,
      visitTime: visitTime || undefined,
    }).catch((err) => {
      console.error("[chat-lead] Failed to send lead notification email:", err);
    });

    const messageParts = [
      "Lead captured by website chatbot",
      purpose && `Purpose: ${purpose}`,
      residence && `Residence: ${residence}`,
      budget && `Budget: ${budget}`,
      city && `City: ${city}`,
      timeline && `Timeline: ${timeline}`,
      visitDate && `Preferred visit: ${visitDate}${visitTime ? ` ${visitTime}` : ""}`,
    ].filter(Boolean);

    sendLeadToCrm({
      name,
      phone: digits,
      email,
      message: messageParts.join(" | "),
    }).catch((err) => {
      console.error("[chat-lead] Failed to push lead to CRM:", err);
    });
  });

  try {
    const leads = await getLeadsCollection();
    if (leads) {
      await leads.insertOne(doc);
    } else {
      console.warn("[chat-lead] MONGODB_URI not configured — lead was not persisted:", doc);
    }
    return NextResponse.json({ ok: true, leadScore });
  } catch (err) {
    console.error("[chat-lead] Failed to save lead:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
