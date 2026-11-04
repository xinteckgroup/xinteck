"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Code,
    Compass,
    Copy,
    Eye,
    Figma,
    Layers,
    Layout,
    Maximize2,
    MousePointer,
    Move,
    Palette,
    Sliders,
    Sparkles,
    Type,
    Zap,
} from "lucide-react";
import { useState } from "react";

type FidelityMode = "wireframe" | "highfi";
type DesignTab = "canvas" | "tokens" | "prototype";

export function UiUxDesignSimulator() {
    const [fidelity, setFidelity] = useState<FidelityMode>("highfi");
    const [activeTab, setActiveTab] = useState<DesignTab>("canvas");
    const [selectedComponent, setSelectedComponent] = useState<string>("card");
    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    const copyToken = (val: string) => {
        setCopiedToken(val);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
            {/* Top Interactive Figma Control Bar */}
            <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white/40 dark:bg-black/90 backdrop-blur-xl border border-border/50 rounded-[10px] shadow-md text-xs">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-[8px]">
                    <button
                        onClick={() => setActiveTab("canvas")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "canvas"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Layout size={13} />
                        <span>Interactive Canvas</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("tokens")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "tokens"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Palette size={13} />
                        <span>Design Tokens</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("prototype")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "prototype"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <MousePointer size={13} />
                        <span>Flows & Handoff</span>
                    </button>
                </div>

                {/* Wireframe vs High-Fi Switch */}
                {activeTab === "canvas" && (
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-[6px]">
                        <button
                            onClick={() => setFidelity("wireframe")}
                            className={`px-2 py-0.5 rounded-[4px] font-bold text-[10px] transition-all ${
                                fidelity === "wireframe"
                                    ? "bg-zinc-700 text-white"
                                    : "text-foreground/70 hover:text-foreground"
                            }`}
                        >
                            Lo-Fi Wireframe
                        </button>
                        <button
                            onClick={() => setFidelity("highfi")}
                            className={`px-2 py-0.5 rounded-[4px] font-bold text-[10px] transition-all ${
                                fidelity === "highfi"
                                    ? "bg-primary text-black font-extrabold"
                                    : "text-foreground/70 hover:text-foreground"
                            }`}
                        >
                            Hi-Fi Final
                        </button>
                    </div>
                )}
            </div>

            {/* Canvas Artboard Container */}
            <div className="w-full rounded-[12px] overflow-hidden border border-border/80 bg-zinc-950 shadow-2xl">
                {/* Figma Artboard Header */}
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-300">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span>Mobile Checkout Flow · Artboard 04</span>
                        </div>
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                            393 × 852 px
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                        <span className="hidden sm:inline">100% Zoom</span>
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                            <Sparkles size={11} />
                            <span>Auto-Layout 5.0</span>
                        </div>
                    </div>
                </div>

                {/* Canvas Workspace */}
                <div className="p-4 md:p-6 min-h-[380px] bg-zinc-950 text-white flex flex-col justify-between">
                    {/* MODE 1: Canvas (Lo-Fi vs Hi-Fi) */}
                    {activeTab === "canvas" && (
                        <motion.div
                            key="canvas"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800/60">
                                <span>Component: {fidelity === "wireframe" ? "Structural Wireframe Skeleton" : "Production High-Fidelity UI"}</span>
                                <span className="font-mono text-primary text-[10px]">
                                    {fidelity === "wireframe" ? "User Journey Testing" : "Ready for Dev Inspection"}
                                </span>
                            </div>

                            {/* The App Card Mockup inside Canvas */}
                            <motion.div
                                layout
                                className={`p-5 rounded-[12px] border transition-all duration-300 flex flex-col gap-4 ${
                                    fidelity === "wireframe"
                                        ? "bg-zinc-900/40 border-dashed border-zinc-700"
                                        : "bg-gradient-to-br from-zinc-900 to-zinc-950 border-primary/30 shadow-xl"
                                }`}
                            >
                                {/* Card Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        {fidelity === "wireframe" ? (
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500 font-mono">
                                                IMG
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-black text-xs">
                                                XK
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            {fidelity === "wireframe" ? (
                                                <>
                                                    <div className="w-24 h-3 bg-zinc-800 rounded" />
                                                    <div className="w-16 h-2 bg-zinc-800/60 rounded mt-1" />
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-xs font-bold text-zinc-100">Executive Investment Portfolio</span>
                                                    <span className="text-[10px] text-emerald-400">Verified Safaricom Daraja</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {fidelity === "wireframe" ? (
                                        <div className="w-14 h-4 bg-zinc-800 rounded" />
                                    ) : (
                                        <span className="text-[10px] bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                                            +14.8% APY
                                        </span>
                                    )}
                                </div>

                                {/* Mid Section: Metric & Chart */}
                                <div className="p-4 rounded-[8px] bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
                                    {fidelity === "wireframe" ? (
                                        <>
                                            <div className="w-20 h-2 bg-zinc-800 rounded" />
                                            <div className="w-32 h-6 bg-zinc-700 rounded mt-1" />
                                            <div className="w-full h-12 bg-zinc-800/40 rounded border border-dashed border-zinc-700/60 flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                                                [ Interactive Chart Placeholder ]
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-[10px] text-zinc-400 uppercase font-bold">Net Portfolio Value</span>
                                            <span className="text-2xl font-black text-primary tracking-tight">KES 2,450,000</span>
                                            <div className="h-10 flex items-end gap-1.5 pt-2">
                                                {[30, 45, 60, 40, 75, 90, 85, 100].map((h, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{ height: `${h}%` }}
                                                        className={`flex-1 rounded-t-[2px] transition-all ${
                                                            idx === 7 ? "bg-primary" : "bg-primary/20 hover:bg-primary/50"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Action Button */}
                                {fidelity === "wireframe" ? (
                                    <div className="w-full py-3 bg-zinc-800 rounded-[6px] border border-dashed border-zinc-700 flex items-center justify-center text-xs text-zinc-500 font-mono">
                                        [ Button: CTA Deposit ]
                                    </div>
                                ) : (
                                    <button className="w-full py-3 bg-primary text-black font-extrabold text-xs rounded-[6px] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-lg">
                                        <span>Deposit via M-Pesa STK</span>
                                        <Sparkles size={13} />
                                    </button>
                                )}
                            </motion.div>

                            <p className="text-[11px] text-zinc-400 italic">
                                * Interactive prototypes let stakeholders test real navigation and conversion funnels before paying for engineering hours.
                            </p>
                        </motion.div>
                    )}

                    {/* MODE 2: Design Tokens */}
                    {activeTab === "tokens" && (
                        <motion.div
                            key="tokens"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-4 py-1"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Palette size={16} className="text-primary" />
                                    <span className="text-xs font-bold text-foreground">Global Token Architecture</span>
                                </div>
                                <span className="text-[10px] text-zinc-400">Tailwind & CSS Variables</span>
                            </div>

                            {/* Color Tokens */}
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Brand Color Palettes</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { name: "Brand Gold", hex: "#D4AF37", bg: "bg-[#D4AF37] text-black" },
                                        { name: "Deep Obsidian", hex: "#0A0A0B", bg: "bg-[#0A0A0B] text-white border border-zinc-700" },
                                        { name: "Emerald Signal", hex: "#10B981", bg: "bg-[#10B981] text-black" },
                                    ].map((t) => (
                                        <div
                                            key={t.name}
                                            onClick={() => copyToken(t.hex)}
                                            className="p-2.5 rounded-[8px] bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-primary/40 transition-all flex flex-col gap-2"
                                        >
                                            <div className={`h-8 rounded-[4px] ${t.bg} flex items-center justify-center font-mono text-[10px] font-bold`}>
                                                {copiedToken === t.hex ? "Copied!" : t.hex}
                                            </div>
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="text-zinc-300 font-semibold">{t.name}</span>
                                                <Copy size={10} className="text-zinc-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Spacing & Radius Tokens */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-3 rounded-[8px] bg-zinc-900/50 border border-zinc-800 flex flex-col gap-1">
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Border Radius</span>
                                    <span className="text-zinc-200 font-mono text-xs">rounded-[10px] (Cards)</span>
                                    <span className="text-zinc-400 text-[10px]">Uniform brand curves</span>
                                </div>
                                <div className="p-3 rounded-[8px] bg-zinc-900/50 border border-zinc-800 flex flex-col gap-1">
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Typography Scale</span>
                                    <span className="text-zinc-200 font-mono text-xs">Syne (Display) + Inter</span>
                                    <span className="text-zinc-400 text-[10px]">Optical legibility on mobile</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* MODE 3: Flows & Handoff */}
                    {activeTab === "prototype" && (
                        <motion.div
                            key="prototype"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-3 py-1"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Compass size={16} className="text-primary" />
                                    <span className="text-xs font-bold text-foreground">Interactive User Flows</span>
                                </div>
                                <span className="text-[10px] text-zinc-400">100% Dev Handoff Ready</span>
                            </div>

                            <div className="flex flex-col gap-2 text-xs">
                                {[
                                    {
                                        step: "1. Onboarding & Phone Verification",
                                        status: "Approved",
                                        time: "3 Screens",
                                        icon: CheckCircle2,
                                    },
                                    {
                                        step: "2. M-Pesa STK Push Payment Modal",
                                        status: "Interactive",
                                        time: "Haptic Micro-Interaction",
                                        icon: Zap,
                                    },
                                    {
                                        step: "3. Real-Time Account Dashboard",
                                        status: "Approved",
                                        time: "Responsive Desktop + Mobile",
                                        icon: CheckCircle2,
                                    },
                                    {
                                        step: "4. Error Fallbacks & Offline Prompts",
                                        status: "Approved",
                                        time: "Zero Dead Ends",
                                        icon: CheckCircle2,
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-[8px] bg-zinc-900/50 border border-zinc-800 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <item.icon size={16} className="text-primary shrink-0" />
                                            <div>
                                                <div className="font-semibold text-zinc-200">{item.step}</div>
                                                <div className="text-[10px] text-zinc-400">{item.time}</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Bottom Status Bar */}
                    <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <Figma size={11} className="text-primary" />
                            <span>Full Figma .FIG File + Component Variables</span>
                        </div>
                        <span className="font-mono text-zinc-400">Zero Dev Waste</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

