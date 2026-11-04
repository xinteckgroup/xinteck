"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { formatKES } from "@/lib/roi-calculator";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Calculator,
    Check,
    CheckCircle2,
    Clock,
    DollarSign,
    Globe,
    Layers,
    Lock,
    Search,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface BaseWebTier {
    id: string;
    title: string;
    desc: string;
    cost: number;
    days: number;
}

interface WebAddon {
    id: string;
    label: string;
    description: string;
    cost: number;
    days: number;
    popular?: boolean;
}

const BASE_TIERS: BaseWebTier[] = [
    {
        id: "landing",
        title: "High-Converting Landing Page",
        desc: "Single-page laser focus for marketing campaigns & lead capture",
        cost: 45_000,
        days: 7,
    },
    {
        id: "corporate",
        title: "Corporate Lead-Gen Website",
        desc: "Multi-page brand authority with services, case studies, and quote flow",
        cost: 85_000,
        days: 14,
    },
    {
        id: "ecommerce",
        title: "E-Commerce & Digital Store",
        desc: "Product catalog, shopping cart, customer accounts & inventory sync",
        cost: 140_000,
        days: 21,
    },
    {
        id: "portal",
        title: "Custom Client Portal / Web App",
        desc: "Secure login, user dashboards, automated reports & file sharing",
        cost: 210_000,
        days: 30,
    },
];

const ADDONS: WebAddon[] = [
    {
        id: "mpesa",
        label: "Daraja M-Pesa STK Push",
        description: "Instant 1-tap checkout prompt to customer phone",
        cost: 35_000,
        days: 3,
        popular: true,
    },
    {
        id: "cms",
        label: "No-Code Admin CMS",
        description: "Non-technical staff can update blogs, text, and images without code",
        cost: 25_000,
        days: 2,
        popular: true,
    },
    {
        id: "seo",
        label: "Google SEO & Schema Engine",
        description: "Structured JSON-LD, sitemap indexing, and search snippets",
        cost: 20_000,
        days: 2,
    },
    {
        id: "multicurrency",
        label: "Multi-Currency (KES / USD / EUR)",
        description: "Automatic geolocation currency detection and international card checkout",
        cost: 20_000,
        days: 2,
    },
];

