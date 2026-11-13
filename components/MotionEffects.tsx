"use client";
import { useEffect } from "react";

// Content stays visible if JavaScript or IntersectionObserver is unavailable.
export default function MotionEffects() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("main > section:not(#home) > *"));
    let observer: IntersectionObserver | undefined;
    const clear = () => { observer?.disconnect(); elements.forEach(el => { el.classList.remove("reveal-ready", "is-visible"); el.style.removeProperty("--reveal-delay"); }); };
    const setup = () => {
      clear();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer?.unobserve(entry.target); }
      }), { threshold: .08 });
      elements.forEach((el, i) => {
        // Do not hide content already on screen during hydration.
        if (el.getBoundingClientRect().top < innerHeight) return;
        el.style.setProperty("--reveal-delay", `${i % 3 * 65}ms`);
        el.classList.add("reveal-ready"); observer?.observe(el);
      });
    };
    setup(); preference.addEventListener("change", setup);
    return () => { clear(); preference.removeEventListener("change", setup); };
  }, []);
  return null;
}