"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="admin-dashboard">
      <button
        type="button"
        className="admin-mobile-topbar-toggle"
        aria-label={drawerOpen ? "Close menu" : "Open menu"}
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen((v) => !v)}
      >
        {drawerOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
      <span className="admin-mobile-topbar-title">Amaya Admin</span>

      <div
        className={`admin-sidebar-backdrop ${drawerOpen ? "is-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`admin-sidebar-wrap ${drawerOpen ? "is-open" : ""}`}>
        <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
      </div>

      <main className="admin-main">{children}</main>
    </div>
  );
}
