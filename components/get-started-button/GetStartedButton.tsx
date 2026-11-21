// LOCATION: components/get-started-button/GetStartedButton.tsx   (NEW FILE)
// ThreeUI "Get Started" liquid-chrome button, adapted for the Wedknox contact form.
// It runs inside a sandboxed iframe (WebGL), and is only mounted while it is on screen.
"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import rawSource from "./get-started-button.html?raw";
import { ACTIVATE_EVENT, buildSource } from "./source";

export type GetStartedButtonProps = {
  /** Text on the button. Use "\n" for a second line, e.g. "SEND ENQUIRY\nON WHATSAPP". */
  label?: string;
  /** Spoken name for screen readers. */
  ariaLabel?: string;
  /** Called when the visitor presses the button (mouse, touch, or Enter/Space). */
  onActivate?: () => void;
  /** Height of the button area in pixels. The button scales with it: 110 = small, 140 = default, 180 = large. */
  height?: number;
  className?: string;
  style?: CSSProperties;
};

export function GetStartedButton({
  label = "SEND ENQUIRY\nON WHATSAPP",
  ariaLabel = "Send enquiry",
  onActivate,
  height = 140,
  className = "",
  style,
}: GetStartedButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;

  const [documentVisible, setDocumentVisible] = useState(true);
  const [hostVisible, setHostVisible] = useState(true);
  const [ready, setReady] = useState(false);

  const srcDoc = useMemo(() => buildSource(rawSource, label, ariaLabel), [label, ariaLabel]);

  // Only run the WebGL scene while it is on screen.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setHostVisible(entry?.isIntersecting ?? true), { rootMargin: "80px" });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // The button inside the iframe tells us when it was pressed.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return; // only our own iframe
      if ((e.data as { type?: string } | null)?.type !== ACTIVATE_EVENT) return;
      onActivateRef.current?.();
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, []);

  const mounted = hostVisible && documentVisible;
  useEffect(() => setReady(false), [mounted]);

  return (
    <div
      ref={hostRef}
      className={className}
      role="group"
      aria-label={ariaLabel}
      data-state={!mounted ? "paused" : ready ? "ready" : "loading"}
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        isolation: "isolate",
        background: "transparent", // the button sits directly on your page, no grey box
        ...style,
      }}
    >
      {mounted ? (
        <iframe
          ref={frameRef}
          title={ariaLabel}
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
            background: "transparent",
            colorScheme: "normal",
            opacity: ready ? 1 : 0,
            pointerEvents: ready ? "auto" : "none",
            transition: "opacity 240ms ease-out",
          }}
        />
      ) : null}
    </div>
  );
}

export default GetStartedButton;