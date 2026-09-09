"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import BookVisitModal from "./BookVisitModal";

type BookVisitContextValue = {
  open: () => void;
};

const BookVisitContext = createContext<BookVisitContextValue | null>(null);

export function useBookVisit() {
  const ctx = useContext(BookVisitContext);
  if (!ctx) {
    throw new Error("useBookVisit must be used within BookVisitProvider");
  }
  return ctx;
}

export default function BookVisitProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <BookVisitContext.Provider value={{ open }}>
      {children}
      <BookVisitModal isOpen={isOpen} onClose={close} />
    </BookVisitContext.Provider>
  );
}
