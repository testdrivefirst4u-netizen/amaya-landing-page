import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Gallery · Amaya Admin", robots: { index: false, follow: false } };

export default function AdminGalleryPage() {
  return (
    <ComingSoon
      title="Gallery"
      description="Manage the images shown on /gallery."
    />
  );
}
