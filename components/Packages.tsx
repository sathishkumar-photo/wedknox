// LOCATION: components/Packages.tsx
import type {PackagesData} from "@/lib/content-schema";import {wa} from "./wa";import Tilt from "./Tilt";
export default function Packages({data,whatsapp}:{data:PackagesData;whatsapp:string}){const complimentary=data.items.filter(p=>p.complimentary).map(p=>p.name);
return <section id="packages" className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Photography Packages</h2>
{data.offerEnabled&&data.offerTitle&&<div className="mt-6 gold-border glass rounded-2xl p-5"><p className="font-serif text-2xl text-gold">{data.offerTitle}</p>
{complimentary.length>0&&<p className="mt-1 text-sm text-mute">Applies to: {complimentary.join(", ")}</p>}</div>}
<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{data.items.map((p,i)=><Tilt key={`${i}-${p.name}`}><div className="gold-border glass flex h-full flex-col rounded-2xl p-6">
<h3 className="font-serif text-2xl">{p.name}</h3><p className="mt-3 font-serif text-4xl text-gold">{p.price}</p>
{p.note&&<p className="mt-2 text-sm text-mute">{p.note}</p>}
{p.complimentary&&<p className="mt-2 text-sm text-soft">Includes complimentary pre-wedding shoot</p>}
<a href={wa(`Hi Wedknox, I'd like to book the ${p.name} (${p.price}).`,whatsapp)} className="mt-auto rounded-full bg-gold px-5 py-2.5 pt-2.5 text-center font-semibold text-ink" style={{marginTop:"1.5rem"}}>Book This Package</a></div></Tilt>)}</div></section>}