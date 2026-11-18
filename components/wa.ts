// LOCATION: components/wa.ts
// Builds a WhatsApp link. The number now comes from the admin page (Contact & social).
export const wa = (msg: string, number: string) => `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;