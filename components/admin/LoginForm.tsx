// LOCATION: components/admin/LoginForm.tsx   (REPLACE the old file)
"use client";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed.");
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setBusy(false);
    }
  }

  const input = "mt-1 w-full rounded-lg gold-border bg-ink px-3 py-3 text-ivory focus:outline-none focus:ring-1 focus:ring-gold";

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="gold-border glass w-full max-w-sm rounded-2xl p-7">
        <p className="font-serif text-4xl text-gold">Wedknox Admin</p>
        <p className="mt-1 text-sm text-mute">Log in with your admin email and password.</p>

        <label htmlFor="admin-email" className="mt-6 block text-sm text-soft">Email</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />

        <label htmlFor="admin-password" className="mt-4 block text-sm text-soft">Password</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
        />

        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={busy || !email || !password} className="mt-5 w-full rounded-full bg-gold py-3 font-semibold text-ink disabled:opacity-50">
          {busy ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}