/** Strips non-digits and caps at 10 characters, for use in controlled inputs. */
export function normalizePhoneInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

/** Valid Indian mobile: 10 digits, starts 6-9, not all the same digit. */
export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (!/^[6-9]\d{9}$/.test(digits)) return false;
  if (/^(\d)\1{9}$/.test(digits)) return false;
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Basic, permissive email shape check — not exhaustive RFC validation. */
export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(raw.trim());
}
