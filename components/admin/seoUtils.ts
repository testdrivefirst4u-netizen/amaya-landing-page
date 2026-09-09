export const SITE_DOMAIN = "amayaseniorliving.com";
export const SITE_URL = `https://www.${SITE_DOMAIN}`;

export type LengthStatus = "empty" | "good" | "warn" | "bad";

export function titleStatus(len: number): LengthStatus {
  if (len === 0) return "empty";
  if (len > 70) return "bad";
  if (len < 30 || len > 60) return "warn";
  return "good";
}

export function descriptionStatus(len: number): LengthStatus {
  if (len === 0) return "empty";
  if (len > 175) return "bad";
  if (len < 110 || len > 160) return "warn";
  return "good";
}

export const TITLE_RANGE = "30–60 characters recommended";
export const DESCRIPTION_RANGE = "110–160 characters recommended";

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}
