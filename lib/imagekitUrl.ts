/**
 * Client-safe helper: appends an ImageKit transformation to a URL for
 * responsive/optimized delivery. No-ops for anything that isn't an actual
 * ImageKit URL (e.g. the site's existing local /public asset paths), so it's
 * safe to wrap every image without checking its source first.
 */
export function ikTransform(url: string, transformation: string): string {
  if (!url || !url.includes("ik.imagekit.io")) return url;
  const [base, query] = url.split("?");
  const params = new URLSearchParams(query);
  params.set("tr", transformation);
  return `${base}?${params.toString()}`;
}

// Common presets used across cards, featured images and social previews.
export const IK_CARD = "w-600,h-450,c-maintain_ratio,q-80,f-auto";
export const IK_FEATURED = "w-1400,q-85,f-auto";
export const IK_SOCIAL = "w-1200,h-630,c-maintain_ratio,q-85,f-auto";
export const IK_THUMB = "w-320,q-70,f-auto";
