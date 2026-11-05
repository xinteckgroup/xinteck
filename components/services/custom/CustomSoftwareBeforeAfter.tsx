"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Database,
    FileSpreadsheet,
    Flame,
    Lock,
    QrCode,
    RefreshCw,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CustomSoftwareBeforeAfter() {
    const [viewMode, setViewMode] = useState<"after" | "before">("after");

    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        The Modernization Payoff
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        REPLACE CHAOTIC SPREADSHEETS WITH AUTOMATION.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Growing businesses hit a wall when relying on disjointed Excel sheets and WhatsApp groups. Here is the operational transformation our custom software delivers.
                    </p>
                </div>

                {/* Mode Selector */}
                <div className="flex justify-center">
                    <div className="bg-white/40 dark:bg-black/90 backdrop-blur-xl border border-border/50 p-1.5 rounded-[10px] inline-flex items-center gap-2 shadow-md">
                        <button
                            onClick={() => setViewMode("after")}
                            className={`px-5 py-2.5 rounded-[8px] text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                                viewMode === "after"
                                    ? "bg-primary text-black shadow-md font-extrabold"
                                    : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                        >
                            <ShieldCheck size={16} />
                            <span>Xinteck Engine (After)</span>
                        </button>
                        <button
                            onClick={() => setViewMode("before")}
                            className={`px-5 py-2.5 rounded-[8px] text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                                viewMode === "before"
                                    ? "bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/40 shadow-md font-extrabold"
                                    : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                        >
                            <ShieldAlert size={16} />
                            <span>Manual Chaos (Before)</span>
                        </button>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Modern Engineered System (After) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`flex flex-col gap-6 p-6 md:p-8 rounded-[10px] backdrop-blur-xl transition-all shadow-lg border ${
                            viewMode === "after"
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
                                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>Unified Xinteck Portal</h4>
                                    <span className="text-xs text-emerald-500 font-semibold">100% Automated Multi-Branch Control</span>
                                </div>
                            </div>
                            <span className="text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500 px-2.5 py-1 rounded-full">
                                Zero Discrepancies
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-[8px] bg-white/40 dark:bg-zinc-900/50 border border-border/40">
                                <span className="text-xs text-foreground/70 uppercase font-bold block mb-1">Time on Reporting</span>
                                <span className="text-2xl font-black text-emerald-500">Instant</span>
                                <span className="text-[11px] text-foreground/60 block mt-0.5">Real-time live analytics</span>
                            </div>
                            <div className="p-4 rounded-[8px] bg-white/40 dark:bg-zinc-900/50 border border-border/40">
                                <span className="text-xs text-foreground/70 uppercase font-bold block mb-1">KRA eTIMS Invoicing</span>
                                <span className="text-2xl font-black text-primary">1-Click</span>
                                <span className="text-[11px] text-foreground/60 block mt-0.5">QR & tax code auto-generated</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 text-xs text-foreground/80">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                                <span>Multi-branch inventory updates instantly when a sale happens in CBD or Westlands</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                                <span>Automated Safaricom Daraja M-Pesa STK push & bank transfer matching</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                                <span>Role-based access locks: Cashiers only see POS, managers approve dispatches</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground/70">Efficiency Gain</span>
                            <span className="text-sm font-extrabold text-emerald-500 flex items-center gap-1">
                                <TrendingUp size={16} />
                                Saves 15+ Hours / Week
                            </span>
                        </div>
                    </motion.div>

                    {/* Fragmented Spreadsheet Chaos (Before) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`flex flex-col gap-6 p-6 md:p-8 rounded-[10px] backdrop-blur-xl transition-all shadow-lg border ${
                            viewMode === "before"
                                ? "bg-red-500/5 dark:bg-black/90 border-red-500 ring-2 ring-red-500/20 scale-[1.01]"
                                : "bg-white/30 dark:bg-black/80 border-border/50 opacity-80"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[8px] bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                                    <FileSpreadsheet size={22} />
                                </div>
                                <div>
                                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>Excel & WhatsApp Workflow</h4>
                                    <span className="text-xs text-red-500 font-semibold">Fragile, Slow & Vulnerable to Shrinkage</span>
                                </div>
                            </div>
                            <span className="text-xs font-mono font-bold bg-red-500/15 text-red-500 px-2.5 py-1 rounded-full">
                                High Risk
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-[8px] bg-white/40 dark:bg-zinc-900/50 border border-border/40">
                                <span className="text-xs text-foreground/70 uppercase font-bold block mb-1">Time on Reporting</span>
                                <span className="text-2xl font-black text-red-500">4+ Hours</span>
                                <span className="text-[11px] text-foreground/60 block mt-0.5">Manual reconciliation headaches</span>
                            </div>
                            <div className="p-4 rounded-[8px] bg-white/40 dark:bg-zinc-900/50 border border-border/40">
                                <span className="text-xs text-foreground/70 uppercase font-bold block mb-1">Inventory Leakage</span>
                                <span className="text-2xl font-black text-amber-500">5–8% Loss</span>
                                <span className="text-[11px] text-foreground/60 block mt-0.5">Untracked stock shrinkage</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 text-xs text-foreground/80">
                            <div className="flex items-start gap-2.5 text-foreground/70">
                                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                <span>Spreadsheet formulas accidentally deleted or corrupted by staff</span>
                            </div>
                            <div className="flex items-start gap-2.5 text-foreground/70">
                                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                <span>No audit trail: impossible to prove who altered an order or deleted an invoice</span>
                            </div>
                            <div className="flex items-start gap-2.5 text-foreground/70">
                                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                <span>Manual KRA eTIMS portal typing causing severe month-end stress & penalties</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground/70">Hidden Cost</span>
                            <span className="text-sm font-extrabold text-red-500">
                                Leaking Millions Annually
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

