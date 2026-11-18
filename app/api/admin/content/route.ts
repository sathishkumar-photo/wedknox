// LOCATION: app/api/admin/content/route.ts   (NEW location - delete the old app/api/admin/login/content folder)
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { HttpError, saveSections } from "@/lib/content-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Saves one or more sections, e.g. { "sections": { "packages": {...}, "films": [...] } }
export async function PUT(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const sections = (body as { sections?: unknown })?.sections;
  if (!sections || typeof sections !== "object" || Array.isArray(sections)) {
    return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
  }

  try {
    const saved = await saveSections(sections as Record<string, unknown>);
    return NextResponse.json({ ok: true, saved });
  } catch (e) {
    if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error("[admin/content] save failed", e);
    return NextResponse.json({ error: "Something went wrong while saving." }, { status: 500 });
  }
}