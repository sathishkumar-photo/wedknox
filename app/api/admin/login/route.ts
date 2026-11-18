// LOCATION: app/api/admin/login/route.ts   (REPLACE the old file)
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authConfigured, COOKIE, cookieOptions, isAdminEmail, makeToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Slows down password guessing: max 8 wrong tries per 15 minutes per visitor.
const tries = new Map<string, { count: number; resetAt: number }>();
const MAX_TRIES = 8;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not set up yet. Add SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL and ADMIN_SESSION_SECRET to .env.local, then restart." },
      { status: 503 }
    );
  }
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const now = Date.now();
  const entry = tries.get(ip);
  if (entry && entry.resetAt > now && entry.count >= MAX_TRIES) {
    return NextResponse.json({ error: "Too many wrong attempts. Please wait 15 minutes and try again." }, { status: 429 });
  }

  let email = "";
  let password = "";
  try {
    const body = await req.json();
    if (typeof body?.email === "string") email = body.email.trim().toLowerCase();
    if (typeof body?.password === "string") password = body.password;
  } catch {
    /* empty body */
  }

  const fail = async (message: string, status = 401) => {
    const fresh = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
    fresh.count += 1;
    tries.set(ip, fresh);
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ error: message }, { status });
  };

  if (!email || !password) return fail("Enter your email and password.", 400);

  // Ask Supabase Auth to check the email + password.
  const sb = createClient(process.env.SUPABASE_URL!.trim().replace(/\/+$/, ""), process.env.SUPABASE_ANON_KEY!.trim(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.user?.email) return fail("Wrong email or password.");

  // Only emails listed in ADMIN_EMAIL may enter (so nobody else can sign up and get in).
  if (!isAdminEmail(data.user.email)) return fail("This account is not allowed to use the admin page.", 403);

  tries.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeToken(data.user.email), cookieOptions);
  return res;
}