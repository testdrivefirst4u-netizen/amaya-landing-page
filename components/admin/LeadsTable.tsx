"use client";

import { useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  createdAt: string;
  source: string;
  siteSource: string;
  leadScore: string;
  residence: string;
  budget: string;
  timeline: string;
  purpose: string;
  city: string;
  visitTime: string;
  requestedCallback: boolean;
};

type ScoreFilter = "all" | "hot" | "warm" | "cold" | "visit" | "callback";

const SCORE_FILTERS: { value: ScoreFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
  { value: "visit", label: "Visit Requested" },
  { value: "callback", label: "Callback Requested" },
];

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function siteSourceLabel(siteSource: string): string {
  return siteSource === "landing" ? "Landing Page" : "Website";
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCsv(rows: LeadRow[]) {
  const header = [
    "S.No", "Name", "Email", "Phone", "Source", "Site", "Lead Score", "Residence",
    "Budget", "Timeline", "Preferred Visit Date", "Preferred Visit Time",
    "Submitted On",
  ];
  const lines = [header.join(",")];
  rows.forEach((r, i) => {
    lines.push(
      [
        String(i + 1),
        csvEscape(r.name),
        csvEscape(r.email),
        csvEscape(r.phone),
        csvEscape(r.source === "chatbot" ? "Chatbot" : "Book a Visit"),
        csvEscape(siteSourceLabel(r.siteSource)),
        csvEscape(r.leadScore),
        csvEscape(r.residence),
        csvEscape(r.budget),
        csvEscape(r.timeline),
        csvEscape(formatDate(r.preferredDate)),
        csvEscape(r.visitTime),
        csvEscape(formatDateTime(r.createdAt)),
      ].join(",")
    );
  });
  const blob = new Blob(["﻿" + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `amaya-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      const matchesSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q);
      const matchesFrom = !fromDate || l.preferredDate >= fromDate;
      const matchesTo = !toDate || l.preferredDate <= toDate;
      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "visit" && Boolean(l.preferredDate)) ||
        (scoreFilter === "callback" && l.requestedCallback) ||
        l.leadScore === scoreFilter;
      return matchesSearch && matchesFrom && matchesTo && matchesScore;
    });
  }, [leads, search, fromDate, toDate, scoreFilter]);

  return (
    <div>
      <div className="admin-score-filters">
        {SCORE_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`admin-score-filter admin-score-filter--${f.value} ${scoreFilter === f.value ? "is-active" : ""}`}
            onClick={() => setScoreFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="admin-filters">
        <label className="admin-filter-field admin-filter-search">
          <span>Search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email or phone"
          />
        </label>
        <label className="admin-filter-field">
          <span>Visit From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label className="admin-filter-field">
          <span>Visit To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <div className="admin-filters-spacer" />
        <button
          className="admin-export-btn"
          type="button"
          onClick={() => downloadCsv(filtered)}
          disabled={filtered.length === 0}
        >
          <FiDownload size={13} /> Export to Excel
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-table-wrap">
          <p className="admin-empty">
            {leads.length === 0
              ? "No leads yet."
              : "No leads match these filters."}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Site</th>
                <th>Score</th>
                <th>Residence</th>
                <th>Budget</th>
                <th>Timeline</th>
                <th>Preferred Visit</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id}>
                  <td className="admin-col-sno">{i + 1}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email || "—"}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.source === "chatbot" ? "Chatbot" : "Book a Visit"}</td>
                  <td>{siteSourceLabel(lead.siteSource)}</td>
                  <td>
                    {lead.leadScore ? (
                      <span className={`admin-score-pill admin-score-pill--${lead.leadScore}`}>
                        {lead.leadScore}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{lead.residence || "—"}</td>
                  <td>{lead.budget || "—"}</td>
                  <td>{lead.timeline || "—"}</td>
                  <td>
                    {lead.preferredDate
                      ? `${formatDate(lead.preferredDate)}${lead.visitTime ? ` · ${lead.visitTime}` : ""}`
                      : "—"}
                  </td>
                  <td>{formatDateTime(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="admin-count">
        Showing {filtered.length} of {leads.length} lead{leads.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
