// LOCATION: components/admin/upload.ts
// Browser-side helpers: shrink photos before upload, grab a poster picture from a video, and upload files.
import type { UploadConfig } from "./context";

export type UploadKind = "photo" | "image" | "video";

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

const EXT_TYPES: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
};
/** Some phones/computers leave file.type empty, so fall back to the file ending. */
function guessType(type: string, name: string) {
  if (type) return type;
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return EXT_TYPES[ext] || "";
}

/** Uploads one file straight to Supabase storage and returns its public web address. */
export async function uploadBlob(cfg: UploadConfig, blob: Blob, kind: UploadKind, filename: string): Promise<string> {
  const contentType = guessType(blob.type, filename);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, filename, contentType, size: blob.size }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Please log in again.");
  }
  if (!res.ok) throw new Error(data.error || "Could not start the upload.");

  const { createClient } = await import("@supabase/supabase-js"); // loaded only when you upload
  const sb = createClient(cfg.url, cfg.anonKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { error } = await sb.storage.from("media").uploadToSignedUrl(data.path, data.token, blob, { contentType });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return data.publicUrl as string;
}

async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; close: () => void }> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
  } catch {
    // Older browsers: decode through an <img> element instead.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/** Shrinks a picture so the website stays fast (long side max 1800px, JPEG). Returns the new file + its size. */
export async function prepareImage(file: File, maxSide = 1800, quality = 0.85) {
  if (!/^image\//.test(guessType(file.type, file.name))) throw new Error("This is not a picture file (use JPG, PNG or WebP).");
  let img;
  try {
    img = await decode(file);
  } catch {
    throw new Error("Could not read this picture. Please use a JPG, PNG or WebP file.");
  }
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not process this picture.");
  ctx.fillStyle = "#ffffff"; // PNGs with see-through areas become white instead of black
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img.source, 0, 0, w, h);
  img.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) throw new Error("Could not process this picture.");
  return { blob, w, h };
}

/** Shrink + upload a picture. */
export async function uploadImage(cfg: UploadConfig, file: File, kind: "photo" | "image" = "photo", maxSide = 1800) {
  const { blob, w, h } = await prepareImage(file, maxSide);
  const url = await uploadBlob(cfg, blob, kind, file.name.replace(/\.[^.]+$/, "") + ".jpg");
  return { url, w, h };
}

/** Takes a still picture from the first second of a video (used as the film's cover). Returns null if the browser can't. */
export function captureVideoFrame(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let finished = false;
    const done = (blob: Blob | null) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    const timer = setTimeout(() => done(null), 10000);
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.onerror = () => done(null);
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    };
    video.onseeked = () => {
      try {
        const scale = Math.min(1, 1280 / (video.videoWidth || 1280));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round((video.videoWidth || 1280) * scale));
        canvas.height = Math.max(1, Math.round((video.videoHeight || 720) * scale));
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((b) => done(b), "image/jpeg", 0.8);
      } catch {
        done(null);
      }
    };
    video.src = url;
  });
}