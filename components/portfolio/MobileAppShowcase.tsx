"use client";

/**
 * MobileAppShowcase — Displays mobile app screenshots inside an Android phone
 * emulator with interactive navigation controls directly integrated beneath the device.
 *
 * Designed to sit on the LEFT side of the project portfolio page, with the case study
 * text in its own high-contrast card div on the RIGHT side.
 * The emulator itself is NOT enclosed in a background card div per specifications.
 */

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface MobileAppShowcaseProps {
  images: string[];
  title?: string;
  /** Auto-cycle interval in ms (default 4000) */
  interval?: number;
  className?: string;
}

export function MobileAppShowcase({
  images,
  title = "Mobile App",
  interval = 4000,
  className = "",
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
      className={`flex flex-col items-center gap-6 w-full max-w-[340px] ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ═══════════════════════════════════════════════════
          PHONE EMULATOR DISPLAYING PHOTOS (NO OUTER CARD DIV)
          ═══════════════════════════════════════════════════ */}
      <div className="relative flex-shrink-0 w-full" style={{ maxWidth: "330px" }}>
        {/* Outer Phone Frame */}
        <div className="relative rounded-[42px] border-[6px] border-[#1e1f24] bg-[#121316] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
          {/* Status bar / Notch */}
          <div className="relative z-20 flex items-center justify-center pt-2.5 pb-1 bg-[#121316]">
            <div className="w-[92px] h-[24px] bg-[#000] rounded-full flex items-center justify-center gap-2">
              <div className="w-[7px] h-[7px] rounded-full bg-[#1e1f24] border border-[#333]" />
            </div>
          </div>

          {/* Screen area with image slideshow - exact 576/1172 native aspect ratio */}
          <div className="relative bg-black overflow-hidden" style={{ aspectRatio: "576/1172" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[current]}
                  alt={`${title} — Screen ${current + 1}`}
                  fill
                  className="object-contain"
                  sizes="330px"
                  priority={current === 0}
                  unoptimized
                />
                {/* Diagonal glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom navigation pill */}
          <div className="relative z-20 flex items-center justify-center py-2 bg-[#121316]">
            <div className="w-[100px] h-[4px] bg-[#444] rounded-full" />
          </div>
        </div>

        {/* Side buttons (cosmetic hardware details) */}
        <div className="absolute right-[-8px] top-[105px] w-[3px] h-[50px] bg-[#333] rounded-r-sm" />
        <div className="absolute left-[-8px] top-[85px] w-[3px] h-[30px] bg-[#333] rounded-l-sm" />
        <div className="absolute left-[-8px] top-[125px] w-[3px] h-[50px] bg-[#333] rounded-l-sm" />

        {/* Floor drop shadow */}
        <div className="w-3/4 h-3 bg-black/80 blur-md rounded-full mx-auto mt-4 pointer-events-none" />
      </div>

      {/* ═══════════════════════════════════════════════════
          INTERACTIVE CONTROLS UNDER PHONE EMULATOR
          ═══════════════════════════════════════════════════ */}
      <div className="w-full flex flex-col gap-3.5 px-1 max-w-[330px]">
        {/* Active Screen Counter & Controls Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-primary">
              Screen {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          </div>

          {/* Pause / Play status toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-[8px] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-all cursor-pointer"
            title={isPaused ? "Resume auto-slideshow" : "Pause auto-slideshow"}
            aria-label={isPaused ? "Resume auto-slideshow" : "Pause auto-slideshow"}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>

        {/* Navigation Arrow Buttons */}
        <div className="flex items-center gap-2.5 w-full">
          <button
            onClick={prev}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] bg-white/5 hover:bg-primary/20 border border-primary/25 hover:border-primary/60 text-foreground hover:text-primary transition-all active:scale-95 group shadow-sm cursor-pointer"
            aria-label="Previous screenshot"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-semibold tracking-wide">Previous</span>
          </button>

          <button
            onClick={next}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] bg-primary text-black hover:bg-gold-hover transition-all active:scale-95 group shadow-sm cursor-pointer font-bold"
            aria-label="Next screenshot"
          >
            <span className="text-xs font-bold tracking-wide">Next</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Thumbnail Selector Grid */}
        {images.length > 1 && (
          <div className="flex flex-col gap-2 pt-1">
            <div className="grid grid-cols-5 gap-1.5 max-h-[140px] overflow-y-auto pr-0.5">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`relative aspect-[576/1172] bg-black/40 rounded-[6px] overflow-hidden border transition-all cursor-pointer ${
                    i === current
                      ? "border-primary ring-2 ring-primary/40 scale-105 shadow-md opacity-100"
                      : "border-white/10 opacity-50 hover:opacity-90 hover:border-white/30"
                  }`}
                  aria-label={`Jump to screenshot ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Screenshot ${i + 1}`}
                    fill
                    className="object-contain"
                    sizes="60px"
                    unoptimized
                  />
                </button>
              ))}
            </div>

            {/* Progress Dots Track */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  aria-label={`Jump to screenshot ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
