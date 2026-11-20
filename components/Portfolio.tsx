// LOCATION: components/Portfolio.tsx   (REPLACE the whole old file with this)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo } from "@/lib/content-schema";

/* ---------- ORBIT RING SETTINGS (easy to change) ---------- */
// Ring radius as % of the stage width, depending on how many rings we need
const RING_RADII: Record<number, number[]> = {
  1: [32],
  2: [22, 38],
  3: [17, 29, 41],
  4: [14, 24, 34, 43],
};
const SPEED_SECONDS = [70, 95, 120, 145]; // time for one full turn, per ring (bigger = slower)

// Decide how many rings are needed for this many photos
function ringCountFor(n: number) {
  if (n <= 8) return 1;
  if (n <= 20) return 2;
  if (n <= 40) return 3;
  return 4;
}

type OrbitRing = { radius: number; size: number; photos: { photo: Photo; index: number; angle: number }[] };

// Split all photos across the rings and work out each photo's position + size
function buildRings(photos: Photo[]): { rings: OrbitRing[]; cardWidths: number[] } {
  const n = photos.length;
  if (n === 0) return { rings: [], cardWidths: [] };
  const radii = RING_RADII[ringCountFor(n)];
  const total = radii.reduce((a, b) => a + b, 0);

  // more photos on the bigger (outer) rings
  const counts = radii.map((r) => Math.max(1, Math.round((r / total) * n)));
  let diff = n - counts.reduce((a, b) => a + b, 0);
  for (let i = counts.length - 1; diff !== 0; i = (i - 1 + counts.length) % counts.length) {
    if (diff > 0) { counts[i]++; diff--; }
    else if (counts[i] > 1) { counts[i]--; diff++; }
    else if (counts.every((c) => c <= 1)) break;
  }

  let cursor = 0;
  const gap = radii.length > 1 ? radii[1] - radii[0] : 40;
  const cardWidths: number[] = [];
  const rings = radii.map((radius, r) => {
    const count = counts[r];
    const arc = (2 * Math.PI * radius) / count; // space along the circle
    const width = Math.min(arc * 0.85, gap * 0.75, 18); // card width in % of stage
    cardWidths.push(width);
    const offset = r * 37; // stagger start angles so rings don't line up
    const items = Array.from({ length: count }, (_, k) => ({
      photo: photos[cursor + k],
      index: cursor + k,
      angle: ((k / count) * 360 + offset) * (Math.PI / 180),
    }));
    cursor += count;
    return { radius, size: radius * 2, photos: items };
  });
  return { rings, cardWidths };
}

export default function Portfolio({ photos, categories }: { photos: Photo[]; categories: string[] }) {
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const swipeStart = useRef<number | null>(null);

  const isAll = category === "All";
  const visiblePhotos = useMemo(
    () => photos.filter((photo) => isAll || photo.cat === category),
    [photos, category, isAll]
  );
  const { rings, cardWidths } = useMemo(() => buildRings(visiblePhotos), [visiblePhotos]);

  const count = visiblePhotos.length;
  const current = open !== null ? visiblePhotos[open] : null;

  function changeCategory(nextCategory: string) {
    setCategory(nextCategory);
    setOpen(null);
  }
  function previousPhoto() {
    setOpen((index) => (index === null || count === 0 ? null : (index + count - 1) % count));
  }
  function nextPhoto() {
    setOpen((index) => (index === null || count === 0 ? null : (index + 1) % count));
  }

  useEffect(() => {
    if (open === null || count === 0) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((index) => (index === null ? null : (index + 1) % count));
      if (event.key === "ArrowLeft") setOpen((index) => (index === null ? null : (index + count - 1) % count));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, count]);

  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-5 py-24">
      <h2 className="font-serif text-5xl">Portfolio</h2>

      {/* Category buttons */}
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter portfolio">
        {["All", ...categories].map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => changeCategory(item)}
            className={`rounded-full px-4 py-1.5 text-sm ${category === item ? "bg-gold text-ink" : "gold-border"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {photos.length === 0 && <p className="mt-8 text-mute">New photos coming soon.</p>}

      {/* ALL tab = photos travelling around in orbit rings */}
      {isAll && rings.length > 0 && (
        <motion.div
          key="orbit"
          id="portfolio-gallery"
          className="orbit-stage mt-8"
          initial={{ opacity: 0, scale: 0.85, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {rings.map((ring, r) => (
            <div
              key={r}
              className="orbit-ring"
              style={{
                width: `${ring.size.toFixed(3)}%`,
                height: `${ring.size.toFixed(3)}%`,
                ["--dur" as string]: `${SPEED_SECONDS[r]}s`,
                ["--dir" as string]: r % 2 === 0 ? "normal" : "reverse",       // rings turn in opposite directions
                ["--dir-inv" as string]: r % 2 === 0 ? "reverse" : "normal",   // photos turn back so they stay upright
              } as React.CSSProperties}
            >
              {ring.photos.map(({ photo, index, angle }) => (
                <div
                  key={photo.src}
                  className="orbit-item"
                  style={{
                    left: `${(50 + 50 * Math.cos(angle)).toFixed(3)}%`,
                    top: `${(50 + 50 * Math.sin(angle)).toFixed(3)}%`,
                    // card width is % of the whole stage, converted to % of this ring
                    width: `${((cardWidths[r] / ring.size) * 100).toFixed(3)}%`,
                  }}
                >
                  <button type="button" className="orbit-photo" onClick={() => setOpen(index)} aria-label={`Open ${photo.alt}`}>
                    <img loading="lazy" decoding="async" src={photo.src} alt={photo.alt} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      )}

      {/* Other tabs (Weddings, Pre-Weddings...) = normal photo grid like before */}
      {!isAll && (
        <div id="portfolio-gallery" className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4">
          {visiblePhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setOpen(index)}
              className="gold-border group mb-4 block w-full overflow-hidden rounded-xl"
              aria-label={`Open ${photo.alt}`}
            >
              <img
                loading="lazy"
                decoding="async"
                width={photo.w}
                height={photo.h}
                src={photo.src}
                alt={photo.alt}
                className="h-auto w-full transition duration-500 group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen photo viewer */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio photo viewer"
            onClick={() => setOpen(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 rounded-full bg-char px-4 py-2"
              onClick={(event) => { event.stopPropagation(); setOpen(null); }}
            >
              Close
            </button>
            <button
              type="button"
              className="absolute left-3 z-10 rounded-full bg-black/50 px-3 py-2 text-4xl"
              aria-label="Previous photo"
              onClick={(event) => { event.stopPropagation(); previousPhoto(); }}
            >
              ‹
            </button>
            <motion.img
              key={current.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              src={current.src}
              alt={current.alt}
              className="max-h-[88vh] max-w-full rounded-lg object-contain"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={(event) => { swipeStart.current = event.touches[0].clientX; }}
              onTouchEnd={(event) => {
                if (swipeStart.current === null) return;
                const distance = event.changedTouches[0].clientX - swipeStart.current;
                swipeStart.current = null;
                if (Math.abs(distance) > 50) {
                  if (distance < 0) nextPhoto();
                  else previousPhoto();
                }
              }}
            />
            <button
              type="button"
              className="absolute right-3 z-10 rounded-full bg-black/50 px-3 py-2 text-4xl"
              aria-label="Next photo"
              onClick={(event) => { event.stopPropagation(); nextPhoto(); }}
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}