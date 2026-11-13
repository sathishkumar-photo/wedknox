"use client";
import {useState} from "react";import {films} from "@/config/site";
export default function Films(){const [a,setA]=useState(0);const f=films[a];
return <section id="films" className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Cinematic Films</h2>
<div className="gold-border mt-8 aspect-video overflow-hidden rounded-2xl bg-black"><video key={f.src} src={f.src} poster={f.poster} controls playsInline preload="none" className="h-full w-full"/></div>
<div className="mt-4 grid gap-3 sm:grid-cols-2">{films.map((x,i)=><button key={x.title} onClick={()=>setA(i)} className={`flex items-center gap-4 rounded-xl p-3 text-left ${i===a?"bg-gold text-ink":"gold-border glass"}`}>
<img src={x.poster} alt="" loading="lazy" className="h-16 w-28 rounded-lg object-cover"/><span className="font-serif text-xl">{x.title}</span></button>)}</div></section>}
