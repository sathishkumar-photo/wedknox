"use client";
import { useRef } from "react";
export default function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const b = el.getBoundingClientRect();
    el.style.transform = `perspective(800px) rotateY(${((e.clientX-b.left)/b.width-.5)*8}deg) rotateX(${ -((e.clientY-b.top)/b.height-.5)*8}deg)`;
  };
  return <div ref={ref} onPointerMove={move} onPointerLeave={() => { if (ref.current) ref.current.style.transform = ""; }} className={`tilt-card transition-transform duration-200 ${className}`}>{children}</div>;
}