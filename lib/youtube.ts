/**
 * YouTube video ID extraction/validation for the Body editor's video embed
 * feature. This is the only path that turns admin-pasted input into an
 * embeddable ID — restricted to YouTube's own domains and a strict ID
 * pattern, so it doubles as the feature's security boundary against
 * arbitrary iframe/embed injection.
 */
const ALLOWED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]);

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function isValidYoutubeId(id: unknown): id is string {
  return typeof id === "string" && YOUTUBE_ID_RE.test(id);
}

/** Extracts a video ID from a youtube.com/watch, youtu.be, /embed/, or
 * /shorts/ URL. Returns null for anything else, including non-YouTube
 * hosts or malformed URLs. */
export function extractYoutubeVideoId(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (!ALLOWED_HOSTS.has(url.hostname)) return null;

  let id: string | null = null;
  if (url.hostname === "youtu.be") {
    id = url.pathname.slice(1);
  } else if (url.pathname === "/watch") {
    id = url.searchParams.get("v");
  } else if (url.pathname.startsWith("/embed/")) {
    id = url.pathname.slice("/embed/".length);
  } else if (url.pathname.startsWith("/shorts/")) {
    id = url.pathname.slice("/shorts/".length);
  }
  if (!id) return null;

  id = id.split(/[/?&#]/)[0];
  return isValidYoutubeId(id) ? id : null;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
