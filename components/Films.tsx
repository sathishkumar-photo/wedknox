// LOCATION: components/Films.tsx   (REPLACE the whole old file with this)
// Every film now shows a poster with the liquid-metal Play button on it.
// The video only loads and starts after the visitor presses Play.
"use client";
import {useState} from "react";
import type {Film} from "@/lib/content-schema";
import {filmThumb,youtubeId} from "@/lib/media";
import {LiquidMetalButton} from "@/components/liquid-metal-button/LiquidMetalButton";

/* ---------- PLAY BUTTON SETTINGS (easy to change) ---------- */
const BIG_DIAMETER = 96;    // size of the big Play button on the main player (allowed: 72 to 160)
const SMALL_DIAMETER = 72;  // button size inside the small thumbnails (72 is the smallest ThreeUI allows)
const SMALL_SCALE = 0.4;    // shrinks the thumbnail button so it fits the thumbnail
const MAX_SMALL_LIVE = 6;   // each liquid button uses one WebGL context; browsers allow ~16 per page.
                            // Thumbnails after this number get a plain play icon instead.

/* The liquid button lives in a square a little bigger than the button, so its glow has room.
   The soft mask fades the edges of that square so no hard line shows. */
function LiquidPlay({diameter,label,onPlay,scale=1}:{diameter:number;label:string;onPlay:()=>void;scale?:number}){
  const box=Math.round(diameter*2.2);
  return <div style={{position:"absolute",left:"50%",top:"50%",width:box,height:box,transform:`translate(-50%,-50%) scale(${scale})`,zIndex:10,WebkitMaskImage:"radial-gradient(closest-side,#000 72%,transparent 100%)",maskImage:"radial-gradient(closest-side,#000 72%,transparent 100%)"}}>
    <LiquidMetalButton variant="play" rendering="colored" diameter={diameter} strokeWidth={3} text={label} onClick={onPlay}/>
  </div>}

/* Simple fallback icon (no WebGL) for thumbnails beyond MAX_SMALL_LIVE */
function PlainPlay(){return <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-gold" style={{border:"1px solid rgba(217,173,114,.6)"}}><svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>}

export default function Films({films}:{films:Film[]}){
const [a,setA]=useState(0);
const [playing,setPlaying]=useState(false); // false = poster + Play button, true = video is running
const f=films[a];
if(!f)return <section id="films" className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Cinematic Films</h2><p className="mt-8 text-mute">New films coming soon.</p></section>;
const yt=youtubeId(f.src);
const poster=filmThumb(f);
const choose=(i:number)=>{setA(i);setPlaying(true);}; // pressing a film in the list picks it and plays it
return <section id="films" className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Cinematic Films</h2>

{/* MAIN PLAYER */}
<div className="gold-border relative mt-8 aspect-video overflow-hidden rounded-2xl bg-black">
{playing
?(yt?<iframe key={f.src} src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0&autoplay=1`} title={f.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full border-0"/>
:<video key={f.src} src={f.src} poster={poster||undefined} controls autoPlay playsInline className="h-full w-full"/>)
:<div key={f.src} className="absolute inset-0">
{poster?<img src={poster} alt="" className="h-full w-full object-cover"/>:<div className="ph h-full w-full"/>}
<div className="absolute inset-0 bg-black/30"/>
{/* pressing anywhere on the poster also plays */}
<button type="button" aria-label={`Play ${f.title}`} onClick={()=>setPlaying(true)} className="absolute inset-0 h-full w-full cursor-pointer"/>
<LiquidPlay diameter={BIG_DIAMETER} label={`Play ${f.title}`} onPlay={()=>setPlaying(true)}/>
</div>}
</div>

{/* FILM LIST */}
<div className="mt-4 grid gap-3 sm:grid-cols-2">{films.map((x,i)=>{const t=filmThumb(x);const on=i===a;
return <div key={`${i}-${x.title}`} className={`flex items-center gap-4 rounded-xl p-3 text-left ${on?"bg-gold text-ink":"gold-border glass"}`}>
<div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
{t?<img src={t} alt="" loading="lazy" className="h-full w-full object-cover"/>:<div className="ph h-full w-full"/>}
<button type="button" tabIndex={-1} aria-hidden="true" onClick={()=>choose(i)} className="absolute inset-0 h-full w-full cursor-pointer"/>
{i<MAX_SMALL_LIVE
?<LiquidPlay diameter={SMALL_DIAMETER} scale={SMALL_SCALE} label={`Play ${x.title}`} onPlay={()=>choose(i)}/>
:<PlainPlay/>}
</div>
<button type="button" onClick={()=>choose(i)} className="flex-1 text-left font-serif text-xl">{x.title}</button>
</div>})}</div></section>}