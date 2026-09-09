"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiFile,
  FiFileText,
  FiBookOpen,
  FiHelpCircle,
  FiImage,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: FiGrid, exact: true },
  { href: "/admin/pages", label: "Pages", Icon: FiFile, exact: false },
  { href: "/admin/blogs", label: "Blogs", Icon: FiFileText, exact: false },
  { href: "/admin/media", label: "Media", Icon: FiBookOpen, exact: false },
  { href: "/admin/faqs", label: "FAQs", Icon: FiHelpCircle, exact: false },
  { href: "/admin/gallery", label: "Gallery", Icon: FiImage, exact: false },
  { href: "/admin/seo", label: "SEO", Icon: FiTrendingUp, exact: false },
  { href: "/admin/settings", label: "Settings", Icon: FiSettings, exact: false },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <Image
          src="/Amaya_black_Logo.webp"
          alt="Amaya"
          width={1080}
          height={543}
          className="admin-sidebar-logo-img"
        />
        <span className="admin-sidebar-tag">Admin</span>
      </div>
      <nav className="admin-sidebar-nav" aria-label="Admin">
        {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? "is-active" : ""}
              onClick={onNavigate}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <button className="admin-sidebar-logout" type="button" onClick={handleLogout}>
        <FiLogOut size={15} />
        Log Out
      </button>
    </aside>
  );
}
