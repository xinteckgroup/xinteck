"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Code,
    Cpu,
    Database,
    Globe,
    Layers,
    Lock,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Zap,
} from "lucide-react";

const STACK_PILLARS = [
    {
        title: "Next.js 15 App Router",
        desc: "Hybrid edge caching, server components, and instant navigation without full-page reloads.",
        icon: Zap,
        highlight: "Zero Delay",
    },
    {
        title: "Google First-Page SEO",
        desc: "Automated JSON-LD schemas, dynamic OpenGraph previews, and XML sitemaps for top rankings.",
        icon: Search,
        highlight: "Top Search Visibility",
    },
    {
        title: "Daraja M-Pesa & Card",
        desc: "Direct integration with Safaricom Daraja 2.0 API & Visa/Mastercard 3D Secure checkout.",
        icon: ShieldCheck,
        highlight: "Automated Reconciliation",
    },
    {
        title: "Nairobi Edge Caching",
        desc: "Assets cached directly at local African internet exchange points for sub-25ms mobile response.",
        icon: Globe,
        highlight: "Kenya Edge CDN",
    },
];

export function WebTechStackShowcase() {
    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        The Foundation
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        BUILT FOR SEARCH ENGINES & HIGH CONVERSION.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Every website we engineer comes pre-wired for Google search dominance, instant mobile load times, and bank-grade security.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-center">
                    {/* Left: 4 Pillars Grid (7 cols) */}
                    <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
                        {STACK_PILLARS.map((pillar, i) => {
                            const Icon = pillar.icon;
                            return (
                                <motion.div
                                    key={pillar.title}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-border/50 flex flex-col gap-3 shadow-lg hover:border-primary/40 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-bold">
                                            <Icon size={20} />
                                        </div>
                                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {pillar.highlight}
                                        </span>
                                    </div>
                                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground text-base`}>
                                        {pillar.title}
                                    </h4>
                                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                                        {pillar.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right: Live Google Search Result Rich Snippet (5 cols) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 border border-border/50 shadow-xl flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <Search size={16} className="text-primary" />
                                <span className="text-xs font-bold text-foreground">Google Kenya Search Preview</span>
                            </div>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-mono font-bold px-2 py-0.5 rounded-full">
                                Position #1 Organic
                            </span>
                        </div>

                        {/* Simulated Google SERP Card */}
                        <div className="p-4 rounded-[8px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-[9px]">
                                    X
                                </div>
                                <span className="truncate">https://yourcompany.co.ke</span>
                                <span>›</span>
                                <span>services</span>
                            </div>

                            <a className="text-blue-600 dark:text-blue-400 font-medium text-base hover:underline line-clamp-1 cursor-pointer">
                                Premier Corporate Solutions Nairobi | Official Website
                            </a>

                            <div className="flex items-center gap-1.5 text-xs text-amber-500">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} size={11} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="font-bold text-zinc-700 dark:text-zinc-300">5.0</span>
                                <span className="text-zinc-500 text-[11px]">(48 client reviews) · Licensed & Verified</span>
                            </div>

                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug line-clamp-2">
                                Trusted corporate partner in Nairobi. Lightning-fast digital onboarding, instant M-Pesa payments, and 24/7 dedicated client support.
                            </p>

                            {/* Google Sitelinks */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                                <div>
                                    <div className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">
                                        Client Portal
                                    </div>
                                    <div className="text-[10px] text-zinc-500">Access your dashboard</div>
                                </div>
                                <div>
                                    <div className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">
                                        Schedule Consultation
                                    </div>
                                    <div className="text-[10px] text-zinc-500">Direct booking link</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-foreground/70 italic">
                            <CheckCircle2 size={13} className="text-primary shrink-0" />
                            <span>Structured Schema.org markup guarantees rich snippets like ratings & sitelinks.</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

