"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock,
    DollarSign,
    Gauge,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function WebSpeedBenchmark() {
    const [selectedSpeed, setSelectedSpeed] = useState<"xinteck" | "legacy">("xinteck");

    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        The 3-Second Rule
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        WHY SUB-SECOND SPEED DECIDES YOUR REVENUE.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Over 53% of Kenyan mobile visitors abandon a website if it takes longer than 3 seconds to load. Here is how modern architecture directly impacts your bottom line.
                    </p>
                </div>

                {/* Interactive Toggle Switch */}
                <div className="flex justify-center">
                    <div className="bg-white/40 dark:bg-black/90 backdrop-blur-xl border border-border/50 p-1.5 rounded-[10px] inline-flex items-center gap-2 shadow-md">
                        <button
                            onClick={() => setSelectedSpeed("xinteck")}
                            className={`px-5 py-2.5 rounded-[8px] text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                                selectedSpeed === "xinteck"
                                    ? "bg-primary text-black shadow-md"
                                    : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                        >
                            <Zap size={16} />
                            <span>Xinteck Next.js Edge (0.6s)</span>
                        </button>
                        <button
                            onClick={() => setSelectedSpeed("legacy")}
                            className={`px-5 py-2.5 rounded-[8px] text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                                selectedSpeed === "legacy"
                                    ? "bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/40 shadow-md"
                                    : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                        >
                            <AlertTriangle size={16} />
                            <span>Legacy WordPress / Shared Hosting (4.8s)</span>
                        </button>
                    </div>
                </div>

                {/* Comparison Showcase Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Card: Xinteck Architecture */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`flex flex-col gap-6 p-6 md:p-8 rounded-[10px] backdrop-blur-xl transition-all shadow-lg border ${
                            selectedSpeed === "xinteck"
                                ? "bg-primary/5 dark:bg-black/90 border-primary ring-2 ring-primary/20 scale-[1.01]"
                                : "bg-white/30 dark:bg-black/80 border-border/50 opacity-80"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                                    <Zap size={22} />
                                </div>
                                <div>
                                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>Xinteck Edge Architecture</h4>
                                    <span className="text-xs text-emerald-500 font-semibold">Sub-second Nairobi Edge CDN</span>
                                </div>
                            </div>
                            <span className="text-2xl md:text-3xl font-black text-emerald-500 font-mono">0.6s</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-[8px] bg-white/40 dark:bg-zinc-900/50 border border-border/40">
                                <span className="text-xs text-foreground/70 uppercase font-bold block mb-1">Mobile Drop-off</span>
                                <span className="text-2xl font-black text-emerald-500">3.2%</span>
                                <span className="text-[11px] text-foreground/60 block mt-0.5">96.8% stay & convert</span>
                            </div>
                            <div className="p-4 rounded-[8px] bg-white/40 dark:bg-zinc-900/50 border border-border/40">
                                <span className="text-xs text-foreground/70 uppercase font-bold block mb-1">Google Core Vitals</span>
                                <span className="text-2xl font-black text-primary">100 / 100</span>
                                <span className="text-[11px] text-foreground/60 block mt-0.5">Top organic SEO rank</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5 text-xs text-foreground/80">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-primary shrink-0" />
                                <span>Zero database cold-starts with static edge generation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-primary shrink-0" />
                                <span>Images auto-converted to AVIF/WebP under 45kb</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-primary shrink-0" />
                                <span>Instant Daraja M-Pesa STK push without page reloads</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground/70">Conversion Rate Lift</span>
                            <span className="text-sm font-extrabold text-emerald-500 flex items-center gap-1">
                                <TrendingUp size={16} />
                                +40% More Inquiries
                            </span>
                        </div>
                    </motion.div>

                    {/* Right Card: Legacy WordPress */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`flex flex-col gap-6 p-6 md:p-8 rounded-[10px] backdrop-blur-xl transition-all shadow-lg border ${
                            selectedSpeed === "legacy"
                                ? "bg-red-500/5 dark:bg-black/90 border-red-500 ring-2 ring-red-500/20 scale-[1.01]"
                                : "bg-white/30 dark:bg-black/80 border-border/50 opacity-80"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[8px] bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                                    <Clock size={22} />
                                </div>
                                <div>
                                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>Typical Legacy Website</h4>
                                    <span className="text-xs text-red-500 font-semibold">Bloated Plugins & Distant US Hosting</span>
                                </div>
                            </div>
                            <span className="text-2xl md:text-3xl font-black text-red-500 font-mono">4.8s</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-[8px] bg-white/40 dark:bg-zinc-900/50 border border-border/40">
                                <span className="text-xs text-foreground/70 uppercase font-bold block mb-1">Mobile Drop-off</span>
                                <span className="text-2xl font-black text-red-500">53.4%</span>
                                <span className="text-[11px] text-foreground/60 block mt-0.5">Half your ad budget lost</span>
                            </div>
                            <div className="p-4 rounded-[8px] bg-white/40 dark:bg-zinc-900/50 border border-border/40">
                                <span className="text-xs text-foreground/70 uppercase font-bold block mb-1">Google Core Vitals</span>
                                <span className="text-2xl font-black text-amber-500">42 / 100</span>
                                <span className="text-[11px] text-foreground/60 block mt-0.5">Penalized in search results</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5 text-xs text-foreground/80">
                            <div className="flex items-center gap-2 text-foreground/70">
                                <AlertTriangle size={16} className="text-red-500 shrink-0" />
                                <span>30+ unmaintained WordPress plugins creating security vulnerabilities</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/70">
                                <AlertTriangle size={16} className="text-red-500 shrink-0" />
                                <span>Heavy 5MB uncompressed banners stalling 3G/4G users</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/70">
                                <AlertTriangle size={16} className="text-red-500 shrink-0" />
                                <span>Clunky redirect gateways leading to abandoned carts</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground/70">Lost Opportunity</span>
                            <span className="text-sm font-extrabold text-red-500 flex items-center gap-1">
                                <TrendingDown size={16} />
                                Thousands Lost Monthly
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

