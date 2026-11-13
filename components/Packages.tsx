import {packages,complimentaryPreWeddingFor} from "@/config/site";import {wa} from "./wa";import Tilt from "./Tilt";
export default function Packages(){return <section id="packages" className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Photography Packages</h2>
<div className="mt-6 gold-border glass rounded-2xl p-5"><p className="font-serif text-2xl text-gold">Special Offer: Complimentary Pre-Wedding Shoot</p>
{complimentaryPreWeddingFor.length>0&&<p className="mt-1 text-sm text-mute">Applies to: {complimentaryPreWeddingFor.join(", ")}</p>}</div>
<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{packages.map(p=><Tilt key={p.name}><div className="gold-border glass flex h-full flex-col rounded-2xl p-6">
<h3 className="font-serif text-2xl">{p.name}</h3><p className="mt-3 font-serif text-4xl text-gold">{p.price}</p>
{p.note&&<p className="mt-2 text-sm text-mute">{p.note}</p>}
{complimentaryPreWeddingFor.includes(p.name)&&<p className="mt-2 text-sm text-soft">Includes complimentary pre-wedding shoot</p>}
<a href={wa(`Hi Wedknox, I'd like to book the ${p.name} (${p.price}).`)} className="mt-auto rounded-full bg-gold px-5 py-2.5 pt-2.5 text-center font-semibold text-ink" style={{marginTop:"1.5rem"}}>Book This Package</a></div></Tilt>)}</div></section>}
