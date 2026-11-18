// LOCATION: components/admin/tabs/ServicesTab.tsx
"use client";
import { useState } from "react";
import type { Service } from "@/lib/content-schema";
import { useAdmin } from "../context";
import { errMsg, uploadImage } from "../upload";
import { Btn, Card, FilePick, Field, TextField, AreaField, Thumb, ReorderButtons, moveItem, inputCls } from "../ui";
import type { TabProps } from "./types";

export default function ServicesTab({ draft, update }: TabProps) {
  const { upload, toast } = useAdmin();
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const list = draft.services;

  const setItem = (i: number, patch: Partial<Service>) => update("services", (l) => l.map((s, n) => (n === i ? { ...s, ...patch } : s)));

  async function pickImage(i: number, files: File[]) {
    if (!upload) return toast("error", "Uploads are not ready yet. Finish the Supabase setup first.");
    setBusyIndex(i);
    try {
      const r = await uploadImage(upload, files[0], "image", 1400);
      setItem(i, { image: r.url });
      toast("ok", "Picture added. Press Save changes to publish it.");
    } catch (e) {
      toast("error", errMsg(e));
    } finally {
      setBusyIndex(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card
        title="Services"
        hint="The cards in the “Photography Services” section. These names also appear in the enquiry form and the footer. Each card shows a cover picture: either a photo from a portfolio category, or one you upload."
        right={<Btn kind="gold" onClick={() => update("services", (l) => [...l, { name: "New service", description: "", category: "", image: "" }])}>+ Add service</Btn>}
      >
        {list.length === 0 && <p className="text-sm text-mute">No services yet. Press “Add service”.</p>}
        <div className="space-y-4">
          {list.map((s, i) => {
            const cover = s.image || draft.photos.find((p) => p.cat === s.category)?.src;
            const categoryKnown = !s.category || draft.categories.includes(s.category);
            return (
              <div key={i} className="gold-border rounded-xl bg-char p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="space-y-2">
                    <Thumb src={cover} className="h-28 w-40" />
                  </div>
                  <div className="grid flex-1 gap-3">
                    <TextField label="Service name" value={s.name} maxLength={60} onChange={(v) => setItem(i, { name: v })} />
                    <AreaField label="Short description" rows={2} value={s.description} maxLength={200} onChange={(v) => setItem(i, { description: v })} />
                    <Field label="Cover picture comes from this portfolio category" hint="Uses the first photo of that category (unless you upload your own picture below).">
                      <select className={inputCls} value={s.category} onChange={(e) => setItem(i, { category: e.target.value })}>
                        <option value="">(none)</option>
                        {!categoryKnown && <option value={s.category}>{s.category} (category no longer exists)</option>}
                        {draft.categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <div className="flex flex-wrap gap-2">
                      <FilePick accept="image/jpeg,image/png,image/webp" disabled={busyIndex === i} onPick={(f) => pickImage(i, f)}>
                        {busyIndex === i ? "Uploading…" : s.image ? "Replace my own picture" : "Upload my own picture"}
                      </FilePick>
                      {s.image && <Btn onClick={() => setItem(i, { image: "" })}>Use category photo instead</Btn>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                  <ReorderButtons index={i} count={list.length} onMove={(to) => update("services", (l) => moveItem(l, i, to))} />
                  <Btn kind="danger" onClick={() => window.confirm(`Delete the service “${s.name}”?`) && update("services", (l) => l.filter((_, n) => n !== i))}>Delete</Btn>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}