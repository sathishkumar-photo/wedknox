import {site,photos} from "@/config/site";
export default function About(){const pics=photos.filter((_,i)=>i%17===3).slice(0,3);
return <section id="about" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
<div className="relative"><img src={site.photographerPhoto} alt="Wedknox photographer" loading="lazy" className="gold-border w-full max-w-md rounded-2xl object-cover"/>
<div className="absolute -bottom-6 right-0 hidden gap-3 sm:flex">{pics.map(p=><img key={p.src} src={p.src} alt={p.alt} loading="lazy" className="gold-border h-28 w-20 rounded-lg object-cover"/>)}</div></div>
<div><h2 className="font-serif text-5xl">The Story Behind Wedknox</h2>
<p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">At Wedknox Photography, we believe every moment has a story worth remembering. Through creative photography and cinematic filmmaking, we transform emotions, celebrations, and meaningful experiences into timeless visual memories.</p>
<p className="mt-4 max-w-xl text-mute">We shoot with professional cameras and gimbal rigs, so photos and films feel both candid and cinematic.</p></div></section>}
