"use client";
import {useForm} from "react-hook-form";import {z} from "zod";import {zodResolver} from "@hookform/resolvers/zod";import {useState} from "react";
import {packages,services,site} from "@/config/site";import {wa} from "./wa";
const S=z.object({name:z.string().min(2,"Enter your full name"),mobile:z.string().regex(/^[+]?[0-9 ]{10,14}$/,"Enter a valid mobile number"),
email:z.string().email("Enter a valid email").optional().or(z.literal("")),service:z.string().min(1,"Choose a service"),pkg:z.string().optional(),
date:z.string().min(1,"Pick an event date"),location:z.string().min(2,"Enter the event location"),message:z.string().optional()});
type F=z.infer<typeof S>;
export default function Contact(){const {register,handleSubmit,formState:{errors}}=useForm<F>({resolver:zodResolver(S)});const [ok,setOk]=useState(false);
const go=(d:F)=>{const m=`Hi Wedknox, I'd like to enquire.\nName: ${d.name}\nMobile: ${d.mobile}${d.email?`\nEmail: ${d.email}`:""}\nService: ${d.service}\nPackage: ${d.pkg||"Not selected"}\nDate: ${d.date}\nLocation: ${d.location}${d.message?`\nMessage: ${d.message}`:""}`;
window.open(wa(m),"_blank");setOk(true)};
const I="w-full rounded-lg bg-char gold-border px-4 py-3";const E=({k}:{k:keyof F})=>errors[k]?<p role="alert" className="mt-1 text-sm text-red-400">{errors[k]?.message as string}</p>:null;
return <section id="contact" className="mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-2">
<div><h2 className="font-serif text-5xl">Let's Capture Your Story</h2><p className="mt-4 text-mute">Call {site.phone} or send your details. Your enquiry opens in WhatsApp.</p>
<a className="mt-4 block text-gold underline" href={wa("Hi Wedknox!")}>Chat on WhatsApp</a></div>
<form onSubmit={handleSubmit(go)} noValidate className="grid gap-4">
<div><label htmlFor="n">Full Name</label><input id="n" className={I} {...register("name")}/><E k="name"/></div>
<div><label htmlFor="m">Mobile Number</label><input id="m" inputMode="tel" className={I} {...register("mobile")}/><E k="mobile"/></div>
<div><label htmlFor="e">Email Address (optional)</label><input id="e" type="email" className={I} {...register("email")}/><E k="email"/></div>
<div><label htmlFor="s">Photography Service</label><select id="s" className={I} {...register("service")}><option value="">Choose…</option>{services.map(s=><option key={s[0]}>{s[0]}</option>)}</select><E k="service"/></div>
<div><label htmlFor="p">Selected Package</label><select id="p" className={I} {...register("pkg")}><option value="">Not sure yet</option>{packages.map(p=><option key={p.name}>{p.name} ({p.price})</option>)}</select></div>
<div><label htmlFor="d">Event Date</label><input id="d" type="date" className={I} {...register("date")}/><E k="date"/></div>
<div><label htmlFor="l">Event Location</label><input id="l" className={I} {...register("location")}/><E k="location"/></div>
<div><label htmlFor="g">Message</label><textarea id="g" rows={3} className={I} {...register("message")}/></div>
<button className="rounded-full bg-gold py-3 font-semibold text-ink">Send Enquiry on WhatsApp</button>
{ok&&<p role="status" className="text-soft">WhatsApp opened with your details. Press send there to finish.</p>}</form></section>}
