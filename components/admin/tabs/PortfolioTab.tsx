// LOCATION: components/admin/tabs/PortfolioTab.tsx
"use client";
import { useState } from "react";
import type { Photo } from "@/lib/content-schema";
import { useAdmin } from "../context";
import { errMsg, uploadImage } from "../upload";
import { Btn, Card, FilePick, Field, inputCls } from "../ui";
import type { TabProps } from "./types";

const PAGE = 24;

export default function PortfolioTab({ draft, update, setDraft }: TabProps) {
  const { upload, toast } = useAdmin();
  const { photos, categories } = draft;
  const [filter, setFilter] = useState("All");
  const [target, setTarget] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const [newCat, setNewCat] = useState("");

  const activeFilter = filter === "All" || categories.includes(filter) ? filter : "All";
  const uploadCat = categories.includes(target) ? target : categories[0] ?? "";
  const count = (c: string) => photos.filter((p) => p.cat === c).length;
  const visible = photos.filter((p) => activeFilter === "All" || p.cat === activeFilter);

  // ---- photos ----
  const patchPhoto = (src: string, patch: Partial<Photo>) => update("photos", (l) => l.map((p) => (p.src === src ? { ...p, ...patch } : p)));

  function move(src: string, dir: -1 | 1) {
    update("photos", (list) => {
      const i = list.findIndex((p) => p.src === src);
      if (i < 0) return list;
      // Move relative to the next photo that is currently visible (so it works while a category filter is on).
      let j = i + dir;
      while (j >= 0 && j < list.length && activeFilter !== "All" && list[j].cat !== activeFilter) j += dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  const makeFirst = (src: string) => update("photos", (l) => {
    const p = l.find((x) => x.src === src);
    return p ? [p, ...l.filter((x) => x.src !== src)] : l;
  });
  const removePhoto = (src: string) => window.confirm("Delete this photo from the website?") && update("photos", (l) => l.filter((p) => p.src !== src));

  async function onPick(files: File[]) {
    if (!upload) return toast("error", "Uploads are not ready yet. Finish the Supabase setup first.");
    if (!uploadCat) return toast("error", "Create a category first (in the box above), then upload.");
    setBusy({ done: 0, total: files.length });
    let added = 0;
    const failed: string[] = [];
    for (const file of files) {
      try {
        const r = await uploadImage(upload, file, "photo", 1800);
        const photo: Photo = { src: r.url, cat: uploadCat, alt: `${uploadCat} photograph`, w: r.w, h: r.h };
        const at = added;
        // New photos go to the very top, in the order you selected them.
        update("photos", (l) => [...l.slice(0, at), photo, ...l.slice(at)]);
        added += 1;
      } catch (e) {
        failed.push(`${file.name}: ${errMsg(e)}`);
      }
      setBusy((b) => (b ? { ...b, done: b.done + 1 } : b));
    }
    setBusy(null);
    if (added) toast(failed.length ? "error" : "ok", `${added} photo${added > 1 ? "s" : ""} uploaded${failed.length ? `, ${failed.length} failed (${failed[0]})` : ""}. Press Save changes to publish.`);
    else toast("error", failed[0] || "Nothing was uploaded.");
  }

  // ---- categories ----
  function addCategory() {
    const name = newCat.trim();
    if (!name) return;
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) return toast("error", "That category already exists.");
    update("categories", (l) => [...l, name]);
    setNewCat("");
  }
  function renameCategory(old: string) {
    const name = (window.prompt("New name for this category:", old) || "").trim();
    if (!name || name === old) return;
    if (categories.some((c) => c !== old && c.toLowerCase() === name.toLowerCase())) return toast("error", "That category already exists.");
    // Photos and services that used the old name follow the new name automatically.
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) => (c === old ? name : c)),
      photos: d.photos.map((p) => (p.cat === old ? { ...p, cat: name } : p)),
      services: d.services.map((s) => (s.category === old ? { ...s, category: name } : s)),
    }));
    if (filter === old) setFilter(name);
  }
  function deleteCategory(name: string) {
    const n = count(name);
    if (n > 0) return toast("error", `“${name}” still has ${n} photo${n > 1 ? "s" : ""}. Delete them or move them to another category first.`);
    if (!window.confirm(`Delete the category “${name}”?`)) return;
    setDraft((d) => ({ ...d, categories: d.categories.filter((c) => c !== name), services: d.services.map((s) => (s.category === name ? { ...s, category: "" } : s)) }));
  }

  return (
    <div className="space-y-6">
      <Card title="Portfolio categories" hint="These are the filter buttons above the photo gallery.">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div key={c} className="gold-border flex items-center gap-1 rounded-full bg-char py-1 pl-4 pr-1 text-sm">
              <span>{c} <span className="text-mute">({count(c)})</span></span>
              <button type="button" onClick={() => renameCategory(c)} className="rounded-full px-2 py-1 text-xs text-soft hover:bg-ink">Rename</button>
              <button type="button" onClick={() => deleteCategory(c)} className="rounded-full px-2 py-1 text-xs text-red-300 hover:bg-ink">Delete</button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input className={inputCls} placeholder="New category name, e.g. Engagement" maxLength={40} value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()} />
          <Btn kind="gold" onClick={addCategory}>Add</Btn>
        </div>
      </Card>

      <Card title="Upload photos" hint="Choose one or many photos. They are shrunk automatically and placed at the top of the gallery. Please stay on this tab until the upload finishes.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:w-64">
            <Field label="Put them in category">
              <select className={inputCls} value={uploadCat} onChange={(e) => setTarget(e.target.value)}>
                {categories.length === 0 && <option value="">(create a category first)</option>}
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <FilePick kind="gold" multiple accept="image/jpeg,image/png,image/webp" disabled={Boolean(busy)} onPick={onPick}>
            {busy ? `Uploading ${Math.min(busy.done + 1, busy.total)} of ${busy.total}…` : "Choose photos"}
          </FilePick>
        </div>
      </Card>

      <Card
        title={`Photos (${visible.length}${activeFilter === "All" ? "" : ` in ${activeFilter}`})`}
        hint="The first 8 photos of “All” are shown on the home page before “View All Photos”, so put your best work first (use “First”)."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button key={c} type="button" onClick={() => { setFilter(c); setShown(PAGE); }} className={`rounded-full px-4 py-1.5 text-sm ${activeFilter === c ? "bg-gold text-ink" : "gold-border"}`}>
              {c}
            </button>
          ))}
        </div>

        {visible.length === 0 && <p className="text-sm text-mute">No photos here yet.</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.slice(0, shown).map((p) => (
            <div key={p.src} className="gold-border overflow-hidden rounded-xl bg-char">
              <div className="aspect-[4/5] bg-ink">
                <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 p-2">
                <select className={inputCls} value={p.cat} onChange={(e) => patchPhoto(p.src, { cat: e.target.value })} aria-label="Category">
                  {!categories.includes(p.cat) && <option value={p.cat}>{p.cat || "(none)"}</option>}
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className={inputCls} value={p.alt} maxLength={200} onChange={(e) => patchPhoto(p.src, { alt: e.target.value })} aria-label="Picture description" placeholder="Short description" />
                <div className="flex flex-wrap gap-1">
                  <Btn onClick={() => move(p.src, -1)} title="Move earlier">←</Btn>
                  <Btn onClick={() => move(p.src, 1)} title="Move later">→</Btn>
                  <Btn onClick={() => makeFirst(p.src)} title="Move to the very first place">First</Btn>
                  <Btn kind="danger" onClick={() => removePhoto(p.src)}>Delete</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
        {visible.length > shown && (
          <div className="mt-5 text-center">
            <Btn onClick={() => setShown((n) => n + PAGE)}>Show more ({visible.length - shown} left)</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}