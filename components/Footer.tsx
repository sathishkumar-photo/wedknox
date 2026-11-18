// LOCATION: components/Footer.tsx
import Logo from "./Logo";import {wa} from "./wa";
export default function Footer({phone,whatsapp,social,serviceNames}:{phone:string;whatsapp:string;social:Record<string,string>;serviceNames:string[]}){return <footer className="gold-border border-x-0 border-b-0 px-5 py-12"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
<Logo/><div><h3 className="mb-2 font-serif text-xl">Quick links</h3>{["About","Services","Portfolio","Films","Packages","Contact"].map(l=><a key={l} className="block text-sm text-mute hover:text-gold" href={`#${l.toLowerCase()}`}>{l}</a>)}</div>
<div><h3 className="mb-2 font-serif text-xl">Services</h3>{serviceNames.map((s,i)=><p key={`${i}-${s}`} className="text-sm text-mute">{s}</p>)}</div>
<div><h3 className="mb-2 font-serif text-xl">Contact</h3><a className="block text-sm" href={`tel:${phone.replace(/[^\d+]/g,"")}`}>{phone}</a><a className="block text-sm text-gold" href={wa("Hi Wedknox!",whatsapp)}>WhatsApp booking</a>
{Object.entries(social).filter(([,v])=>v).map(([k,v])=><a key={k} className="block text-sm capitalize" href={v}>{k}</a>)}</div></div>
<p className="mx-auto mt-8 max-w-7xl text-xs text-mute">© {new Date().getFullYear()} Wedknox Photography. Privacy Policy available on request.</p>
<a href={wa("Hi Wedknox, I'd like to book a shoot.",whatsapp)} className="fixed bottom-4 right-4 z-40 rounded-full bg-gold px-5 py-3 font-semibold text-ink shadow-lg lg:hidden">WhatsApp</a></footer>}