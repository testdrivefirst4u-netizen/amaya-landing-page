import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Settings · Amaya Admin", robots: { index: false, follow: false } };

export default function AdminSettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Account, notification and site configuration settings."
    />
  );
}
