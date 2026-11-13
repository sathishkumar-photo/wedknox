import { site } from "@/config/site";
export const wa=(msg:string)=>`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