export function WebScopeEstimator() {
    const [selectedTier, setSelectedTier] = useState<string>("corporate");
    const [selectedAddons, setSelectedAddons] = useState<string[]>(["mpesa", "cms"]);

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const currentBase = BASE_TIERS.find((t) => t.id === selectedTier) || BASE_TIERS[1];

    const { calculatedCost, calculatedWeeks } = useMemo(() => {
        let cost = currentBase.cost;
        let days = currentBase.days;

        ADDONS.forEach((a) => {
            if (selectedAddons.includes(a.id)) {
                cost += a.cost;
                days += a.days;
            }
        });

        const weeks = Math.ceil(days / 5);
        return { calculatedCost: cost, calculatedWeeks: weeks };
    }, [currentBase, selectedAddons]);

    const bookHref = `/book?service=Web+Development&budget=${encodeURIComponent(
        `KES ${calculatedCost.toLocaleString("en-KE")}`
    )}`;

    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Transparent Project Planner
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        ESTIMATE YOUR WEBSITE SCOPE & INVESTMENT.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Select your foundation and desired capabilities. No hidden consulting fees, no surprise invoices.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Tiers & Add-ons (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* 1. Base Tier Selection */}
                        <div className="flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 shadow-lg border border-border/50">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Step 1: Select Website Architecture
                            </span>
                            <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                {BASE_TIERS.map((tier) => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setSelectedTier(tier.id)}
                                        className={`p-4 rounded-[8px] text-left transition-all border flex flex-col justify-between gap-2 ${
                                            selectedTier === tier.id
                                                ? "bg-primary/10 border-primary ring-1 ring-primary/30"
                                                : "bg-white/40 dark:bg-zinc-900/40 border-border/50 hover:border-foreground/30"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-sm text-foreground">{tier.title}</h4>
                                                {selectedTier === tier.id && (
                                                    <Check size={16} className="text-primary font-black" />
                                                )}
                                            </div>
                                            <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                                                {tier.desc}
                                            </p>
                                        </div>
                                        <div className="text-xs font-black text-primary pt-2 border-t border-border/30">
                                            {formatKES(tier.cost)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Optional Add-ons */}
                        <div className="flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 shadow-lg border border-border/50">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Step 2: Tailor Integrated Capabilities
                            </span>
                            <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                {ADDONS.map((addon) => {
                                    const active = selectedAddons.includes(addon.id);
                                    return (
                                        <button
                                            key={addon.id}
                                            onClick={() => toggleAddon(addon.id)}
                                            className={`p-4 rounded-[8px] text-left transition-all border flex items-start gap-3 ${
                                                active
                                                    ? "bg-primary/10 border-primary ring-1 ring-primary/30"
                                                    : "bg-white/40 dark:bg-zinc-900/40 border-border/50 hover:border-foreground/30"
                                            }`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                                                    active
                                                        ? "bg-primary border-primary text-black"
                                                        : "border-border/80 bg-background"
                                                }`}
                                            >
                                                {active && <Check size={14} className="font-black" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-foreground">
                                                        {addon.label}
                                                    </span>
                                                    <span className="text-xs font-black text-primary">
                                                        +{formatKES(addon.cost)}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-foreground/70 mt-0.5 leading-snug">
                                                    {addon.description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Summary Receipt Card (4 cols) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <motion.div
                            layout
                            className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-xl border border-primary/30 flex flex-col gap-5"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Calculator size={18} className="text-primary" />
                                    <span className="font-bold text-sm text-foreground">Live Project Estimate</span>
                                </div>
                                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                                    Guaranteed Fixed
                                </span>
                            </div>

                            {/* Base */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-foreground/80 font-medium">{currentBase.title}</span>
                                <span className="font-bold text-foreground">{formatKES(currentBase.cost)}</span>
                            </div>

                            {/* Addons List */}
                            {selectedAddons.length > 0 && (
                                <div className="flex flex-col gap-2 py-2 border-y border-border/40 text-xs">
                                    <span className="text-[10px] uppercase font-bold text-foreground/60">
                                        Selected Integrations ({selectedAddons.length})
                                    </span>
                                    {selectedAddons.map((id) => {
                                        const a = ADDONS.find((item) => item.id === id);
                                        if (!a) return null;
                                        return (
                                            <div key={id} className="flex items-center justify-between text-foreground/70">
                                                <span className="truncate pr-2">{a.label}</span>
                                                <span className="font-semibold text-foreground/90 shrink-0">
                                                    +{formatKES(a.cost)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Timeline & Delivery */}
                            <div className="flex items-center justify-between p-3 rounded-[8px] bg-white/40 dark:bg-zinc-900/60 border border-border/40">
                                <div className="flex items-center gap-2 text-xs text-foreground/80">
                                    <Clock size={16} className="text-primary" />
                                    <span>Estimated Delivery</span>
                                </div>
                                <span className="text-sm font-black text-primary">
                                    {calculatedWeeks} {calculatedWeeks === 1 ? "Week" : "Weeks"}
                                </span>
                            </div>

                            {/* Grand Total */}
                            <div className="flex flex-col gap-1 pt-2">
                                <span className="text-xs text-foreground/70 uppercase font-bold">Total Investment</span>
                                <span className="text-3xl font-black text-primary tracking-tight">
                                    {formatKES(calculatedCost)}
                                </span>
                                <span className="text-[11px] text-foreground/60">
                                    50% milestone kick-off · 50% upon store/domain launch
                                </span>
                            </div>

                            {/* Direct CTA */}
                            <Link
                                href={bookHref}
                                className={`${TYPOGRAPHY.button} w-full py-3.5 bg-primary text-black font-extrabold rounded-[8px] shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm`}
                            >
                                <span>Lock In This Estimate</span>
                                <ArrowRight size={16} />
                            </Link>

                            <div className="flex items-center justify-center gap-2 text-[11px] text-foreground/60 text-center">
                                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                                <span>Includes 90-day post-launch warranty & free staff training</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

