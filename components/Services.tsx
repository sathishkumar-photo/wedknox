// LOCATION: components/Services.tsx
import type { Photo, Service } from "@/lib/content-schema";import Tilt from "./Tilt";import {wa} from "./wa";
export default function Services({services,photos,whatsapp}:{services:Service[];photos:Photo[];whatsapp:string}){return <section id="services" className="mx-auto max-w-7xl px-5 py-24">
<h2 className="font-serif text-5xl">Photography Services</h2>
<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map((s,i)=><Tilt key={`${i}-${s.name}`}><article className="glass gold-border h-full rounded-2xl p-6">
{(()=>{const cover=s.image||photos.find(x=>x.cat===s.category)?.src;return cover?<img src={cover} alt={s.name} loading="lazy" className="mb-4 h-44 w-full rounded-lg object-cover"/>:<div className="ph mb-4 h-44 rounded-lg">Add a photo for this service</div>})()}<h3 className="font-serif text-2xl">{s.name}</h3><p className="mt-2 text-sm text-mute">{s.description}</p>
<div className="mt-4 flex gap-4 text-sm"><a href="#portfolio" className="text-gold">Learn More</a><a href={wa(`Hi Wedknox, I'd like to book: ${s.name}`,whatsapp)} className="underline">Book</a></div></article></Tilt>)}</div></section>}