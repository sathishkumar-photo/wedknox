// LOCATION: app/admin/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminApp from "@/components/admin/AdminApp";
import { COOKIE, verifyToken } from "@/lib/auth";
import { getContentWithStatus, supabaseEnv } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Every admin page checks the login itself (not only a gate in front of it).
  if (!verifyToken(cookies().get(COOKIE)?.value)) redirect("/admin/login");

  const { content, status } = await getContentWithStatus();
  const env = supabaseEnv();
  const canUpload = env.configured && Boolean(env.anonKey);
  const problem = status.problem || (!canUpload ? "SUPABASE_ANON_KEY is missing, so photo and film uploads are switched off. Add it to your environment settings." : "");

  return <AdminApp initial={content} problem={problem} upload={canUpload ? { url: env.url, anonKey: env.anonKey } : null} />;
}