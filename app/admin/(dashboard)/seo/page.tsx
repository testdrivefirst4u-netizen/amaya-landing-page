import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "SEO · Amaya Admin", robots: { index: false, follow: false } };

export default function AdminSeoPage() {
  return (
    <ComingSoon
      title="SEO"
      description="Site-wide SEO defaults, redirects and structured data. Per-article SEO is already available on each Blog and Article's editor."
    />
  );
}
