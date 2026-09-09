/**
 * Retries a DB call once after a short delay before giving up. A single
 * dropped connection or momentary network blip shouldn't turn into a 5xx
 * for a page that would have rendered fine a second later.
 */
export async function withRetry<T>(fn: () => Promise<T>, delayMs = 300): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("DB call failed, retrying once:", err);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return fn();
  }
}
