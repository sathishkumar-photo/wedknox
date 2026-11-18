// LOCATION: components/admin/tabs/GeneralTab.tsx
"use client";
import { useState } from "react";
import { useAdmin } from "../context";
import { errMsg, uploadImage } from "../upload";
import { Card, FilePick, TextField, AreaField, Thumb } from "../ui";
import type { TabProps } from "./types";

export default function GeneralTab({ draft, update }: TabProps) {
  const { upload, toast } = useAdmin();
  const [busy, setBusy] = useState(false);
  const s = draft.settings;
  const set = (patch: Partial<typeof s>) => update("settings", (p) => ({ ...p, ...patch }));
  const setSocial = (patch: Partial<typeof s.social>) => update("settings", (p) => ({ ...p, social: { ...p.social, ...patch } }));

  async function pickPhoto(files: File[]) {
    if (!upload) return toast("error", "Uploads are not ready yet. Finish the Supabase setup first.");
    setBusy(true);
    try {
      const r = await uploadImage(upload, files[0], "image");
      set({ photographerPhoto: r.url });
      toast("ok", "Photo added. Press Save changes to publish it.");
    } catch (e) {
      toast("error", errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Contact details" hint="Used for the Call / WhatsApp buttons, the enquiry form and the footer.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Phone number (shown on the website)" value={s.phone} onChange={(v) => set({ phone: v })} inputMode="tel" placeholder="+91 8897963108" />
          <TextField label="WhatsApp number" hint="Digits only, with country code, no + or spaces. Example: 918897963108" value={s.whatsapp} onChange={(v) => set({ whatsapp: v.replace(/\D/g, "") })} inputMode="numeric" placeholder="918897963108" />
        </div>
      </Card>

      <Card title="Social media links" hint="Leave a box empty to hide that link. Paste the full address starting with https://">
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Instagram" value={s.social.instagram} onChange={(v) => setSocial({ instagram: v })} inputMode="url" placeholder="https://instagram.com/yourpage" />
          <TextField label="YouTube" value={s.social.youtube} onChange={(v) => setSocial({ youtube: v })} inputMode="url" placeholder="https://youtube.com/@yourchannel" />
          <TextField label="Facebook" value={s.social.facebook} onChange={(v) => setSocial({ facebook: v })} inputMode="url" placeholder="https://facebook.com/yourpage" />
        </div>
      </Card>

      <Card title="Photographer photo" hint="Shown at the top of the home page and in the About section.">
        <div className="flex flex-wrap items-center gap-4">
          <Thumb src={s.photographerPhoto} className="h-32 w-24" />
          <FilePick accept="image/jpeg,image/png,image/webp" disabled={busy} onPick={pickPhoto}>
            {busy ? "Uploading…" : "Choose a new photo"}
          </FilePick>
        </div>
      </Card>

      <Card title="Google & sharing text" hint="The page title in the browser tab and Google, and the preview text when your link is shared on WhatsApp or Facebook.">
        <div className="grid gap-4">
          <TextField label="Page title" value={draft.seo.title} maxLength={120} onChange={(v) => update("seo", (p) => ({ ...p, title: v }))} />
          <AreaField label="Short description" rows={2} value={draft.seo.description} maxLength={300} onChange={(v) => update("seo", (p) => ({ ...p, description: v }))} />
        </div>
      </Card>
    </div>
  );
}