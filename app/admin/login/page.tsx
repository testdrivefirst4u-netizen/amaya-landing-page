import type { Metadata } from "next";
import "../admin.css";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login · Amaya",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="admin-shell">
      <AdminLoginForm />
    </div>
  );
}
