import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Pages · Amaya Admin", robots: { index: false, follow: false } };

export default function AdminPagesPage() {
  return (
    <ComingSoon
      title="Pages"
      description="Manage standalone site pages (Privacy Policy, Terms, etc.)."
    />
  );
}
