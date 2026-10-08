type CrmLeadPayload = {
  name: string;
  phone: string;
  email?: string;
  message: string;
};

function isConfigured(): boolean {
  return !!(process.env.CRM_API_URL && process.env.CRM_API_TOKEN);
}

/**
 * Forwards the lead to the Broaddcast real-estate CRM. Silently no-ops when
 * CRM_API_URL / CRM_API_TOKEN aren't set — callers should treat this as
 * best-effort and never let it block the lead being saved.
 */
export async function sendLeadToCrm(lead: CrmLeadPayload): Promise<void> {
  if (!isConfigured()) {
    console.warn("[crmLead] CRM_API_URL/CRM_API_TOKEN not configured — skipping CRM push.");
    return;
  }

  const res = await fetch(process.env.CRM_API_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CRM_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || undefined,
      message: lead.message,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[crmLead] CRM push failed (${res.status}): ${text}`);
  }
}
