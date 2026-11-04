"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { formatKES } from "@/lib/roi-calculator";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Award,
    Briefcase,
    Calculator,
    Check,
    CheckCircle2,
    Clock,
    DollarSign,
    FileCheck,
    FileText,
    Layers,
    Palette,
    Printer,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface BrandPackage {
    id: string;
    title: string;
    deliverables: string;
    description: string;
    cost: number;
    days: number;
}

interface BrandAddon {
    id: string;
    label: string;
    description: string;
    cost: number;
    days: number;
    popular?: boolean;
}

const BRAND_PACKAGES: BrandPackage[] = [
    {
        id: "logo",
        title: "Corporate Logo & Visual Identity",
        deliverables: "3 Concepts · All Formats",
        description: "Primary & secondary logos, typography system, color palette, and vector export kit",
        cost: 35_000,
        days: 5,
    },
    {
        id: "stationery",
        title: "Executive Stationery Suite",
        deliverables: "Cards, Letterheads & Envelopes",
        description: "Luxury business cards, digital invoice letterhead templates, branded folders & email signatures",
        cost: 55_000,
        days: 7,
    },
    {
        id: "profile",
        title: "Investor Pitch Deck & Profile",
        deliverables: "12 – 16 Pages PDF & Print",
        description: "Boardroom-ready company profile, executive biography layouts, financial charts, and print CMYK files",
        cost: 75_000,
        days: 10,
    },
    {
        id: "rebrand",
        title: "Complete 360° Corporate Rebrand",
        deliverables: "Full Brand Transformation",
        description: "Everything above + full brand guidelines book, signage specifications, and social media launch suite",
        cost: 130_000,
        days: 15,
    },
];

const BRAND_ADDONS: BrandAddon[] = [
    {
        id: "guidelines",
        label: "35-Page Corporate Brand Standards Book",
        description: "Logo clearspace rules, forbidden usage, typography hierarchy, and Pantone color specs",
        cost: 25_000,
        days: 3,
        popular: true,
    },
    {
        id: "social",
        label: "Social Media Launch Pack (30 Templates)",
        description: "Editable Canva and Figma templates for LinkedIn, Instagram, WhatsApp status, and X",
        cost: 20_000,
        days: 2,
        popular: true,
    },
    {
        id: "merch",
        label: "Branded Merch, Uniform & Vehicle Wrap Specs",
        description: "Vector print-ready die lines for corporate shirts, caps, fleet vehicle wraps, and banners",
        cost: 25_000,
        days: 2,
    },
    {
        id: "print-press",
        label: "Nairobi Commercial Press Print Coordination",
        description: "We liaise directly with top commercial printers in Nairobi and inspect physical sample proofs",
        cost: 20_000,
        days: 2,
    },
];

export function GraphicScopeEstimator() {
    const [selectedPackage, setSelectedPackage] = useState<string>("stationery");
    const [selectedAddons, setSelectedAddons] = useState<string[]>([
        "guidelines",
        "social",
    ]);

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const currentPkg =
        BRAND_PACKAGES.find((p) => p.id === selectedPackage) || BRAND_PACKAGES[1];

    const { totalBrandCost, totalBrandWeeks } = useMemo(() => {
        let cost = currentPkg.cost;
        let days = currentPkg.days;

        BRAND_ADDONS.forEach((a) => {
            if (selectedAddons.includes(a.id)) {
                cost += a.cost;
                days += a.days;
            }
        });

        const weeks = Math.ceil(days / 5);
        return { totalBrandCost: cost, totalBrandWeeks: weeks };
    }, [currentPkg, selectedAddons]);

    const bookHref = `/book?service=Graphic+Design&budget=${encodeURIComponent(
        `KES ${totalBrandCost.toLocaleString("en-KE")}`
    )}`;

    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Brand Identity Estimator
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        ESTIMATE YOUR BRAND ASSET INVESTMENT.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Select your branding scope and deliverables. Clear pricing, unlimited concept exploration, and full legal copyright handover.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Packages & Add-ons (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* 1. Base Package */}
                        <div className="flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 shadow-lg border border-border/50">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Step 1: Select Brand Package
                            </span>
                            <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                {BRAND_PACKAGES.map((pkg) => (
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
                                                {pkg.deliverables}
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

                        {/* 2. Add-ons */}
                        <div className="flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 shadow-lg border border-border/50">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Step 2: Integrated Collateral & Guidelines
                            </span>
                            <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                {BRAND_ADDONS.map((addon) => {
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
                                    <span className="font-bold text-sm text-foreground">Brand Scope Summary</span>
                                </div>
                                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                                    Full Copyright
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
                                        Included Assets ({selectedAddons.length})
                                    </span>
                                    {selectedAddons.map((id) => {
                                        const a = BRAND_ADDONS.find((item) => item.id === id);
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

                            {/* Timeline */}
                            <div className="flex items-center justify-between p-3 rounded-[8px] bg-white/40 dark:bg-zinc-900/60 border border-border/40">
                                <div className="flex items-center gap-2 text-xs text-foreground/80">
                                    <Clock size={16} className="text-primary" />
                                    <span>Creative Turnaround</span>
                                </div>
                                <span className="text-sm font-black text-primary">
                                    {totalBrandWeeks} Weeks
                                </span>
                            </div>

                            {/* Grand Total */}
                            <div className="flex flex-col gap-1 pt-2">
                                <span className="text-xs text-foreground/70 uppercase font-bold">Total Investment</span>
                                <span className="text-3xl font-black text-primary tracking-tight">
                                    {formatKES(totalBrandCost)}
                                </span>
                                <span className="text-[11px] text-foreground/60">
                                    Includes all raw vector master files (AI, EPS, SVG, PDF) + unlimited concept revisions
                                </span>
                            </div>

                            {/* CTA */}
                            <Link
                                href={bookHref}
                                className={`${TYPOGRAPHY.button} w-full py-3.5 bg-primary text-black font-extrabold rounded-[8px] shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm`}
                            >
                                <span>Commission Brand Assets</span>
                                <ArrowRight size={16} />
                            </Link>

                            <div className="flex items-center justify-center gap-2 text-[11px] text-foreground/60 text-center">
                                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                                <span>100% money-back guarantee if you don't love the concepts</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
