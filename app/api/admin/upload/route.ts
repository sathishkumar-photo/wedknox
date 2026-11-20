// LOCATION: app/api/admin/upload/route.ts   (this file must contain the UPLOAD code, with an exported POST function)
import { randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adminClient, BUCKET } from "@/lib/content-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MB = 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const VIDEO_TYPES: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" };

const KINDS = {
  photo: { folder: "photos", types: IMAGE_TYPES, maxBytes: 15 * MB, label: "photo" },
  image: { folder: "images", types: IMAGE_TYPES, maxBytes: 15 * MB, label: "image" },
  video: { folder: "videos", types: VIDEO_TYPES, maxBytes: 50 * MB, label: "video" },
} as const;

// Step 1 of an upload: the browser asks for permission, we hand back a one-time upload ticket.
// The file itself then goes straight from the browser to Supabase (so big videos never pass through this server).
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const db = adminClient();
  if (!db) return NextResponse.json({ error: "Supabase is not connected yet. Finish the Supabase setup first." }, { status: 503 });

  let body: { kind?: string; filename?: string; contentType?: string; size?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const kind = body.kind as keyof typeof KINDS;
  const spec = KINDS[kind];
  if (!spec) return NextResponse.json({ error: "Unknown upload type." }, { status: 400 });

  const ext = spec.types[body.contentType || ""];
  if (!ext) {
    return NextResponse.json(
      { error: `This file type is not allowed for a ${spec.label}. Allowed: ${Object.values(spec.types).join(", ")}.` },
      { status: 400 }
    );
  }
  if (typeof body.size === "number" && body.size > spec.maxBytes) {
    return NextResponse.json({ error: `That ${spec.label} is too big (maximum ${Math.round(spec.maxBytes / MB)} MB).` }, { status: 400 });
  }

  const slug =
    String(body.filename || "file")
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "file";
  const path = `${spec.folder}/${Date.now().toString(36)}-${randomBytes(4).toString("hex")}-${slug}.${ext}`;

  const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json({ error: `Could not start the upload: ${error?.message || "unknown error"}` }, { status: 500 });
  }
  const publicUrl = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  return NextResponse.json({ path: data.path, token: data.token, publicUrl });
}