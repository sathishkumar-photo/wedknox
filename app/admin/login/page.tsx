// LOCATION: app/admin/login/page.tsx   (NEW location - delete the old app/login/page.tsx)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { COOKIE, verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  if (verifyToken(cookies().get(COOKIE)?.value)) redirect("/admin");
  return <LoginForm />;
}