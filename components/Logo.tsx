// LOCATION: components/Logo.tsx   (REPLACE the old file)
// Clear, easy-to-read brand logo used in the top menu AND the footer.
export default function Logo() {
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <span className="pl-[0.22em] font-serif text-[26px] font-bold uppercase tracking-[0.22em] text-ivory sm:text-[32px]">
        Wed<span className="text-gold">knox</span>
      </span>
      <span className="mt-2 flex items-center gap-2 pl-[0.3em] text-[10px] font-semibold uppercase tracking-[0.3em] text-soft sm:text-[11px]">
        <span className="h-px w-3 bg-gold/70 sm:w-5" />
        Photography
        <span className="h-px w-3 bg-gold/70 sm:w-5" />
      </span>
    </span>
  );
}