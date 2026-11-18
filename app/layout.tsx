// LOCATION: app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Mrs_Saint_Delafield } from "next/font/google";
import { getContent } from "@/lib/content-server";
const serif=Cormorant_Garamond({subsets:["latin"],weight:["500","600","700"],style:["normal","italic"],variable:"--font-serif"});
const sans=Manrope({subsets:["latin"],variable:"--font-sans"});
const script=Mrs_Saint_Delafield({subsets:["latin"],weight:"400",variable:"--font-script"});

// The page title and description (Google + WhatsApp/Facebook previews) are editable in the admin page.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  return {
    title: seo.title,
    description: seo.description,
    icons: {
      icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: { title: seo.title, description: seo.description, type: "website" },
  };
}
export default function L({children}:{children:React.ReactNode}){
return <html lang="en"><body className={`${serif.variable} ${sans.variable} ${script.variable}`}>{children}</body></html>}