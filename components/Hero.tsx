"use client";
import {useEffect,useRef} from "react";import {site,photos} from "@/config/site";import {wa} from "./wa";
const floats=[photos.find(p=>p.cat==="Pre-Weddings"),photos.find(p=>p.cat==="Weddings"),photos.find(p=>p.cat==="Half Saree")].filter(Boolean) as typeof photos;
export default function Hero(){const ref=useRef<HTMLDivElement>(null);
useEffect(()=>{const f=(e:MouseEvent)=>{if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
ref.current?.style.setProperty("--x",String((e.clientX/innerWidth-.5)*30));ref.current?.style.setProperty("--y",String((e.clientY/innerHeight-.5)*30))};
addEventListener("mousemove",f);return()=>removeEventListener("mousemove",f)},[]);
return <section id="home" ref={ref} className="relative flex min-h-screen items-center overflow-hidden px-5 pb-12 pt-24">
<div className="absolute inset-0 bg-gradient-to-br from-char via-ink to-ink"/>
<div className="pointer-events-none absolute right-[8%] top-1/4 h-96 w-96 rounded-full bg-gold/20 blur-3xl" style={{transform:"translate(calc(var(--x,0)*1px),calc(var(--y,0)*1px))"}}/>
<div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2">
<div className="order-2 lg:order-1"><p className="mb-4 text-sm text-mute">Wedknox Photography</p>
<h1 className="font-serif text-6xl font-semibold leading-[.95] md:text-8xl">Wedding Stories <em className="text-gold">in Frames</em></h1>
<p className="mt-4 font-serif text-2xl italic text-soft">Capturing Your Special Stories</p>
<p className="mt-4 max-w-md text-mute">Transforming your most precious moments into timeless memories through cinematic photography and creative storytelling.</p>
<div className="mt-8 flex flex-wrap gap-3">
<a href="#portfolio" className="rounded-full bg-gold px-6 py-3 font-semibold text-ink">Explore Portfolio</a>
<a href="#films" className="gold-border rounded-full px-6 py-3">Watch Showreel</a>
<a href={wa("Hi Wedknox, I'd like to book a shoot.")} className="rounded-full px-6 py-3 text-gold underline">Book a Shoot</a></div></div>
<div className="relative order-1 mx-auto h-[420px] w-full max-w-sm sm:h-[520px] lg:order-2 lg:max-w-md">
<img src={site.photographerPhoto} alt="Wedknox photographer shooting with a Sony camera" className="gold-border h-full w-full rounded-2xl object-cover shadow-2xl" style={{transform:"translate(calc(var(--x,0)*-.3px),calc(var(--y,0)*-.3px))"}}/>
{floats.map((p,i)=><img key={p.src} src={p.src} alt={p.alt} loading="lazy" className="gold-border absolute hidden w-28 rounded-lg object-cover shadow-xl md:block lg:w-36" style={{left:i===1?"auto":"-70px",right:i===1?"-60px":"auto",top:`${50+i*150}px`,aspectRatio:"3/4",transform:`translate(calc(var(--x,0)*${(i+1)*.8}px),calc(var(--y,0)*${(i+1)*.8}px)) rotate(${i*5-5}deg)`}}/>)}</div></div></section>}
