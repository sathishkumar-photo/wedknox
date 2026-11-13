"use client";
import {useEffect,useState} from "react";import {AnimatePresence,motion} from "framer-motion";import {photos,categories} from "@/config/site";
export default function Portfolio(){const [c,setC]=useState("All");const [open,setOpen]=useState<number|null>(null);
const list=photos.filter(p=>c==="All"||p.cat===c);const n=list.length;
useEffect(()=>{if(open===null)return;const k=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(null);if(e.key==="ArrowRight")setOpen(o=>o===null?o:(o+1)%n);if(e.key==="ArrowLeft")setOpen(o=>o===null?o:(o+n-1)%n)};
addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[open,n]);
const cur=open!==null?list[open]:null;let sx=0;
return <section id="portfolio" className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Portfolio</h2>
<div className="mt-6 flex flex-wrap gap-2" role="tablist">{["All",...categories].map(k=><button key={k} role="tab" aria-selected={c===k} onClick={()=>setC(k)} className={`rounded-full px-4 py-1.5 text-sm ${c===k?"bg-gold text-ink":"gold-border"}`}>{k}</button>)}</div>
<div className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4">{list.map((p,i)=><button key={p.src} onClick={()=>setOpen(i)} className="group mb-4 block w-full overflow-hidden rounded-xl gold-border" aria-label={`Open ${p.alt}`}>
<img loading="lazy" decoding="async" width={p.w} height={p.h} src={p.src} alt={p.alt} className="h-auto w-full transition duration-500 group-hover:scale-110"/></button>)}</div>
<AnimatePresence>{cur&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal onClick={()=>setOpen(null)}
onTouchStart={e=>{sx=e.touches[0].clientX}} onTouchEnd={e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)setOpen(o=>o===null?o:(d<0?(o+1)%n:(o+n-1)%n))}}>
<button className="absolute right-5 top-5 rounded-full bg-char px-4 py-2" onClick={()=>setOpen(null)}>Close</button>
<button className="absolute left-3 text-4xl" aria-label="Previous" onClick={e=>{e.stopPropagation();setOpen((open!+n-1)%n)}}>‹</button>
<motion.img key={cur.src} initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} src={cur.src} alt={cur.alt} className="max-h-[88vh] max-w-full rounded-lg object-contain" onClick={e=>e.stopPropagation()}/>
<button className="absolute right-3 text-4xl" aria-label="Next" onClick={e=>{e.stopPropagation();setOpen((open!+1)%n)}}>›</button></motion.div>}</AnimatePresence></section>}
