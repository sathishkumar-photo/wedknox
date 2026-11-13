"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Every full page opening/reload plays the intro. No storage or cookies required.
export default function IntroGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"intro" | "leaving" | "done">("intro");
  const [source, setSource] = useState<string>();
  const [needsPlay, setNeedsPlay] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    video.current?.pause();
    setPhase("leaving");
  }, []);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const preferenceChanged = () => { if (reduced.matches) finish(); };
    if (reduced.matches) finish();
    else {
      // Select once so rotating the phone never restarts the intro.
      const portrait = matchMedia("(max-width: 767px), (max-width: 1023px) and (orientation: portrait)").matches;
      setSource(`/media/intro/logo-reveal-${portrait ? "mobile" : "desktop"}.mp4`);
    }
    reduced.addEventListener("change", preferenceChanged);
    return () => reduced.removeEventListener("change", preferenceChanged);
  }, [finish]);

  useEffect(() => {
    if (phase !== "intro") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      // Keep keyboard focus inside the opening screen.
      if (event.key === "Tab") {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".intro-screen button"));
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    // Hard limit also covers failed/slow requests and browsers blocking autoplay.
    const timeout = window.setTimeout(finish, 25000);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", key); clearTimeout(timeout); };
  }, [phase, finish]);

  useEffect(() => {
    if (!source || phase !== "intro" || !video.current) return;
    const element = video.current;
    let active = true;
    element.muted = true;
    const attempt = element.play();
    attempt?.catch(() => { if (active && !finished.current) setNeedsPlay(true); });
    return () => { active = false; };
  }, [source, phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("wedknox:intro-complete"));
      content.current?.focus({ preventScroll: true });
    });
    const timeout = window.setTimeout(() => setPhase("done"), 500);
    return () => { cancelAnimationFrame(frame); clearTimeout(timeout); };
  }, [phase]);

  const play = () => {
    const attempt = video.current?.play();
    attempt?.then(() => setNeedsPlay(false)).catch(finish);
  };

  return <>
    {phase !== "done" && <div className={`intro-screen ${phase === "leaving" ? "intro-screen-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Wedknox Photography opening film">
      <div className="intro-loading" aria-hidden="true">WEDKNOX <span>PHOTOGRAPHY</span></div>
      <video ref={video} src={source} autoPlay muted playsInline preload="auto" onEnded={finish} onError={finish} onPlaying={() => setNeedsPlay(false)} className="intro-video" aria-label="Wedknox logo reveal" />
      <div className="intro-controls">
        {needsPlay && <button type="button" className="intro-button" onClick={play}>Play intro</button>}
        <button ref={skip} type="button" className="intro-button" onClick={finish}>Skip intro <span aria-hidden="true">→</span></button>
      </div>
    </div>}
    <div ref={content} className="intro-site" hidden={phase === "intro"} tabIndex={-1}>{children}</div>
    <noscript><style>{`.intro-screen{display:none!important}.intro-site[hidden]{display:block!important}`}</style></noscript>
  </>;
}