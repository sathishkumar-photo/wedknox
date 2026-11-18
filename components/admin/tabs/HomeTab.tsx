// LOCATION: components/admin/tabs/HomeTab.tsx
"use client";
import { Card, TextField, AreaField } from "../ui";
import type { TabProps } from "./types";

export default function HomeTab({ draft, update }: TabProps) {
  const h = draft.hero;
  const a = draft.about;
  const setH = (patch: Partial<typeof h>) => update("hero", (p) => ({ ...p, ...patch }));
  const setA = (patch: Partial<typeof a>) => update("about", (p) => ({ ...p, ...patch }));
  return (
    <div className="space-y-6">
      <Card title="Top of the home page" hint="The big heading and text visitors see first.">
        <div className="grid gap-4">
          <TextField label="Small line above the heading" value={h.eyebrow} maxLength={60} onChange={(v) => setH({ eyebrow: v })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Heading (white)" value={h.title} maxLength={60} onChange={(v) => setH({ title: v })} />
            <TextField label="Heading, second part (gold, italic)" hint="Optional" value={h.accent} maxLength={60} onChange={(v) => setH({ accent: v })} />
          </div>
          <TextField label="Tagline" value={h.tagline} maxLength={100} onChange={(v) => setH({ tagline: v })} />
          <AreaField label="Description" value={h.description} maxLength={300} onChange={(v) => setH({ description: v })} />
        </div>
      </Card>

      <Card title="About section" hint="“The Story Behind …” section.">
        <div className="grid gap-4">
          <TextField label="Heading" value={a.title} maxLength={80} onChange={(v) => setA({ title: v })} />
          <AreaField label="First paragraph" rows={4} value={a.paragraph1} maxLength={800} onChange={(v) => setA({ paragraph1: v })} />
          <AreaField label="Second paragraph (optional)" rows={3} value={a.paragraph2} maxLength={800} onChange={(v) => setA({ paragraph2: v })} />
        </div>
      </Card>
    </div>
  );
}