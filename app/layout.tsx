import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Mrs_Saint_Delafield } from "next/font/google";
const serif=Cormorant_Garamond({subsets:["latin"],weight:["500","600","700"],style:["normal","italic"],variable:"--font-serif"});
const sans=Manrope({subsets:["latin"],variable:"--font-sans"});
const script=Mrs_Saint_Delafield({subsets:["latin"],weight:"400",variable:"--font-script"});
export const metadata:Metadata={title:"Wedknox Photography | Wedding & Cinematic Photography",
description:"Premium photography and cinematic filmmaking: weddings, pre-weddings, maternity, baby and events.",
icons:{icon:[{url:"/favicon.ico",sizes:"any"},{url:"/favicon.svg",type:"image/svg+xml"}],apple:[{url:"/apple-touch-icon.png",sizes:"180x180",type:"image/png"}]},
openGraph:{title:"Wedknox Photography",description:"Wedding Stories in Frames",type:"website"}};
export default function L({children}:{children:React.ReactNode}){
return <html lang="en"><body className={`${serif.variable} ${sans.variable} ${script.variable}`}>{children}</body></html>}