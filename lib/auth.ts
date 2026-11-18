// LOCATION: lib/auth.ts   (REPLACE the old file)
// SERVER ONLY. Admin login = Supabase Auth (email + password) + a signed cookie that keeps you logged in.
import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

export const COOKIE = "wk_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7; // stay logged in for 7 days

const secret = () => process.env.ADMIN_SESSION_SECRET || "";

/** Emails allowed to open the admin page (set ADMIN_EMAIL in .env.local; separate several with commas). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email) && adminEmails().includes(String(email).trim().toLowerCase());
}

export function authConfigured() {
  return (
    adminEmails().length > 0 &&
    secret().length >= 16 &&
    Boolean(process.env.SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_ANON_KEY)
  );
}

const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("hex");
const toB64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const fromB64 = (s: string) => Buffer.from(s, "base64url").toString("utf8");

/** Called by the login route AFTER Supabase has confirmed the email + password. */
export function makeToken(email: string) {
  const body = `v2.${Math.floor(Date.now() / 1000) + SESSION_SECONDS}.${toB64(email.toLowerCase())}`;
  return `${body}.${sign(body)}`;
}

export function verifyToken(token?: string | null) {
  if (!token || !authConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v2") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(parts.slice(0, 3).join(".")));
  const given = Buffer.from(parts[3]);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  // Remove an email from ADMIN_EMAIL and that person is logged out immediately.
  return isAdminEmail(fromB64(parts[2]));
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_SECONDS,
};

/** Use at the top of every admin API route. Returns an error response if NOT logged in, otherwise null. */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (verifyToken(req.cookies.get(COOKIE)?.value)) return null;
  return NextResponse.json({ error: "Please log in again." }, { status: 401 });
}