import type { Metadata } from "next";
import { getLeadsCollection } from "@/lib/mongodb";
import LeadsTable, { type LeadRow } from "@/components/admin/LeadsTable";

export const metadata: Metadata = {
  title: "Dashboard · Amaya Admin",
  robots: { index: false, follow: false },
};

// Auth-gated and always reads live data — never statically prerender.
export const dynamic = "force-dynamic";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

async function fetchLeads(): Promise<{ leads: LeadRow[]; dbError: boolean }> {
  try {
    const leads = await getLeadsCollection();
    if (!leads) return { leads: [], dbError: false };

    const docs = await leads.find({}).sort({ createdAt: -1 }).toArray();
    return {
      dbError: false,
      leads: docs.map((doc) => {
        const source = str(doc.source) || "book-a-visit";
        return {
          id: String(doc._id),
          name: str(doc.name),
          email: str(doc.email),
          phone: str(doc.phone),
          preferredDate: str(doc.preferredDate),
          createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt ?? ""),
          source,
          siteSource: str(doc.siteSource) || "website",
          leadScore: str(doc.leadScore) || (source === "book-a-visit" ? "hot" : ""),
          residence: str(doc.residence),
          budget: str(doc.budget),
          timeline: str(doc.timeline),
          purpose: str(doc.purpose),
          city: str(doc.city),
          visitTime: str(doc.visitTime),
          requestedCallback: doc.requestedCallback === true,
        };
      }),
    };
  } catch (err) {
    console.error("[admin] Failed to load leads:", err);
    return { leads: [], dbError: true };
  }
}

export default async function AdminDashboardPage() {
  const { leads, dbError } = await fetchLeads();

  return (
    <div>
      <div className="admin-topbar">
        <h1>Leads</h1>
        <p>Book a Visit requests and chatbot enquiries, in one place.</p>
      </div>
      {dbError ? (
        <div className="admin-table-wrap">
          <p className="admin-empty">
            Couldn&rsquo;t connect to the database. Check that MONGODB_URI is
            correct and that this server&rsquo;s IP is allowed in Atlas
            Network Access, then reload.
          </p>
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
