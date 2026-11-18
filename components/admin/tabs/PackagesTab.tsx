// LOCATION: components/admin/tabs/PackagesTab.tsx
"use client";
import type { Pkg } from "@/lib/content-schema";
import { Btn, Card, Check, TextField, ReorderButtons, moveItem } from "../ui";
import type { TabProps } from "./types";

export default function PackagesTab({ draft, update }: TabProps) {
  const data = draft.packages;
  const setItem = (i: number, patch: Partial<Pkg>) => update("packages", (d) => ({ ...d, items: d.items.map((p, n) => (n === i ? { ...p, ...patch } : p)) }));

  return (
    <div className="space-y-6">
      <Card title="Special offer banner" hint="The gold box above the packages. Tick “complimentary pre-wedding shoot” on the packages that include it.">
        <div className="grid gap-4">
          <Check label="Show the offer banner" checked={data.offerEnabled} onChange={(v) => update("packages", (d) => ({ ...d, offerEnabled: v }))} />
          <TextField label="Banner text" value={data.offerTitle} maxLength={100} onChange={(v) => update("packages", (d) => ({ ...d, offerTitle: v }))} />
        </div>
      </Card>

      <Card
        title="Packages & prices"
        hint="Type the price exactly as visitors should see it, for example ₹75,000."
        right={<Btn kind="gold" onClick={() => update("packages", (d) => ({ ...d, items: [...d.items, { name: "New package", price: "₹", note: "", complimentary: false }] }))}>+ Add package</Btn>}
      >
        {data.items.length === 0 && <p className="text-sm text-mute">No packages yet. Press “Add package”.</p>}
        <div className="space-y-4">
          {data.items.map((p, i) => (
            <div key={i} className="gold-border rounded-xl bg-char p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Package name" value={p.name} maxLength={60} onChange={(v) => setItem(i, { name: v })} />
                <TextField label="Price" value={p.price} maxLength={30} onChange={(v) => setItem(i, { price: v })} placeholder="₹75,000" />
                <div className="sm:col-span-2">
                  <TextField label="Extra line (optional)" hint="Example: Includes 2 Premium Albums" value={p.note} maxLength={120} onChange={(v) => setItem(i, { note: v })} />
                </div>
              </div>
              <div className="mt-3">
                <Check label="Includes complimentary pre-wedding shoot" checked={p.complimentary} onChange={(v) => setItem(i, { complimentary: v })} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                <ReorderButtons index={i} count={data.items.length} onMove={(to) => update("packages", (d) => ({ ...d, items: moveItem(d.items, i, to) }))} />
                <Btn kind="danger" onClick={() => window.confirm(`Delete “${p.name}”?`) && update("packages", (d) => ({ ...d, items: d.items.filter((_, n) => n !== i) }))}>Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}