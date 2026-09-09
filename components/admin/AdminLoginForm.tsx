"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid username or password.");
        setSubmitting(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form className="admin-login-card" onSubmit={handleSubmit}>
      <Image
        src="/Amaya_black_Logo.webp"
        alt="Amaya"
        width={1080}
        height={543}
        className="admin-login-logo"
      />
      <h1>Admin Login</h1>
      <p className="admin-login-sub">Sign in to view Book a Visit leads.</p>

      <label className="admin-field">
        <span>Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </label>

      <label className="admin-field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <button className="admin-submit" type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
