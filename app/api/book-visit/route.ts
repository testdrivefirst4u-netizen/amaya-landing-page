import { NextResponse, after } from "next/server";
import { getLeadsCollection } from "@/lib/mongodb";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { sendLeadNotification } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";

  if (!name || !email || !phone || !date) {
    return NextResponse.json(
      { error: "Name, email, phone and date are required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit phone number." },
      { status: 400 }
    );
  }
  const digits = phone.replace(/\D/g, "").slice(-10);

  // Runs after the response is sent, but the runtime still guarantees it
  // completes — so the notification email never adds to the user's wait,
  // and a slow/failed send can't block or fail the lead submission.
  after(() => {
    sendLeadNotification({ name, email, phone: digits, preferredDate: date }).catch((err) => {
      console.error("[book-visit] Failed to send lead notification email:", err);
    });
  });

  try {
    const leads = await getLeadsCollection();
    if (leads) {
      await leads.insertOne({
        name,
        email,
        phone: digits,
        preferredDate: date,
        source: "book-a-visit",
        siteSource: "landing",
        createdAt: new Date(),
      });
    } else {
      console.warn(
        "[book-visit] MONGODB_URI not configured — lead was not persisted:",
        { name, email, phone: digits, date }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[book-visit] Failed to save lead:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
