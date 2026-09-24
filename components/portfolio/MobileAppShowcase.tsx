"use client";

/**
 * MobileAppShowcase — Displays mobile app screenshots inside an Android phone
 * frame with an auto-cycling slideshow.
 *
 * Reusable: any project with category "MOBILE_APP" will automatically get this
 * treatment. The admin only needs to upload images to the markdown case study.
 */

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface MobileAppShowcaseProps {
  images: string[];
  title?: string;
  /** Auto-cycle interval in ms (default 4000) */
  interval?: number;
}

export function MobileAppShowcase({
  images,
  title = "Mobile App",
  interval = 4000,
}: MobileAppShowcaseProps) {
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
      className="flex flex-col items-center gap-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Phone Frame */}
      <div className="relative mx-auto" style={{ width: "min(320px, 80vw)" }}>
        {/* Phone bezel */}
        <div className="relative rounded-[40px] border-[6px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
          {/* Status bar / notch */}
          <div className="relative z-20 flex items-center justify-center pt-2 pb-1 bg-[#1a1a1a]">
            <div className="w-[90px] h-[26px] bg-[#0a0a0a] rounded-full flex items-center justify-center gap-2">
              <div className="w-[8px] h-[8px] rounded-full bg-[#1a1a1a] border border-[#333]" />
            </div>
          </div>

          {/* Screen area */}
          <div className="relative bg-black overflow-hidden" style={{ aspectRatio: "9/19.5" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[current]}
                  alt={`${title} — Screen ${current + 1}`}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority={current === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom navigation bar */}
          <div className="relative z-20 flex items-center justify-center py-2 bg-[#1a1a1a]">
            <div className="w-[100px] h-[4px] bg-[#555] rounded-full" />
          </div>
        </div>

        {/* Side buttons (cosmetic) */}
        <div className="absolute right-[-8px] top-[100px] w-[3px] h-[50px] bg-[#333] rounded-r-sm" />
        <div className="absolute left-[-8px] top-[80px] w-[3px] h-[30px] bg-[#333] rounded-l-sm" />
        <div className="absolute left-[-8px] top-[120px] w-[3px] h-[50px] bg-[#333] rounded-l-sm" />
      </div>

      {/* Navigation controls */}
      {images.length > 1 && (
        <div className="flex items-center gap-4">
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
