import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMediaBySlugAdmin } from "@/lib/mediaStore";
import MediaPostForm from "@/components/admin/MediaPostForm";

export const metadata: Metadata = {
  title: "Edit Item · Amaya Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getMediaBySlugAdmin(slug);
  if (!item) notFound();

  return (
    <div>
      <div className="admin-topbar">
        <h1>Edit Item</h1>
        <p>{item.title}</p>
      </div>
      <MediaPostForm item={item} />
    </div>
  );
}
