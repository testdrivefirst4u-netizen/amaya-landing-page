/**
 * Notifies IndexNow-participating search engines (Bing, Yandex, Seznam —
 * not Google, which doesn't support the protocol) that a URL was just
 * published or updated, so they can crawl it immediately instead of
 * waiting for their next scheduled sitemap check. Requires INDEXNOW_KEY to
 * be set and public/<key>.txt to exist with that exact key as its content.
 * Best-effort only: never throws, so a failed ping never blocks publishing.
 */
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITE_URL = "https://www.amayaseniorliving.com";
const SITE_HOST = "www.amayaseniorliving.com";

export function isIndexNowConfigured(): boolean {
  return !!INDEXNOW_KEY;
}

export async function pingIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_KEY || urls.length === 0) return;

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Best-effort notification — a network hiccup here must not fail the
    // admin's save action.
  }
}
