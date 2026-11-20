// LOCATION: components/Nav.tsx   (REPLACE the whole old file with this)
"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { wa } from "./wa";

const links = ["About", "Services", "Portfolio", "Films", "Packages", "Contact"];

export default function Nav({ whatsapp }: { whatsapp: string }) {
  const [scrolled, setScrolled] = useState(false); // header turns glassy after scrolling
  const [open, setOpen] = useState(false); // is the curved menu open?

  // When menu is open: stop page scroll + close with the Escape key
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; removeEventListener("keydown", onKey); };
  }, [open]);

  // Close the menu automatically if the screen becomes desktop size
  useEffect(() => {
    const mq = matchMedia("(min-width:1024px)");
    const f = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  useEffect(() => {
    const f = () => setScrolled(scrollY > 40);
    f();
    addEventListener("scroll", f);
    return () => removeEventListener("scroll", f);
  }, []);

  const close = () => setOpen(false);
  const bookHref = wa("Hi Wedknox, I'd like to book a shoot.", whatsapp);

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled && !open ? "glass gold-border border-x-0 border-t-0" : ""}`}>
      <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-5 py-3" aria-label="Main">
        <a href="#home" aria-label="Wedknox home" onClick={close}><Logo /></a>
        <ul className="hidden gap-8 text-sm lg:flex">
          {links.map((l) => (<li key={l}><a className="hover:text-gold" href={`#${l.toLowerCase()}`}>{l}</a></li>))}
        </ul>
        <a href={bookHref} className="hidden rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink lg:block">Book a Shoot</a>

        {/* Animated hamburger button (mobile + tablet only) */}
        <button type="button" className={`burger lg:hidden ${open ? "is-open" : ""}`} aria-expanded={open} aria-controls="curved-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </nav>
    </header>

      {/* Dark overlay behind the menu - tap to close */}
      <div className={`menu-backdrop ${open ? "is-open" : ""}`} onClick={close} aria-hidden="true" />
      {/* Gold curved layer (peeks out behind the dark one) */}
      <div className={`menu-layer menu-layer-gold ${open ? "is-open" : ""}`} aria-hidden="true" />
      {/* Main curved sliding menu */}
      <div id="curved-menu" className={`menu-layer menu-layer-dark ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="menu-inner">
          {["Home", ...links].map((l, i) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={close} className="menu-link" style={{ ["--i" as string]: i } as React.CSSProperties} tabIndex={open ? 0 : -1}>{l}</a>
          ))}
          <a href={bookHref} onClick={close} className="menu-cta" tabIndex={open ? 0 : -1}>Book a Shoot</a>
        </div>
      </div>
    </>
  );
}