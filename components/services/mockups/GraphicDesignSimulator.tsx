"use client";

import { motion, AnimatePresence } from "framer-motion";
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
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFinish(f.id as MaterialFinish)}
                                className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold transition-all ${
                                    finish === f.id
                                        ? "bg-primary text-black font-extrabold"
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
                            <motion.div
                                animate={{
                                    rotateY: cardFlipped ? 180 : 0,
                                    y: [0, -6, 0],
                                }}
                                transition={{
                                    rotateY: { duration: 0.6 },
                                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                }}
                                style={{ transformStyle: "preserve-3d" }}
                                className="relative w-full max-w-sm aspect-[1.75/1] rounded-[10px] shadow-2xl overflow-hidden cursor-pointer"
                                onClick={() => setCardFlipped(!cardFlipped)}
                            >
                                {/* FRONT FACE */}
                                <div
                                    style={{ backfaceVisibility: "hidden" }}
                                    className={`absolute inset-0 p-6 flex flex-col justify-between transition-all duration-300 ${
                                        finish === "gold"
                                            ? "bg-[#0c0c0e] border-2 border-primary/60 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                                            : finish === "spotuv"
                                            ? "bg-zinc-950 border border-zinc-700"
                                            : "bg-[#141416] border border-zinc-800"
                                    }`}
                                >
                                    {/* Subtle light reflection sheen */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                                    <div className="flex items-center justify-between z-10">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-[6px] bg-primary flex items-center justify-center text-black font-black text-sm shadow-md">
                                                X
                                            </div>
                                            <span className="font-bold tracking-tight text-zinc-100 text-sm">
                                                XINTECK CAPITAL
                                            </span>
                                        </div>
                                        {finish === "gold" && (
                                            <span className="text-[10px] text-primary border border-primary/40 px-2 py-0.5 rounded font-mono font-bold">
                                                ★ Hot Gold Foil
                                            </span>
                                        )}
                                    </div>

                                    <div className="z-10">
                                        <h4 className="text-base font-bold text-zinc-100">David Mwangi</h4>
                                        <p className="text-xs text-primary font-semibold tracking-wide">
                                            Managing Director & Chief Executive
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-zinc-400 z-10 pt-2 border-t border-zinc-800/80">
                                        <span>Nairobi, Kenya</span>
                                        <span className="font-mono">david@xinteck.co.ke</span>
                                    </div>
                                </div>

                                {/* BACK FACE */}
                                <div
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                    }}
                                    className="absolute inset-0 bg-primary text-black p-6 flex flex-col items-center justify-center text-center shadow-2xl"
                                >
                                    <div className="w-12 h-12 rounded-[8px] bg-black text-primary flex items-center justify-center font-black text-xl mb-2 shadow-lg">
                                        X
                                    </div>
                                    <h4 className="font-black text-base tracking-wider uppercase">
                                        Xinteck Creative
                                    </h4>
                                    <p className="text-xs font-semibold text-black/80 mt-1">
                                        High-Impact Visual Identity & Boardroom Assets
                                    </p>
                                    <span className="text-[10px] font-mono text-black/60 mt-3">
                                        Tap to flip back
                                    </span>
                                </div>
                            </motion.div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                                <Sparkles size={13} className="text-primary" />
                                <span>Finish: <strong className="text-zinc-200 capitalize">{finish}</strong> · 450gsm Heavyweight Silk Stock</span>
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
