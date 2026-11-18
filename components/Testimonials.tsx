// LOCATION: components/Testimonials.tsx
import type {Testimonial} from "@/lib/content-schema";
export default function Testimonials({testimonials}:{testimonials:Testimonial[]}){
if(testimonials.length===0)return null; // nothing to show until you add real reviews in the admin page
return <section className="mx-auto max-w-7xl px-5 py-24"><h2 className="font-serif text-5xl">Client Stories</h2>
<div className="mt-8 flex snap-x gap-5 overflow-x-auto">{testimonials.map((t,i)=><blockquote key={`${i}-${t.name}`} className="gold-border glass min-w-[300px] snap-center rounded-2xl p-6"><p className="font-serif text-xl italic">“{t.quote}”</p><footer className="mt-3 text-sm text-gold">{t.name}</footer></blockquote>)}</div></section>}