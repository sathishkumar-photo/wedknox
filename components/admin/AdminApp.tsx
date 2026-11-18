// LOCATION: components/admin/AdminApp.tsx
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SECTION_KEYS, SECTION_LABELS, type Content, type SectionKey } from "@/lib/content-schema";
import { AdminContext, type UploadConfig } from "./context";
import { Btn } from "./ui";
import OverviewTab from "./tabs/OverviewTab";
import GeneralTab from "./tabs/GeneralTab";
import HomeTab from "./tabs/HomeTab";
import ServicesTab from "./tabs/ServicesTab";
import PortfolioTab from "./tabs/PortfolioTab";
import FilmsTab from "./tabs/FilmsTab";
import PackagesTab from "./tabs/PackagesTab";
import ReviewsTab from "./tabs/ReviewsTab";
import type { Update } from "./tabs/types";

const TABS: { id: string; label: string; sections: SectionKey[] }[] = [
  { id: "overview", label: "Overview", sections: [] },
  { id: "general", label: "Contact & SEO", sections: ["settings", "seo"] },
  { id: "home", label: "Home & About", sections: ["hero", "about"] },
  { id: "services", label: "Services", sections: ["services"] },
  { id: "portfolio", label: "Portfolio", sections: ["categories", "photos"] },
  { id: "films", label: "Films", sections: ["films"] },
  { id: "packages", label: "Packages", sections: ["packages"] },
  { id: "reviews", label: "Reviews", sections: ["testimonials"] },
];

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function AdminApp({ initial, problem, upload }: { initial: Content; problem: string; upload: UploadConfig | null }) {
  const [draft, setDraft] = useState<Content>(initial);
  const [saved, setSaved] = useState<Content>(initial);
  const [tab, setTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const toast = useCallback((type: "ok" | "error", text: string) => setToastMsg({ type, text }), []);
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), toastMsg.type === "error" ? 9000 : 4500);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const update: Update = useCallback((key, fn) => {
    setDraft((d) => ({ ...d, [key]: fn(d[key]) }));
  }, []);

  const dirty = useMemo(() => SECTION_KEYS.filter((k) => !same(draft[k], saved[k])), [draft, saved]);

  // Warn before closing the tab with unsaved work.
  useEffect(() => {
    if (!dirty.length) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty.length]);

  async function saveAll() {
    if (!dirty.length || saving) return;
    setSaving(true);
    const sent: Partial<Content> = {};
    for (const k of dirty) (sent as Record<string, unknown>)[k] = draft[k];
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: sent }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error(data.error || "Saving failed.");
      const clean = (data.saved || {}) as Partial<Content>;
      setSaved((s) => ({ ...s, ...clean }));
      // Use the cleaned-up version (trimmed spaces etc.) unless you kept typing while it saved.
      setDraft((d) => {
        const next = { ...d } as Record<string, unknown>;
        for (const k of Object.keys(clean) as SectionKey[]) if (same(d[k], (sent as Record<string, unknown>)[k])) next[k] = clean[k];
        return next as Content;
      });
      toast("ok", "Saved! Your website is updated.");
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Saving failed.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    if (dirty.length && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const tabProps = { draft, update, setDraft };
  const dirtyLabels = dirty.map((k) => SECTION_LABELS[k]);

  return (
    <AdminContext.Provider value={{ upload, toast }}>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-serif text-2xl leading-none text-gold">Wedknox Admin</p>
            <p className="text-xs text-mute">Manage your whole website</p>
          </div>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="gold-border rounded-lg px-3.5 py-2 text-sm hover:bg-char">View website ↗</a>
            <Btn onClick={logout}>Log out</Btn>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3" aria-label="Admin sections">
          {TABS.map((t) => {
            const isDirty = t.sections.some((s) => dirty.includes(s));
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${tab === t.id ? "bg-gold font-semibold text-ink" : "gold-border hover:bg-char"}`}>
                {t.label}
                {isDirty && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-400" title="Unsaved changes" />}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-32">
        {tab === "overview" && <OverviewTab draft={draft} problem={problem} goto={setTab} />}
        {tab === "general" && <GeneralTab {...tabProps} />}
        {tab === "home" && <HomeTab {...tabProps} />}
        {tab === "services" && <ServicesTab {...tabProps} />}
        {tab === "portfolio" && <PortfolioTab {...tabProps} />}
        {tab === "films" && <FilmsTab {...tabProps} />}
        {tab === "packages" && <PackagesTab {...tabProps} />}
        {tab === "reviews" && <ReviewsTab {...tabProps} />}
      </main>

      {toastMsg && (
        <div role="status" className={`fixed left-1/2 top-24 z-50 w-[92%] max-w-xl -translate-x-1/2 rounded-xl px-4 py-3 text-sm shadow-xl ${toastMsg.type === "ok" ? "bg-emerald-900 text-emerald-50" : "bg-red-900 text-red-50"}`}>
          <div className="flex items-start justify-between gap-3">
            <span>{toastMsg.text}</span>
            <button type="button" aria-label="Close message" onClick={() => setToastMsg(null)} className="text-lg leading-none opacity-70 hover:opacity-100">×</button>
          </div>
        </div>
      )}

      {dirty.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-char/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm text-soft">
              <b>Unsaved changes</b> <span className="text-mute">in {dirtyLabels.join(", ")}</span>
            </p>
            <div className="flex gap-2">
              <Btn disabled={saving} onClick={() => window.confirm("Throw away all unsaved changes?") && setDraft(saved)}>Discard</Btn>
              <Btn kind="gold" disabled={saving} onClick={saveAll}>{saving ? "Saving…" : "Save changes"}</Btn>
            </div>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}