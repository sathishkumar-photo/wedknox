// LOCATION: components/Films.tsx
"use client";
import {useState} from "react";import type {Film} from "@/lib/content-schema";import {filmThumb,youtubeId} from "@/lib/media";
export default function Films({films}:{films:Film[]}){const [a,setA]=useState(0);const f=films[a];
if(!f)return <section id="films" className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Cinematic Films</h2><p className="mt-8 text-mute">New films coming soon.</p></section>;
const yt=youtubeId(f.src);
return <section id="films" className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Cinematic Films</h2>
<div className="gold-border mt-8 aspect-video overflow-hidden rounded-2xl bg-black">{yt?<iframe key={f.src} src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0`} title={f.title} loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full border-0"/>:<video key={f.src} src={f.src} poster={f.poster||undefined} controls playsInline preload="none" className="h-full w-full"/>}</div>
<div className="mt-4 grid gap-3 sm:grid-cols-2">{films.map((x,i)=>{const t=filmThumb(x);return <button key={`${i}-${x.title}`} onClick={()=>setA(i)} className={`flex items-center gap-4 rounded-xl p-3 text-left ${i===a?"bg-gold text-ink":"gold-border glass"}`}>
{t?<img src={t} alt="" loading="lazy" className="h-16 w-28 rounded-lg object-cover"/>:<div className="ph h-16 w-28 rounded-lg"/>}<span className="font-serif text-xl">{x.title}</span></button>})}</div></section>}