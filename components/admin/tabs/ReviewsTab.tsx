// LOCATION: components/admin/tabs/ReviewsTab.tsx
"use client";
import { Btn, Card, TextField, AreaField, ReorderButtons, moveItem } from "../ui";
import type { TabProps } from "./types";

export default function ReviewsTab({ draft, update }: TabProps) {
  const list = draft.testimonials;
  const setItem = (i: number, patch: Partial<(typeof list)[number]>) => update("testimonials", (l) => l.map((t, n) => (n === i ? { ...t, ...patch } : t)));
  return (
    <Card
      title="Client reviews"
      hint="Add only real reviews that the client has agreed to share. The “Client Stories” section stays hidden on the website while this list is empty."
      right={<Btn kind="gold" onClick={() => update("testimonials", (l) => [...l, { quote: "", name: "" }])}>+ Add review</Btn>}
    >
      {list.length === 0 && <p className="text-sm text-mute">No reviews yet. Press “Add review”.</p>}
      <div className="space-y-4">
        {list.map((t, i) => (
          <div key={i} className="gold-border rounded-xl bg-char p-4">
            <div className="grid gap-3">
              <AreaField label="Review" rows={3} value={t.quote} maxLength={600} onChange={(v) => setItem(i, { quote: v })} />
              <TextField label="Client name" value={t.name} maxLength={80} onChange={(v) => setItem(i, { name: v })} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
              <ReorderButtons index={i} count={list.length} onMove={(to) => update("testimonials", (l) => moveItem(l, i, to))} />
              <Btn kind="danger" onClick={() => window.confirm("Delete this review?") && update("testimonials", (l) => l.filter((_, n) => n !== i))}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}