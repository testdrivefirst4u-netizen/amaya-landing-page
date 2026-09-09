"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { IconPlus } from "./Icons";
import { isValidEmail, isValidPhone, normalizePhoneInput } from "@/lib/validation";

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export default function BookVisitModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setDate("");
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/book-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, date }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      onClose();
      router.push("/thank-you");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="bv-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Book a Site Visit"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bv-modal">
        <button className="bv-close" aria-label="Close" onClick={onClose}>
          <IconPlus size={18} />
        </button>

        {/* <span className="eyebrow eyebrow--bare bv-eyebrow">Book a Site Visit</span> */}
        <h3 className="bv-title">See Amaya for yourself.</h3>
        <p className="bv-sub">
          Share a few details and our team will confirm your visit to the
          Amaya Experience Centre.
        </p>

        <form className="bv-form" onSubmit={handleSubmit}>
          <label className="bv-field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </label>

          <label className="bv-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="bv-field">
            <span>Phone Number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(normalizePhoneInput(e.target.value))}
              placeholder="10-digit mobile number"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              required
            />
          </label>

          <label className="bv-field">
            <span>Preferred Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={todayISO()}
              required
            />
          </label>

          {error && <p className="bv-error">{error}</p>}

          <button className="btn btn-primary bv-submit" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Request a Visit"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
