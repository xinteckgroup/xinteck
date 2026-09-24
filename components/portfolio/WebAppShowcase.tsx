"use client";

/**
 * WebAppShowcase — Displays web/dashboard screenshots in a clean browser-frame
 * slideshow with auto-cycling.
 *
 * Used for projects with category "WEB_DEV", "CUSTOM_SOFTWARE", etc.
 */

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface WebAppShowcaseProps {
  images: string[];
  title?: string;
  /** Auto-cycle interval in ms (default 5000) */
  interval?: number;
}

export function WebAppShowcase({
  images,
  title = "Web Application",
  interval = 5000,
}: WebAppShowcaseProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [isPaused, next, interval, images.length]);

  if (!images.length) return null;

  return (
    <div
      className="flex flex-col gap-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Browser Frame */}
      <div className="rounded-[12px] border border-primary/20 bg-[#1a1a1a] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#252525] border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-[#1a1a1a] rounded-md px-4 py-1 text-[10px] text-white/40 font-mono truncate max-w-[300px]">
              {title}
            </div>
          </div>
          <div className="w-[52px]" /> {/* Spacer to balance the dots */}
        </div>

        {/* Screen area - exact 1920/966 native resolution aspect ratio */}
        <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "1920/966" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[current]}
                alt={`${title} — Screen ${current + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority={current === 0}
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation controls */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/50 transition-all"
            aria-label="Previous screenshot"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Go to screenshot ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/50 transition-all"
            aria-label="Next screenshot"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
