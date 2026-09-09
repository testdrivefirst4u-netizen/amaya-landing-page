import type { Metadata } from "next";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { listAllMedia } from "@/lib/mediaStore";
import MediaAdminTable from "@/components/admin/MediaAdminTable";
import AdminBanner from "@/components/admin/AdminBanner";

export const metadata: Metadata = {
  title: "Media · Amaya Admin",
  robots: { index: false, follow: false },
};

// Auth-gated and always reads live data — never statically prerender.
export const dynamic = "force-dynamic";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const items = await listAllMedia();
  const { saved } = await searchParams;

  return (
    <div>
      {saved === "created" && <AdminBanner message="Item created successfully." />}
      {saved === "updated" && <AdminBanner message="Item updated successfully." />}

      <div className="admin-topbar admin-topbar--with-action">
        <div>
          <h1>Media</h1>
          <p>Manage the items shown on /media.</p>
        </div>
        <Link href="/admin/media/new" className="admin-submit admin-topbar-cta">
          <FiPlus size={15} /> New Item
        </Link>
      </div>
      <MediaAdminTable items={items} />
    </div>
  );
}
