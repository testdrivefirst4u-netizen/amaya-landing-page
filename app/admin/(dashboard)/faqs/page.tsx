import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "FAQs · Amaya Admin", robots: { index: false, follow: false } };

export default function AdminFaqsPage() {
  return (
    <ComingSoon
      title="FAQs"
      description="Manage the questions shown on the homepage and /faqs."
    />
  );
}
