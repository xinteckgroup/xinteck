"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    Award,
    Briefcase,
    CheckCircle2,
    Copy,
    Download,
    Eye,
    FileText,
    Image as ImageIcon,
    Layers,
    Palette,
    Printer,
    RotateCw,
    Share2,
    Sparkles,
    Sun,
    Type,
} from "lucide-react";
import { useState } from "react";

type MaterialFinish = "gold" | "matte" | "spotuv" | "emboss";
type AssetView = "card" | "profile" | "guidelines" | "social";

const CARD_FRONT = "/images/services/bs-card-front.jpg";
const CARD_BACK = "/images/services/bs-card-back.jpg";

export function GraphicDesignSimulator() {
    const [finish, setFinish] = useState<MaterialFinish>("gold");
    const [activeAsset, setActiveAsset] = useState<AssetView>("card");
    const [cardFlipped, setCardFlipped] = useState<boolean>(false);

    return (
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
            {/* Top Interactive Controls */}
            <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white/40 dark:bg-black/90 backdrop-blur-xl border border-border/50 rounded-[10px] shadow-md text-xs">
                {/* Asset Kit Switcher */}
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-[8px]">
                    <button
                        onClick={() => setActiveAsset("card")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeAsset === "card"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Briefcase size={13} />
                        <span>Executive Card</span>
                    </button>
                    <button
                        onClick={() => setActiveAsset("profile")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeAsset === "profile"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <FileText size={13} />
                        <span>Company Profile</span>
                    </button>
                    <button
                        onClick={() => setActiveAsset("guidelines")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeAsset === "guidelines"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Palette size={13} />
                        <span>Brand Book</span>
                    </button>
                </div>

                {/* Print Finish Selector */}
                {activeAsset === "card" && (
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-[6px]">
                        {[
                            { id: "gold", label: "Gold Foil" },
                            { id: "spotuv", label: "Spot UV" },
                            { id: "matte", label: "Velvet Matte" },
                            { id: "emboss", label: "Blind Emboss" },
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFinish(f.id as MaterialFinish)}
                                className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold transition-all cursor-pointer ${
                                    finish === f.id
                                        ? "bg-primary text-black font-extrabold shadow-sm"
                                        : "text-foreground/70 hover:text-foreground"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Showcase Container */}
            <div className="w-full rounded-[12px] overflow-hidden border border-border/80 bg-zinc-950 shadow-2xl">
                {/* Header Chrome */}
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-[6px] bg-primary flex items-center justify-center text-black font-black text-xs">
                            X
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-zinc-100">
                                {activeAsset === "card"
                                    ? "3D Executive Business Card Mockup"
                                    : activeAsset === "profile"
                                    ? "Corporate Company Profile PDF"
                                    : "Comprehensive Brand Guidelines Book"}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                                CMYK 300 DPI · Vector Formats (AI, EPS, PDF)
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {activeAsset === "card" && (
                            <button
                                onClick={() => setCardFlipped(!cardFlipped)}
                                className="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-medium transition-all"
                            >
                                <RotateCw size={12} />
                                <span>Flip Card</span>
                            </button>
                        )}
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                            Press Ready
                        </span>
                    </div>
                </div>

                {/* Interactive Display Workspace */}
                <div className="p-6 md:p-8 min-h-[380px] bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white flex flex-col justify-between items-center">
                    {/* ASSET 1: Executive Business Card 3D Mockup */}
                    {activeAsset === "card" && (
                        <div className="w-full flex flex-col items-center justify-center my-auto py-4">
                            {/* 3D Perspective Card Container */}
                            <div className="relative w-full max-w-[420px] aspect-[1.75/1] cursor-pointer group select-none" style={{ perspective: "1200px" }}>
                                <motion.div
                                    animate={{
                                        rotateY: cardFlipped ? 180 : 0,
                                        y: [0, -6, 0],
                                    }}
                                    transition={{
                                        rotateY: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
                                        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                                    }}
                                    style={{ transformStyle: "preserve-3d" }}
                                    className="relative w-full h-full rounded-[12px] shadow-2xl cursor-pointer"
                                    onClick={() => setCardFlipped(!cardFlipped)}
                                >
                                    {/* FRONT FACE (bs-card-front.jpg) */}
                                    <div
                                        style={{ backfaceVisibility: "hidden" }}
                                        className={`absolute inset-0 rounded-[12px] overflow-hidden transition-all duration-300 ${
                                            finish === "gold"
                                                ? "border-[2.5px] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_0_35px_rgba(212,175,55,0.35),0_20px_40px_rgba(0,0,0,0.85)]"
                                                : finish === "spotuv"
                                                ? "border border-cyan-400/50 ring-1 ring-cyan-400/20 shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
                                                : finish === "emboss"
                                                ? "border border-amber-600/40 ring-1 ring-black/40 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_8px_rgba(255,255,255,0.08),0_20px_40px_rgba(0,0,0,0.8)]"
                                                : "border border-zinc-700/80 ring-1 ring-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                                        }`}
                                    >
                                        <Image
                                            src={CARD_FRONT}
                                            alt="Xinteck Business Card — Front (bs-card-front.jpg)"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 90vw, 420px"
                                            priority
                                        />

                                        {/* FINISH OVERLAYS — FRONT */}
                                        {/* 1. Hot Gold Foil Effect */}
                                        {finish === "gold" && (
                                            <>
                                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-300/15 mix-blend-color-dodge z-10" />
                                                <motion.div
                                                    animate={{ x: ["-130%", "230%"] }}
                                                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                                                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#FFE885]/35 to-transparent skew-x-[-25deg] pointer-events-none z-10"
                                                />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#FFF3A8] to-[#D4AF37] px-2.5 py-0.5 rounded-full shadow-lg border border-amber-300/60 flex items-center gap-1">
                                                        <Sparkles size={11} className="text-black" /> 24K Gold Foil
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {/* 2. Spot UV Gloss Effect */}
                                        {finish === "spotuv" && (
                                            <>
                                                <motion.div
                                                    animate={{ x: ["-140%", "240%"] }}
                                                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                                                    className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-30deg] pointer-events-none z-10"
                                                />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-200 bg-cyan-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-lg border border-cyan-400/50 flex items-center gap-1">
                                                        <Sun size={11} className="text-cyan-400" /> High-Gloss Spot UV
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {/* 3. Velvet Matte Effect */}
                                        {finish === "matte" && (
                                            <>
                                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.35)_100%)] z-10" />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-200 bg-zinc-900/85 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-lg border border-zinc-700 flex items-center gap-1">
                                                        <Layers size={11} className="text-zinc-400" /> Velvet Matte 450gsm
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {/* 4. Deep Emboss Effect */}
                                        {finish === "emboss" && (
                                            <>
                                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/25 via-transparent to-white/10 mix-blend-overlay z-10" />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-lg border border-amber-600/50 flex items-center gap-1">
                                                        <Award size={11} className="text-amber-400" /> Blind Deboss Relief
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {/* Face label indicator */}
                                        <div className="absolute bottom-2.5 left-3 z-20">
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-white/80 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                                                Front Face
                                            </span>
                                        </div>
                                    </div>

                                    {/* BACK FACE (bs-card-back.jpg) */}
                                    <div
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}
                                        className={`absolute inset-0 rounded-[12px] overflow-hidden transition-all duration-300 ${
                                            finish === "gold"
                                                ? "border-[2.5px] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_0_35px_rgba(212,175,55,0.35),0_20px_40px_rgba(0,0,0,0.85)]"
                                                : finish === "spotuv"
                                                ? "border border-cyan-400/50 ring-1 ring-cyan-400/20 shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
                                                : finish === "emboss"
                                                ? "border border-amber-600/40 ring-1 ring-black/40 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_8px_rgba(255,255,255,0.08),0_20px_40px_rgba(0,0,0,0.8)]"
                                                : "border border-zinc-700/80 ring-1 ring-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                                        }`}
                                    >
                                        <Image
                                            src={CARD_BACK}
                                            alt="Xinteck Business Card — Back (bs-card-back.jpg)"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 90vw, 420px"
                                        />

                                        {/* FINISH OVERLAYS — BACK */}
                                        {finish === "gold" && (
                                            <>
                                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-300/15 mix-blend-color-dodge z-10" />
                                                <motion.div
                                                    animate={{ x: ["-130%", "230%"] }}
                                                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                                                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#FFE885]/35 to-transparent skew-x-[-25deg] pointer-events-none z-10"
                                                />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#FFF3A8] to-[#D4AF37] px-2.5 py-0.5 rounded-full shadow-lg border border-amber-300/60 flex items-center gap-1">
                                                        <Sparkles size={11} className="text-black" /> 24K Gold Foil
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {finish === "spotuv" && (
                                            <>
                                                <motion.div
                                                    animate={{ x: ["-140%", "240%"] }}
                                                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                                                    className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-30deg] pointer-events-none z-10"
                                                />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-200 bg-cyan-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-lg border border-cyan-400/50 flex items-center gap-1">
                                                        <Sun size={11} className="text-cyan-400" /> High-Gloss Spot UV
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {finish === "matte" && (
                                            <>
                                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.35)_100%)] z-10" />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-200 bg-zinc-900/85 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-lg border border-zinc-700 flex items-center gap-1">
                                                        <Layers size={11} className="text-zinc-400" /> Velvet Matte 450gsm
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {finish === "emboss" && (
                                            <>
                                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/25 via-transparent to-white/10 mix-blend-overlay z-10" />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-lg border border-amber-600/50 flex items-center gap-1">
                                                        <Award size={11} className="text-amber-400" /> Blind Deboss Relief
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {/* Face label indicator */}
                                        <div className="absolute bottom-2.5 left-3 z-20">
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-white/80 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                                                Back Face
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Interactive Flip Hint Button */}
                            <button
                                type="button"
                                onClick={() => setCardFlipped(!cardFlipped)}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-primary/30 text-zinc-200 text-xs font-semibold shadow-md transition-all cursor-pointer group"
                            >
                                <RotateCw size={13} className="text-primary group-hover:rotate-180 transition-transform duration-500" />
                                <span>{cardFlipped ? "Viewing Back · Tap to flip to Front" : "Viewing Front · Tap to flip to Back"}</span>
                            </button>

                            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400">
                                <div className="flex items-center gap-1.5 bg-zinc-900/70 border border-zinc-800/80 px-3 py-1 rounded-full text-[11px]">
                                    <Sparkles size={12} className="text-primary" />
                                    <span>Finish: <strong className="text-zinc-200 capitalize">{finish === 'gold' ? 'Hot Gold Foil (#D4AF37)' : finish === 'spotuv' ? 'Selective Spot UV' : finish === 'matte' ? 'Velvet Matte 450gsm' : 'Blind Letterpress Deboss'}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-zinc-900/70 border border-zinc-800/80 px-3 py-1 rounded-full text-[11px]">
                                    <Printer size={12} className="text-primary" />
                                    <span>300 DPI · 1050 × 600px · Press Calibrated</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ASSET 2: Company Profile & Pitch Deck */}
                    {activeAsset === "profile" && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full flex flex-col gap-4 py-2"
                        >
                            <div className="grid sm:grid-cols-3 gap-3">
                                {[
                                    { page: "Cover Page", desc: "Gold foil logo on deep obsidian background with embossed typography", tag: "Page 01" },
                                    { page: "Executive Summary", desc: "Financial charts, leadership roster, and corporate mission pillars", tag: "Page 02-04" },
                                    { page: "Case Studies & ROI", desc: "Enterprise metrics, high-res photography, and client testimonials", tag: "Page 05-08" },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-[8px] bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between gap-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded font-mono">
                                                {item.tag}
                                            </span>
                                            <FileText size={14} className="text-zinc-400" />
                                        </div>
                                        <h5 className="font-bold text-xs text-zinc-100">{item.page}</h5>
                                        <p className="text-[11px] text-zinc-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 rounded-[8px] bg-primary/10 border border-primary/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Printer size={20} className="text-primary" />
                                    <div>
                                        <span className="text-xs font-bold text-foreground">Dual Export Guarantee</span>
                                        <p className="text-[11px] text-foreground/70">
                                            You receive high-res 300 DPI CMYK for commercial printing + compressed interactive PDF for email pitches.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ASSET 3: Brand Guidelines Book */}
                    {activeAsset === "guidelines" && (
                        <motion.div
                            key="guidelines"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full flex flex-col gap-3 py-1"
                        >
                            <div className="p-4 rounded-[8px] bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800">
                                    <span className="font-bold text-zinc-200">Brand Identity Standard Book (35 Pages)</span>
                                    <span className="text-[10px] text-primary font-mono font-bold">100% Vector AI</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 rounded-[6px] bg-zinc-900/80 border border-zinc-800 flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400">Logo Clearspace & Exclusion Zones</span>
                                        <span className="text-zinc-300 text-[11px]">Exact rules for billboard & digital scaling</span>
                                    </div>
                                    <div className="p-2.5 rounded-[6px] bg-zinc-900/80 border border-zinc-800 flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400">Pantone & CMYK Color Swatches</span>
                                        <span className="text-zinc-300 text-[11px]">Lab-tested formulations for ink presses</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-zinc-400 italic text-center">
                                * Guarantees every supplier, printer, and digital agency uses your visual assets consistently without brand dilution.
                            </p>
                        </motion.div>
                    )}

                    {/* Bottom Status Ribbon */}
                    <div className="w-full mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <Award size={11} className="text-primary" />
                            <span>Full Copyright Ownership Assigned to Your Organization</span>
                        </div>
                        <span className="font-mono text-zinc-400">All Vector Formats Included</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
