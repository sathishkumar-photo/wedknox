// LOCATION: app/api/admin/logout/route.ts   (NEW location - delete the old app/api/admin/login/logout folder)
import { NextResponse } from "next/server";
import { COOKIE, cookieOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}