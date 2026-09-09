import type { Metadata } from "next";
import MediaPostForm from "@/components/admin/MediaPostForm";

export const metadata: Metadata = {
  title: "New Item · Amaya Admin",
  robots: { index: false, follow: false },
};

export default function NewMediaPage() {
  return (
    <div>
      <div className="admin-topbar">
        <h1>New Item</h1>
        <p>Create a new item for /media.</p>
      </div>
      <MediaPostForm />
    </div>
  );
}
