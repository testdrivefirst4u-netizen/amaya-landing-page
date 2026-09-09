import nodemailer from "nodemailer";

type LeadEmailPayload = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  source?: string;
  leadScore?: string;
  residence?: string;
  budget?: string;
  timeline?: string;
  purpose?: string;
  city?: string;
  visitTime?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isConfigured(): boolean {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL);
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

/**
 * Emails the lead's details to EMAIL. Silently no-ops when EMAIL_USER /
 * EMAIL_PASS / EMAIL aren't set — callers should treat this as best-effort
 * and never let it block the lead being saved.
 */
export async function sendLeadNotification(lead: LeadEmailPayload): Promise<void> {
  if (!isConfigured()) {
    console.warn("[email] EMAIL_USER/EMAIL_PASS/EMAIL not configured — skipping lead notification email.");
    return;
  }

  const submittedAt = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isChatbot = lead.source === "chatbot";
  const subject = isChatbot
    ? `New chatbot lead — ${lead.name}${lead.leadScore ? ` (${lead.leadScore.toUpperCase()})` : ""}`
    : `New Book a Visit request — ${lead.name}`;

  const rows = ([
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Lead Source", isChatbot ? "Website Chatbot" : "Book a Visit form"],
    ["Lead Score", lead.leadScore ? lead.leadScore.toUpperCase() : undefined],
    ["Residence Interested In", lead.residence],
    ["Budget", lead.budget],
    ["Purpose", lead.purpose],
    ["City", lead.city],
    ["Purchase Timeline", lead.timeline],
    ["Preferred Visit Date", lead.preferredDate ? formatDate(lead.preferredDate) : undefined],
    ["Preferred Visit Time", lead.visitTime],
    ["Submitted On", submittedAt],
  ] as Array<[string, string | undefined]>).filter(
    (row): row is [string, string] => Boolean(row[1])
  );

  await getTransporter().sendMail({
    from: `"Amaya Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL,
    subject,
    text: [
      isChatbot
        ? "A new lead was captured by the website chatbot on amayaseniorliving.com"
        : "A new Book a Visit request was submitted on amayaseniorliving.com",
      "",
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1d2f3f;">
        <h2 style="font-weight: 400; margin-bottom: 4px;">${isChatbot ? "New chatbot lead" : "New Book a Visit request"}</h2>
        <p style="color: #6b5f57; margin-top: 0;">Submitted on amayaseniorliving.com</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          ${rows
            .map(
              ([label, value], i) => `
          <tr>
            <td style="padding: 8px 0; border-top: 1px solid #e7d8c6;${i === rows.length - 1 ? " border-bottom: 1px solid #e7d8c6;" : ""} color: #6b5f57;">${escapeHtml(label)}</td>
            <td style="padding: 8px 0; border-top: 1px solid #e7d8c6;${i === rows.length - 1 ? " border-bottom: 1px solid #e7d8c6;" : ""}">${escapeHtml(value)}</td>
          </tr>`
            )
            .join("")}
        </table>
      </div>
    `,
  });
}
