// LOCATION: components/admin/tabs/FilmsTab.tsx
"use client";
import { useState } from "react";
import type { Film } from "@/lib/content-schema";
import { filmThumb, youtubeId } from "@/lib/media";
import { useAdmin } from "../context";
import { captureVideoFrame, errMsg, uploadBlob, uploadImage } from "../upload";
import { Btn, Card, FilePick, Field, TextField, Thumb, ReorderButtons, moveItem } from "../ui";
import type { TabProps } from "./types";

const MAX_VIDEO_MB = 50;

export default function FilmsTab({ draft, update }: TabProps) {
  const { upload, toast } = useAdmin();
  const list = draft.films;
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState("");
  const [posterBusy, setPosterBusy] = useState<number | null>(null);

  const setItem = (i: number, patch: Partial<Film>) => update("films", (l) => l.map((f, n) => (n === i ? { ...f, ...patch } : f)));

  async function addVideoFile(files: File[]) {
    const file = files[0];
    if (!upload) return toast("error", "Uploads are not ready yet. Finish the Supabase setup first.");
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      return toast("error", `This video is ${Math.round(file.size / 1048576)} MB, but the limit is ${MAX_VIDEO_MB} MB. Upload it to YouTube and paste the link below instead.`);
    }
    setBusy("Uploading video… this can take a few minutes. Please keep this page open.");
    try {
      const frame = await captureVideoFrame(file); // cover picture taken from the video
      const src = await uploadBlob(upload, file, "video", file.name);
      let poster = "";
      if (frame) {
        try {
          poster = await uploadBlob(upload, frame, "image", "film-cover.jpg");
        } catch {
          /* the film still works without a cover picture */
        }
      }
      const name = title.trim() || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      update("films", (l) => [...l, { title: name, src, poster }]);
      setTitle("");
      toast("ok", "Film uploaded. Press Save changes to publish it.");
    } catch (e) {
      toast("error", errMsg(e));
    } finally {
      setBusy("");
    }
  }

  function addLink() {
    const url = link.trim();
    if (!/^https:\/\/\S+$/i.test(url)) return toast("error", "Paste a full link that starts with https://");
    update("films", (l) => [...l, { title: title.trim() || "New film", src: url, poster: "" }]);
    setTitle("");
    setLink("");
    toast("ok", "Film added. Press Save changes to publish it.");
  }

  async function pickPoster(i: number, files: File[]) {
    if (!upload) return toast("error", "Uploads are not ready yet. Finish the Supabase setup first.");
    setPosterBusy(i);
    try {
      const r = await uploadImage(upload, files[0], "image", 1280);
      setItem(i, { poster: r.url });
    } catch (e) {
      toast("error", errMsg(e));
    } finally {
      setPosterBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Add a film" hint={`Upload a video file (up to ${MAX_VIDEO_MB} MB) or paste a YouTube link. For longer films, YouTube is the best choice.`}>
        <div className="grid gap-4">
          <TextField label="Film title" value={title} maxLength={80} onChange={setTitle} placeholder="e.g. Ravi & Anjali Wedding Film" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Option 1: upload a video">
              <FilePick kind="gold" accept="video/mp4,video/webm,video/quicktime" disabled={Boolean(busy)} onPick={addVideoFile}>
                {busy ? "Uploading…" : "Choose video file"}
              </FilePick>
            </Field>
            <Field label="Option 2: paste a link (YouTube or direct .mp4 link)">
              <div className="flex gap-2">
                <input className="w-full rounded-lg gold-border bg-ink px-3 py-2.5 text-sm text-ivory placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-gold" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://youtu.be/…" inputMode="url" />
                <Btn onClick={addLink}>Add</Btn>
              </div>
            </Field>
          </div>
          {busy && <p className="rounded-lg bg-char p-3 text-sm text-soft">{busy}</p>}
        </div>
      </Card>

      <Card title={`Films (${list.length})`} hint="The first film is the one that plays first on the website.">
        {list.length === 0 && <p className="text-sm text-mute">No films yet.</p>}
        <div className="space-y-4">
          {list.map((f, i) => {
            const isYt = Boolean(youtubeId(f.src));
            return (
              <div key={i} className="gold-border rounded-xl bg-char p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Thumb src={filmThumb(f)} className="h-24 w-40" />
                  <div className="grid flex-1 gap-3">
                    <TextField label="Title" value={f.title} maxLength={80} onChange={(v) => setItem(i, { title: v })} />
                    <TextField label={isYt ? "Video link (YouTube detected ✓)" : "Video file / link"} value={f.src} onChange={(v) => setItem(i, { src: v.trim() })} inputMode="url" />
                    <div className="flex flex-wrap gap-2">
                      {!isYt && (
                        <FilePick accept="image/jpeg,image/png,image/webp" disabled={posterBusy === i} onPick={(files) => pickPoster(i, files)}>
                          {posterBusy === i ? "Uploading…" : f.poster ? "Change cover picture" : "Add cover picture"}
                        </FilePick>
                      )}
                      {!isYt && f.poster && <Btn onClick={() => setItem(i, { poster: "" })}>Remove cover picture</Btn>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                  <ReorderButtons index={i} count={list.length} onMove={(to) => update("films", (l) => moveItem(l, i, to))} />
                  <Btn kind="danger" onClick={() => window.confirm(`Delete the film “${f.title}”?`) && update("films", (l) => l.filter((_, n) => n !== i))}>Delete</Btn>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}