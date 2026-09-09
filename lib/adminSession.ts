/**
 * Minimal signed-cookie session for the /admin dashboard, implemented with
 * Web Crypto so it works in both the Edge middleware and Node API routes
 * without extra dependencies (no next-auth needed for a single admin user).
 */
export const ADMIN_SESSION_COOKIE = "amaya_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  arr.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url: string): Uint8Array {
  const pad = (4 - (b64url.length % 4)) % 4;
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "insecure-dev-secret-change-me";
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = JSON.stringify({
    u: username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const payloadB64 = toBase64Url(encoder.encode(payload));
  const key = await getKey(getSecret());
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return `${payloadB64}.${toBase64Url(sig)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;

  const key = await getKey(getSecret());
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  if (toBase64Url(expectedSig) !== sigB64) return false;

  try {
    const payload = JSON.parse(decoder.decode(fromBase64Url(payloadB64)));
    return typeof payload.exp === "number" && Date.now() < payload.exp;
  } catch {
    return false;
  }
}
