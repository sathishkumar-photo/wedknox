import {testimonials} from "@/config/site";
export default function Testimonials(){return <section className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Client Stories</h2>
{testimonials.length===0?<p className="mt-6 text-mute">Placeholder: real client reviews will appear here. Add them in config/site.ts.</p>:
<div className="mt-8 flex snap-x gap-5 overflow-x-auto">{testimonials.map(t=><blockquote key={t.name} className="gold-border glass min-w-[300px] snap-center rounded-2xl p-6"><p className="font-serif text-xl italic">“{t.quote}”</p><footer className="mt-3 text-sm text-gold">{t.name}</footer></blockquote>)}</div>}</section>}
