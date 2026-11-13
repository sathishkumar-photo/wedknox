import {services,photos} from "@/config/site";import Tilt from "./Tilt";import {wa} from "./wa";
export default function Services(){return <section id="services" className="mx-auto max-w-7xl px-5 py-24">
<h2 className="font-serif text-5xl">Photography Services</h2>
<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map(([n,d])=><Tilt key={n}><article className="glass gold-border h-full rounded-2xl p-6">
{(()=>{const m:Record<string,string>={"Wedding Photography":"Weddings","Pre-Wedding Photography":"Pre-Weddings","Half Saree Photography":"Half Saree","Baby Photography":"Baby Shoot","Events & Functions":"Muhurtam"};const p=photos.find(x=>x.cat===m[n]);return p?<img src={p.src} alt={n} loading="lazy" className="mb-4 h-44 w-full rounded-lg object-cover"/>:<div className="ph mb-4 h-44 rounded-lg">Add a photo for this service</div>})()}<h3 className="font-serif text-2xl">{n}</h3><p className="mt-2 text-sm text-mute">{d}</p>
<div className="mt-4 flex gap-4 text-sm"><a href="#portfolio" className="text-gold">Learn More</a><a href={wa(`Hi Wedknox, I'd like to book: ${n}`)} className="underline">Book</a></div></article></Tilt>)}</div></section>}
