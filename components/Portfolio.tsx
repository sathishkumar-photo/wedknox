"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { photos, categories } from "@/config/site";

const PREVIEW_COUNT = 8;

export default function Portfolio() {
  const [category, setCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const swipeStart = useRef<number | null>(null);

  const filteredPhotos = photos.filter(
    (photo) => category === "All" || photo.cat === category
  );

  const visiblePhotos =
    category === "All" && !showAll
      ? filteredPhotos.slice(0, PREVIEW_COUNT)
      : filteredPhotos;

  const canViewAll =
    category === "All" &&
    !showAll &&
    filteredPhotos.length > PREVIEW_COUNT;

  const count = visiblePhotos.length;
  const current = open !== null ? visiblePhotos[open] : null;

  function changeCategory(nextCategory: string) {
    setCategory(nextCategory);
    setShowAll(false);
    setOpen(null);
  }

  function previousPhoto() {
    setOpen((index) =>
      index === null || count === 0
        ? null
        : (index + count - 1) % count
    );
  }

  function nextPhoto() {
    setOpen((index) =>
      index === null || count === 0 ? null : (index + 1) % count
    );
  }

  useEffect(() => {
    if (open === null || count === 0) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);

      if (event.key === "ArrowRight") {
        setOpen((index) =>
          index === null ? null : (index + 1) % count
        );
      }

      if (event.key === "ArrowLeft") {
        setOpen((index) =>
          index === null ? null : (index + count - 1) % count
        );
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, count]);

  return (
    <section
      id="portfolio"
      className="mx-auto max-w-7xl px-5 py-24"
    >
      <h2 className="font-serif text-5xl">Portfolio</h2>

      {/* Category buttons */}
      <div
        className="mt-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter portfolio"
      >
        {["All", ...categories].map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => changeCategory(item)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              category === item
                ? "bg-gold text-ink"
                : "gold-border"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Photo gallery */}
      <div
        id="portfolio-gallery"
        className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4"
      >
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

      {/* Reveal the remaining photos */}
      {canViewAll && (
        <div className="mt-10 text-center">
          <p className="mb-4 text-sm text-mute" aria-live="polite">
            Showing {visiblePhotos.length} of {filteredPhotos.length} photos
          </p>

          <button
            type="button"
            aria-controls="portfolio-gallery"
            onClick={() => setShowAll(true)}
            className="rounded-full bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-soft"
          >
            View All Photos
          </button>
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
              onClick={(event) => {
                event.stopPropagation();
                setOpen(null);
              }}
            >
              Close
            </button>

            <button
              type="button"
              className="absolute left-3 z-10 rounded-full bg-black/50 px-3 py-2 text-4xl"
              aria-label="Previous photo"
              onClick={(event) => {
                event.stopPropagation();
                previousPhoto();
              }}
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
              onTouchStart={(event) => {
                swipeStart.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (swipeStart.current === null) return;

                const distance =
                  event.changedTouches[0].clientX - swipeStart.current;

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
              onClick={(event) => {
                event.stopPropagation();
                nextPhoto();
              }}
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}