// LOCATION: components/admin/tabs/OverviewTab.tsx
"use client";
import type { Content } from "@/lib/content-schema";
import { Card } from "../ui";

export default function OverviewTab({ draft, problem, goto }: { draft: Content; problem: string; goto: (tab: string) => void }) {
  const stats: [string, number, string][] = [
    ["Photos", draft.photos.length, "portfolio"],
    ["Films", draft.films.length, "films"],
    ["Packages", draft.packages.items.length, "packages"],
    ["Services", draft.services.length, "services"],
    ["Client reviews", draft.testimonials.length, "reviews"],
  ];
  return (
    <div className="space-y-6">
      {problem ? (
        <div className="rounded-2xl border border-red-500/50 bg-red-950/30 p-5">
          <p className="font-semibold text-red-200">Setup not finished</p>
          <p className="mt-1 text-sm text-red-100/90">{problem}</p>
          <p className="mt-2 text-sm text-red-100/70">You can look around, but Save and Upload will not work until this is fixed. Your public website is not affected.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5">
          <p className="font-semibold text-emerald-200">✓ Connected</p>
          <p className="mt-1 text-sm text-emerald-100/80">Saving and uploading are ready. Every change you save here appears on your website straight away.</p>
        </div>
      )}

      <Card title="What is on your website now">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {stats.map(([label, n, tab]) => (
            <button key={label} type="button" onClick={() => goto(tab)} className="gold-border rounded-xl bg-char p-4 text-left hover:bg-ink">
              <div className="font-serif text-4xl text-gold">{n}</div>
              <div className="text-sm text-mute">{label}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card title="How to use this page">
        <ol className="list-decimal space-y-2 pl-5 text-sm text-mute">
          <li>Pick a tab above (Services, Portfolio, Films, Packages …).</li>
          <li>Change text, add or delete items, upload photos or films.</li>
          <li>
            Press the gold <b className="text-ivory">Save changes</b> button at the bottom. Nothing goes live until you press it.
          </li>
          <li>Open your website in another tab and refresh to see the result.</li>
        </ol>
        <p className="mt-4 text-sm text-mute">
          Tip: photos are shrunk automatically before they are uploaded, so your website stays fast. Films can be uploaded (up to 50 MB) or pasted as a YouTube link.
        </p>
      </Card>
    </div>
  );
}