"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink, Github } from "lucide-react";
import Image from "next/image";

interface AppEmulatorPreviewProps {
  image?: string;
  title: string;
}

/**
 * AppEmulatorPreview — Renders a sleek phone emulator mockup for mobile apps
 * in the portfolio listing grid (https://xinteck.co.ke/portfolio).
 *
 * Instead of a generic flat rectangular box, mobile apps are displayed inside
 * a realistic smartphone emulator with device bezel, notch, dynamic island,
 * screen glass sheen, and a floating floor shadow.
 */
export function AppEmulatorPreview({ image, title }: AppEmulatorPreviewProps) {
  return (
    <div className="relative aspect-[16/10] w-full rounded-[10px] bg-gradient-to-b from-white/[0.04] via-black/40 to-black/80 backdrop-blur-xl border border-primary/15 overflow-hidden group-hover:border-primary/40 transition-all duration-500 cursor-pointer flex items-center justify-center p-3 sm:p-4">
      {/* Ambient background glow behind the phone */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity duration-500" />

      {/* Subtle tech grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      {/* Phone Emulator Container - natural 576/1172 screenshot aspect ratio */}
      <div className="relative z-10 h-[92%] max-h-[280px] aspect-[576/1172] transition-transform duration-500 group-hover:-translate-y-1.5 flex flex-col items-center">
        {/* Device Frame */}
        <div className="relative w-full h-full rounded-[26px] border-[3.5px] border-[#25262b] bg-[#0c0d0f] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col">
          {/* Dynamic Island / Camera Notch */}
          <div className="relative z-10 w-full flex items-center justify-center pt-1.5 pb-0.5 bg-[#0c0d0f]">
            <div className="w-11 h-2 bg-black rounded-full flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1b1c20] border border-white/20" />
            </div>
          </div>

          {/* Screen Content - exact 1:1 contain without zoom or crop */}
          <div className="relative flex-1 w-full bg-black overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <Code2 size={40} className="text-gold" />
              </div>
            )}
            {/* Glass reflection sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none" />
          </div>

          {/* Bottom Home Indicator */}
          <div className="relative z-10 w-full flex items-center justify-center py-1 bg-[#0c0d0f]">
            <div className="w-10 h-0.5 bg-white/25 rounded-full" />
          </div>
        </div>

        {/* Side Buttons */}
        <div className="absolute -right-[4.5px] top-[42px] w-[2px] h-[28px] bg-[#3a3b40] rounded-r-xs" />
        <div className="absolute -left-[4.5px] top-[32px] w-[2px] h-[16px] bg-[#3a3b40] rounded-l-xs" />
        <div className="absolute -left-[4.5px] top-[54px] w-[2px] h-[24px] bg-[#3a3b40] rounded-l-xs" />

        {/* Floor Shadow */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-black/80 blur-md rounded-full pointer-events-none transition-all duration-500 group-hover:w-[90%] group-hover:opacity-100" />
      </div>

      {/* Floating App Badge */}
      <div className="absolute top-3 left-3 z-20">
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-gold border border-gold/30 rounded-full shadow-md">
          Mobile App
        </span>
      </div>

      {/* Hover action buttons */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 z-20 pointer-events-none">
        <div className="flex gap-2.5 justify-end">
          <div className="w-10 h-10 rounded-[8px] bg-primary text-black flex items-center justify-center hover:bg-gold-hover transition-all pointer-events-auto shadow-lg">
            <ExternalLink size={16} />
          </div>
          <div className="w-10 h-10 rounded-[8px] bg-black/60 backdrop-blur-xl border border-primary/20 text-white flex items-center justify-center hover:border-gold transition-all pointer-events-auto shadow-lg">
            <Github size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
