"use client";
import { useEffect, useRef } from "react";
import { site, photos } from "@/config/site";
import { wa } from "./wa";
const floats = ["Pre-Weddings", "Weddings", "Half Saree"].map(cat => photos.find(p => p.cat === cat)).filter(Boolean) as typeof photos;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const move = (e: MouseEvent) => {
      if (!fine.matches || reduced.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty("--x", `${(e.clientX / innerWidth - .5) * 30}px`);
        ref.current?.style.setProperty("--y", `${(e.clientY / innerHeight - .5) * 30}px`);
      });
    };
    const reset = () => { ref.current?.style.setProperty("--x", "0px"); ref.current?.style.setProperty("--y", "0px"); };
    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", reset);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("mousemove", move); document.documentElement.removeEventListener("mouseleave", reset); };
  }, []);
  return <section id="home" ref={ref} className="hero">
    <div className="absolute inset-0 bg-gradient-to-br from-char via-ink to-ink" />
    <div className="hero-glow" aria-hidden="true" />
    <div className="hero-grid">
      <div className="hero-copy">
        <p className="hero-eyebrow text-mute">Wedknox Photography</p>
        <h1 className="hero-title font-serif font-semibold">Wedding Stories <em className="text-gold">in Frames</em></h1>
        <p className="hero-tagline font-serif italic text-soft">Capturing Your Special Stories</p>
        <p className="hero-description text-mute">Transforming your most precious moments into timeless memories through cinematic photography and creative storytelling.</p>
        <div className="hero-actions">
          <a href="#portfolio" className="rounded-full bg-gold font-semibold text-ink">Explore Portfolio</a>
          <a href="#films" className="gold-border rounded-full">Watch Showreel</a>
          <a href={wa("Hi Wedknox, I'd like to book a shoot.")} className="rounded-full text-gold underline">Book a Shoot</a>
        </div>
      </div>
      <div className="hero-scene">
        <div className="hero-portrait-motion"><img src={site.photographerPhoto} alt="Wedknox photographer shooting with a Sony camera" fetchPriority="high" decoding="async" className="hero-portrait gold-border" /></div>
        {floats.map((p, i) => <div key={p.src} className={`hero-card hero-card-${i}`}><div className="hero-card-drift"><img src={p.src} alt={p.alt} decoding="async" className="gold-border" /></div></div>)}
      </div>
    </div>
    <a href="#about" className="hero-scroll text-mute" aria-label="Scroll to the story behind Wedknox">Scroll to discover <span aria-hidden="true">↓</span></a>
  </section>;
}