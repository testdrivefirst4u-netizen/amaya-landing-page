/**
 * Server-only ImageKit client for Blog/Media image uploads, implemented
 * against ImageKit's plain REST API (via Node's built-in fetch/FormData) so
 * no extra npm dependency is required. Never import this from a "use
 * client" component — IMAGEKIT_PRIVATE_KEY must stay off the browser
 * bundle entirely. All uploads go through
 * app/api/admin/blogs/upload/route.ts, which is the only caller.
 */

const UPLOAD_ENDPOINT = "https://upload.imagekit.io/api/v1/files/upload";
const API_BASE = "https://api.imagekit.io/v1/files";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

export function isImageKitConfigured(): boolean {
  return !!publicKey && !!privateKey && !!urlEndpoint;
}

function authHeader(): string {
  return `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;
}

export type ImageKitUploadResult = {
  url: string;
  fileId: string;
  width?: number;
  height?: number;
};

/** Uploads a buffer to ImageKit and returns its public CDN URL + file id. */
export async function uploadToImageKit(
  buffer: Buffer,
  fileName: string,
  folder = "/amaya-uploads"
): Promise<ImageKitUploadResult> {
  if (!isImageKitConfigured()) {
    throw new Error(
      "ImageKit is not configured — set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT."
    );
  }

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)]), fileName);
  form.append("fileName", fileName);
  form.append("folder", folder);
  form.append("useUniqueFileName", "true");

  const res = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { Authorization: authHeader() },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `ImageKit upload failed (${res.status}).`);
  }

  return {
    url: data.url,
    fileId: data.fileId,
    width: data.width,
    height: data.height,
  };
}

export async function deleteFromImageKit(fileId: string): Promise<void> {
  if (!isImageKitConfigured()) return;
  const res = await fetch(`${API_BASE}/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: authHeader() },
  });
  if (!res.ok && res.status !== 404) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || `ImageKit delete failed (${res.status}).`);
  }
}
