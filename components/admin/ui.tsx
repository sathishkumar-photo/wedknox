// LOCATION: components/admin/ui.tsx
"use client";
import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-lg gold-border bg-ink px-3 py-2.5 text-sm text-ivory placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-gold";

const btnBase = "inline-flex items-center justify-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none";
const kinds = {
  gold: "bg-gold text-ink font-semibold hover:bg-soft",
  ghost: "gold-border text-ivory hover:bg-char",
  danger: "border border-red-500/50 text-red-300 hover:bg-red-950/40",
} as const;
type Kind = keyof typeof kinds;

export function Btn({ children, onClick, kind = "ghost", disabled, title }: { children: ReactNode; onClick?: () => void; kind?: Kind; disabled?: boolean; title?: string }) {
  return (
    <button type="button" title={title} disabled={disabled} onClick={onClick} className={`${btnBase} ${kinds[kind]}`}>
      {children}
    </button>
  );
}

/** A button that opens the file picker. */
export function FilePick({ children, accept, multiple, disabled, onPick, kind = "ghost" }: { children: ReactNode; accept: string; multiple?: boolean; disabled?: boolean; onPick: (files: File[]) => void; kind?: Kind }) {
  return (
    <label className={`${btnBase} ${kinds[kind]} cursor-pointer ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      {children}
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onPick(files);
        }}
      />
    </label>
  );
}

export function Card({ title, hint, right, children }: { title?: string; hint?: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <section className="gold-border glass rounded-2xl p-5">
      {(title || right) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-serif text-2xl text-gold">{title}</h2>}
            {hint && <p className="mt-1 max-w-2xl text-sm text-mute">{hint}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-mute">{hint}</span>}
    </label>
  );
}

export function TextField({ label, hint, value, onChange, placeholder, maxLength, inputMode }: { label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; inputMode?: "text" | "numeric" | "tel" | "url" }) {
  return (
    <Field label={label} hint={hint}>
      <input className={inputCls} value={value} placeholder={placeholder} maxLength={maxLength} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function AreaField({ label, hint, value, onChange, rows = 3, maxLength }: { label: string; hint?: string; value: string; onChange: (v: string) => void; rows?: number; maxLength?: number }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className={inputCls} rows={rows} value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" className="h-4 w-4 accent-[#D9AD72]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function Thumb({ src, className = "h-24 w-36" }: { src?: string; className?: string }) {
  return (
    <div className={`${className} shrink-0 overflow-hidden rounded-lg bg-ink gold-border`}>
      {src ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center px-1 text-center text-xs text-mute">No picture</div>}
    </div>
  );
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function ReorderButtons({ index, count, onMove }: { index: number; count: number; onMove: (to: number) => void }) {
  return (
    <>
      <Btn disabled={index === 0} onClick={() => onMove(index - 1)} title="Move earlier">↑ Up</Btn>
      <Btn disabled={index === count - 1} onClick={() => onMove(index + 1)} title="Move later">↓ Down</Btn>
    </>
  );
}