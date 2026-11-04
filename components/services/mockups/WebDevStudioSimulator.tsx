"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    ExternalLink,
    Gauge,
    Globe,
    Laptop,
    Lock,
    Moon,
    RefreshCw,
    Search,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Sun,
    Tablet,
    Zap,
} from "lucide-react";
import { useState } from "react";

type DeviceMode = "desktop" | "tablet" | "mobile";

export function WebDevStudioSimulator() {
    const [device, setDevice] = useState<DeviceMode>("desktop");
    const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
    const [activeTab, setActiveTab] = useState<"preview" | "lighthouse" | "checkout">("preview");
    const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing" | "success">("idle");

    const triggerCheckout = () => {
        setCheckoutStatus("processing");
        setTimeout(() => {
            setCheckoutStatus("success");
            setTimeout(() => setCheckoutStatus("idle"), 4000);
        }, 1500);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
            {/* Top Interactive Control Bar */}
            <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white/40 dark:bg-black/90 backdrop-blur-xl border border-border/50 rounded-[10px] shadow-md text-xs">
                {/* Device Selector */}
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-[8px]">
                    <button
                        onClick={() => setDevice("desktop")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            device === "desktop"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                        title="Desktop 4K View"
                    >
                        <Laptop size={14} />
                        <span className="hidden sm:inline">Desktop</span>
                    </button>
                    <button
                        onClick={() => setDevice("tablet")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            device === "tablet"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                        title="Tablet View"
                    >
                        <Tablet size={14} />
                        <span className="hidden sm:inline">Tablet</span>
                    </button>
                    <button
                        onClick={() => setDevice("mobile")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            device === "mobile"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                        title="Mobile Phone View"
                    >
                        <Smartphone size={14} />
                        <span className="hidden sm:inline">Mobile</span>
                    </button>
                </div>

                {/* Sub-view switcher & Theme toggle */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`px-2 py-1 rounded-[6px] transition-all font-medium ${
                            activeTab === "preview"
                                ? "bg-primary/15 text-primary border border-primary/30"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        Live UI
                    </button>
                    <button
                        onClick={() => setActiveTab("lighthouse")}
                        className={`px-2 py-1 rounded-[6px] transition-all font-medium flex items-center gap-1 ${
                            activeTab === "lighthouse"
                                ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Gauge size={12} />
                        <span>Lighthouse 100</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("checkout")}
                        className={`px-2 py-1 rounded-[6px] transition-all font-medium flex items-center gap-1 ${
                            activeTab === "checkout"
                                ? "bg-primary/20 text-primary border border-primary/40 font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <span>M-Pesa Pay</span>
                    </button>

                    <button
                        onClick={() => setPreviewTheme(previewTheme === "dark" ? "light" : "dark")}
                        className="p-1.5 text-foreground/70 hover:text-foreground bg-black/5 dark:bg-white/5 rounded-[6px] transition-colors ml-1"
                        title="Toggle Simulator Theme"
                    >
                        {previewTheme === "dark" ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-blue-500" />}
                    </button>
                </div>
            </div>

            {/* Viewport Frame */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                style={{
                    width: device === "desktop" ? "100%" : device === "tablet" ? "82%" : "52%",
                    minWidth: device === "mobile" ? "300px" : "100%",
                }}
                className="relative rounded-[14px] overflow-hidden border border-border/80 bg-zinc-950 shadow-2xl transition-all"
            >
                {/* Browser Address Chrome */}
                <div className="bg-zinc-900 border-b border-zinc-800 px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>

                    <div className="flex-1 max-w-sm mx-auto bg-zinc-950/80 border border-zinc-800 rounded-[6px] px-2.5 py-0.5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
                        <Lock size={10} className="text-emerald-400" />
                        <span className="text-emerald-400 font-medium">https://</span>
                        <span className="text-zinc-200 font-semibold truncate">yourcompany.co.ke</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500 shrink-0">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 py-0.5 rounded">0.4s</span>
                        <RefreshCw size={11} className="hover:text-zinc-300 cursor-pointer" />
                    </div>
                </div>

                {/* Viewport Content Area */}
                <div
                    className={`relative min-h-[380px] p-4 md:p-6 transition-colors duration-300 overflow-hidden ${
                        previewTheme === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
                    }`}
                >
                    {/* Mode 1: Live Interactive UI */}
                    {activeTab === "preview" && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-4"
                        >
                            {/* Simulated Site Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-[6px] bg-primary flex items-center justify-center text-black font-black text-xs">
                                        X
                                    </div>
                                    <span className="font-bold text-sm tracking-tight">Apex Capital</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-400">
                                    <span className="text-primary font-medium">Services</span>
                                    <span>Case Studies</span>
                                    <span>About</span>
                                </div>
                                <button className="px-2.5 py-1 text-xs bg-primary text-black font-bold rounded-[6px]">
                                    Client Portal
                                </button>
                            </div>

                            {/* Hero Banner inside preview */}
                            <div className="py-4 flex flex-col gap-2.5">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase w-fit">
                                    <Sparkles size={10} />
                                    Nairobi HQ · Sub-second Latency
                                </div>
                                <h3 className="text-lg md:text-xl font-black leading-tight tracking-tight">
                                    Institutional Wealth Management For East Africa.
                                </h3>
                                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                                    Engineered with Next.js 15, edge API caching, and automated M-Pesa investment deposits.
                                </p>
                            </div>

                            {/* Live Stats Row inside preview */}
                            <div className="grid grid-cols-3 gap-2 py-2">
                                <div className="p-2 rounded-[8px] bg-zinc-900/40 border border-zinc-800/60 flex flex-col">
                                    <span className="text-primary font-black text-sm">KES 1.8B+</span>
                                    <span className="text-[9px] text-zinc-400 uppercase font-medium">AUM Processed</span>
                                </div>
                                <div className="p-2 rounded-[8px] bg-zinc-900/40 border border-zinc-800/60 flex flex-col">
                                    <span className="text-emerald-400 font-black text-sm">99.98%</span>
                                    <span className="text-[9px] text-zinc-400 uppercase font-medium">Uptime Guarantee</span>
                                </div>
                                <div className="p-2 rounded-[8px] bg-zinc-900/40 border border-zinc-800/60 flex flex-col">
                                    <span className="text-amber-400 font-black text-sm">&lt; 0.6s</span>
                                    <span className="text-[9px] text-zinc-400 uppercase font-medium">Global Load</span>
                                </div>
                            </div>

                            {/* Mini Interactive CTA */}
                            <div className="mt-2 flex items-center justify-between p-3 rounded-[8px] bg-primary/10 border border-primary/30">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground">Interactive M-Pesa Test</span>
                                    <span className="text-[10px] text-foreground/70">Experience 1-click customer checkout</span>
                                </div>
                                <button
                                    onClick={() => setActiveTab("checkout")}
                                    className="px-3 py-1.5 bg-primary text-black font-extrabold text-xs rounded-[6px] hover:scale-105 transition-all flex items-center gap-1 shadow-md"
                                >
                                    <span>Try Pay</span>
                                    <ArrowRight size={12} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Mode 2: Google Lighthouse Audit Benchmark */}
                    {activeTab === "lighthouse" && (
                        <motion.div
                            key="lighthouse"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-4 py-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                        <Gauge size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">Official Google Lighthouse Audit</h4>
                                        <p className="text-[10px] text-zinc-400">Audited via Google Chrome DevTools Engine</p>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                                    Grade: A+
                                </span>
                            </div>

                            {/* The 4 Green Rings */}
                            <div className="grid grid-cols-4 gap-2 py-3 text-center">
                                {[
                                    { label: "Performance", score: 99, color: "text-emerald-400 border-emerald-500" },
                                    { label: "Accessibility", score: 100, color: "text-emerald-400 border-emerald-500" },
                                    { label: "Best Practices", score: 100, color: "text-emerald-400 border-emerald-500" },
                                    { label: "SEO / Schema", score: 100, color: "text-emerald-400 border-emerald-500" },
                                ].map((ring) => (
                                    <div
                                        key={ring.label}
                                        className="flex flex-col items-center p-2 rounded-[8px] bg-zinc-900/50 border border-zinc-800"
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-full border-2 ${ring.color} flex items-center justify-center mb-1 font-black text-sm bg-zinc-950`}
                                        >
                                            {ring.score}
                                        </div>
                                        <span className="text-[10px] font-semibold text-zinc-300 leading-tight">
                                            {ring.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Core Web Vitals Highlights */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="p-2 rounded-[6px] bg-zinc-900/40 border border-zinc-800/60">
                                    <div className="text-[9px] text-zinc-400 uppercase">First Contentful Paint</div>
                                    <div className="font-mono text-emerald-400 font-bold text-xs mt-0.5">0.32s (Fast)</div>
                                </div>
                                <div className="p-2 rounded-[6px] bg-zinc-900/40 border border-zinc-800/60">
                                    <div className="text-[9px] text-zinc-400 uppercase">Largest Contentful Paint</div>
                                    <div className="font-mono text-emerald-400 font-bold text-xs mt-0.5">0.68s (Fast)</div>
                                </div>
                                <div className="p-2 rounded-[6px] bg-zinc-900/40 border border-zinc-800/60">
                                    <div className="text-[9px] text-zinc-400 uppercase">Cumulative Layout Shift</div>
                                    <div className="font-mono text-emerald-400 font-bold text-xs mt-0.5">0.00 (Zero)</div>
                                </div>
                            </div>

                            <p className="text-[11px] text-zinc-400 italic">
                                * Websites loading under 1 second yield up to 3x higher lead generation and top Google Kenya search rankings.
                            </p>
                        </motion.div>
                    )}

                    {/* Mode 3: M-Pesa + Card Express Drawer */}
                    {activeTab === "checkout" && (
                        <motion.div
                            key="checkout"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-3 py-1"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-bold text-foreground">Daraja 2.0 Web Express Drawer</span>
                                </div>
                                <span className="text-[10px] text-zinc-400 font-mono">100% Secure Checkout</span>
                            </div>

                            <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400">Order:</span>
                                    <span className="font-semibold text-foreground">Annual Corporate Retainer</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400">Amount Due:</span>
                                    <span className="font-black text-primary text-base">KES 45,000</span>
                                </div>
                                <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/60">
                                    <span className="text-zinc-400">Phone Number:</span>
                                    <span className="font-mono text-zinc-200">0712 ••• 890 (Safaricom)</span>
                                </div>
                            </div>

                            {/* Trigger Button & Status */}
                            {checkoutStatus === "idle" && (
                                <button
                                    onClick={triggerCheckout}
                                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-[8px] shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Send M-Pesa STK Push to Phone</span>
                                    <ArrowRight size={14} />
                                </button>
                            )}

                            {checkoutStatus === "processing" && (
                                <div className="w-full py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-[8px] flex items-center justify-center gap-2 font-medium">
                                    <RefreshCw size={14} className="animate-spin" />
                                    <span>Sending STK Prompt to 0712 ••• 890...</span>
                                </div>
                            )}

                            {checkoutStatus === "success" && (
                                <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    className="w-full p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs rounded-[8px] flex items-center gap-2.5"
                                >
                                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                                    <div>
                                        <div className="font-bold">M-Pesa Verified! (Ref: QK8912LX4)</div>
                                        <div className="text-[10px] text-zinc-400">Receipt emailed & order recorded in CRM instantly.</div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 pt-1">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck size={11} className="text-emerald-400" />
                                    Safaricom Daraja API
                                </span>
                                <span>•</span>
                                <span>Visa / Mastercard 3D Secure</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Bottom Device Base for Desktop Mode */}
                {device === "desktop" && (
                    <div className="bg-zinc-900 border-t border-zinc-800 py-1.5 px-4 flex items-center justify-between text-[10px] text-zinc-500">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            <span>Next.js 15 App Router · Node Edge Runtime</span>
                        </div>
                        <span className="font-mono">Nairobi Edge PoP (12ms)</span>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

