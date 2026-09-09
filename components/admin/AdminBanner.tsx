"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

export default function AdminBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="admin-banner admin-banner--success">
      <FiCheckCircle size={16} />
      <span>{message}</span>
      <button type="button" aria-label="Dismiss" onClick={() => setVisible(false)}>
        <FiX size={16} />
      </button>
    </div>
  );
}
