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
    Figma,
    Layers,
    Layout,
    Palette,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface DesignPackage {
    id: string;
    title: string;
    screens: string;
    description: string;
    cost: number;
    days: number;
}

interface DesignAddon {
    id: string;
    label: string;
    description: string;
    cost: number;
    days: number;
    popular?: boolean;
}

const DESIGN_PACKAGES: DesignPackage[] = [
    {
        id: "mvp",
        title: "Rapid MVP Wireframe Sprint",
        screens: "10 – 15 Core Screens",
        description: "Focus on user flow, structural hierarchy & clickable user testing",
        cost: 65_000,
        days: 10,
    },
    {
        id: "prototype",
        title: "Full Interactive Figma Prototype",
        screens: "25 – 35 Screens",
        description: "High-fidelity visual design, responsive layouts & micro-interactions",
        cost: 120_000,
        days: 15,
    },
    {
        id: "enterprise",
        title: "Complete Mobile & Web Suite",
        screens: "50+ Cross-Platform Screens",
        description: "Full consumer app + admin management portal + investor demo deck",
        cost: 190_000,
        days: 25,
    },
];

const DESIGN_ADDONS: DesignAddon[] = [
    {
        id: "design-system",
        label: "Complete Design System & Token Library",
        description: "Typography scales, reusable UI components, and Figma variables for developers",
        cost: 35_000,
        days: 3,
        popular: true,
    },
    {
        id: "usability",
        label: "Kenyan User Usability Testing Sessions",
        description: "5 recorded moderated test sessions identifying UX bottlenecks before code",
        cost: 30_000,
        days: 3,
        popular: true,
    },
    {
        id: "darkmode",
        label: "Dual Theme: Dark & Light Mode",
        description: "Full parallel color schemes optimized for low-light legibility & OLED displays",
        cost: 20_000,
        days: 2,
    },
    {
        id: "handoff",
        label: "Developer Asset Export & Style Guide",
        description: "Ready-to-code SVG icons, CSS token mapping, and iOS/Android density assets",
        cost: 15_000,
        days: 2,
    },
];

export function UiUxScopeEstimator() {
    const [selectedPackage, setSelectedPackage] = useState<string>("prototype");
    const [selectedAddons, setSelectedAddons] = useState<string[]>([
        "design-system",
        "usability",
    ]);

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const currentPkg =
        DESIGN_PACKAGES.find((p) => p.id === selectedPackage) || DESIGN_PACKAGES[1];

    const { totalDesignCost, totalDesignWeeks } = useMemo(() => {
        let cost = currentPkg.cost;
        let days = currentPkg.days;

        DESIGN_ADDONS.forEach((a) => {
            if (selectedAddons.includes(a.id)) {
                cost += a.cost;
                days += a.days;
            }
        });

        const weeks = Math.ceil(days / 5);
        return { totalDesignCost: cost, totalDesignWeeks: weeks };
    }, [currentPkg, selectedAddons]);

    const bookHref = `/book?service=UI%2FUX+Design&budget=${encodeURIComponent(
        `KES ${totalDesignCost.toLocaleString("en-KE")}`
    )}`;

    return (
        <section id="scope-estimator" className="px-6 py-8 md:py-16 scroll-mt-24">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Interactive Design Planner
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        ESTIMATE YOUR UI/UX SPRINT & SCOPE.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Select your design fidelity and deliverables. Transparent pricing with full Figma file handover.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Packages & Add-ons (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* 1. Base Package Selection */}
                        <div className="flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 shadow-lg border border-border/50">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Step 1: Choose Design Scope & Fidelity
                            </span>
                            <div className="grid sm:grid-cols-3 gap-3 mt-1">
                                {DESIGN_PACKAGES.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg.id)}
                                        className={`p-4 rounded-[8px] text-left transition-all border flex flex-col justify-between gap-3 ${
                                            selectedPackage === pkg.id
                                                ? "bg-primary/10 border-primary ring-1 ring-primary/30"
                                                : "bg-white/40 dark:bg-zinc-900/40 border-border/50 hover:border-foreground/30"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-xs md:text-sm text-foreground">{pkg.title}</h4>
                                                {selectedPackage === pkg.id && (
                                                    <Check size={16} className="text-primary font-black shrink-0" />
                                                )}
                                            </div>
                                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded mt-1.5 inline-block">
                                                {pkg.screens}
                                            </span>
                                            <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
                                                {pkg.description}
                                            </p>
                                        </div>
                                        <div className="text-xs font-black text-primary pt-2 border-t border-border/30">
                                            {formatKES(pkg.cost)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Add-ons Selection */}
                        <div className="flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 shadow-lg border border-border/50">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Step 2: Add-on Systems & Research
                            </span>
                            <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                {DESIGN_ADDONS.map((addon) => {
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

                    {/* Right: Summary Card (4 cols) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <motion.div
                            layout
                            className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-xl border border-primary/30 flex flex-col gap-5"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Calculator size={18} className="text-primary" />
                                    <span className="font-bold text-sm text-foreground">Design Sprint Summary</span>
                                </div>
                                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                                    Full Figma Handover
                                </span>
                            </div>

                            {/* Base */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-foreground/80 font-medium">{currentPkg.title}</span>
                                <span className="font-bold text-foreground">{formatKES(currentPkg.cost)}</span>
                            </div>

                            {/* Addons List */}
                            {selectedAddons.length > 0 && (
                                <div className="flex flex-col gap-2 py-2 border-y border-border/40 text-xs">
                                    <span className="text-[10px] uppercase font-bold text-foreground/60">
                                        Included Enhancements ({selectedAddons.length})
                                    </span>
                                    {selectedAddons.map((id) => {
                                        const a = DESIGN_ADDONS.find((item) => item.id === id);
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

                            {/* Delivery Timeline */}
                            <div className="flex items-center justify-between p-3 rounded-[8px] bg-white/40 dark:bg-zinc-900/60 border border-border/40">
                                <div className="flex items-center gap-2 text-xs text-foreground/80">
                                    <Clock size={16} className="text-primary" />
                                    <span>Sprint Duration</span>
                                </div>
                                <span className="text-sm font-black text-primary">
                                    {totalDesignWeeks} Weeks
                                </span>
                            </div>

                            {/* Grand Total */}
                            <div className="flex flex-col gap-1 pt-2">
                                <span className="text-xs text-foreground/70 uppercase font-bold">Total Investment</span>
                                <span className="text-3xl font-black text-primary tracking-tight">
                                    {formatKES(totalDesignCost)}
                                </span>
                                <span className="text-[11px] text-foreground/60">
                                    50% sprint kick-off · 50% upon final Figma file delivery
                                </span>
                            </div>

                            {/* CTA */}
                            <Link
                                href={bookHref}
                                className={`${TYPOGRAPHY.button} w-full py-3.5 bg-primary text-black font-extrabold rounded-[8px] shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm`}
                            >
                                <span>Book Design Sprint</span>
                                <ArrowRight size={16} />
                            </Link>

                            <div className="flex items-center justify-center gap-2 text-[11px] text-foreground/60 text-center">
                                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                                <span>Includes interactive prototype link & developer handoff session</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

