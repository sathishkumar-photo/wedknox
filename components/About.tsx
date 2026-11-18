// LOCATION: components/About.tsx
import type { About as AboutText, Photo } from "@/lib/content-schema";
export default function About({about,photographerPhoto,photos}:{about:AboutText;photographerPhoto:string;photos:Photo[]}){const pics=photos.filter((_,i)=>i%17===3).slice(0,3);
return <section id="about" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
<div className="relative"><img src={photographerPhoto} alt="Wedknox photographer" loading="lazy" className="gold-border w-full max-w-md rounded-2xl object-cover"/>
<div className="absolute -bottom-6 right-0 hidden gap-3 sm:flex">{pics.map(p=><img key={p.src} src={p.src} alt={p.alt} loading="lazy" className="gold-border h-28 w-20 rounded-lg object-cover"/>)}</div></div>
<div><h2 className="font-serif text-5xl">{about.title}</h2>
{about.paragraph1&&<p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">{about.paragraph1}</p>}
{about.paragraph2&&<p className="mt-4 max-w-xl text-mute">{about.paragraph2}</p>}</div></section>}