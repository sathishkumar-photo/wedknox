// LOCATION: components/Nav.tsx
"use client";
import {useEffect,useState} from "react";import Logo from "./Logo";import {wa} from "./wa";
const links=["About","Services","Portfolio","Films","Packages","Contact"];
export default function Nav({whatsapp}:{whatsapp:string}){const [s,setS]=useState(false),[o,setO]=useState(false);
useEffect(()=>{if(!o)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setO(false)};addEventListener("keydown",key);return()=>{document.body.style.overflow=previous;removeEventListener("keydown",key)}},[o]);
useEffect(()=>{const f=()=>setS(scrollY>40);f();addEventListener("scroll",f);return()=>removeEventListener("scroll",f)},[]);
return <header className={`fixed inset-x-0 top-0 z-50 transition ${s||o?"glass gold-border border-x-0 border-t-0":""}`}>
<nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3" aria-label="Main">
<a href="#home" aria-label="Wedknox home"><Logo/></a>
<ul className="hidden gap-8 text-sm lg:flex">{links.map(l=><li key={l}><a className="hover:text-gold" href={`#${l.toLowerCase()}`}>{l}</a></li>)}</ul>
<a href={wa("Hi Wedknox, I'd like to book a shoot.",whatsapp)} className="hidden rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink lg:block">Book a Shoot</a>
<button className="lg:hidden" aria-expanded={o} aria-label="Menu" onClick={()=>setO(!o)}>{o?"Close":"Menu"}</button></nav>
{o&&<div className="mobile-menu fixed inset-0 top-[64px] flex flex-col items-center justify-center gap-6 bg-ink/95 font-serif text-4xl">
{["Home",...links].map(l=><a key={l} onClick={()=>setO(false)} href={`#${l.toLowerCase()}`}>{l}</a>)}
<a href={wa("Hi Wedknox, I'd like to book a shoot.",whatsapp)} className="mt-4 rounded-full bg-gold px-8 py-3 font-sans text-lg text-ink">Book a Shoot</a></div>}
</header>}